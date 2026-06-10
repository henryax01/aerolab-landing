import importlib
import os
import pkgutil
import sys
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext

BACKEND_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BACKEND_DIR))

load_dotenv(BACKEND_DIR / ".env")

from utils.web3mongo import db, users  # noqa: E402

app = FastAPI(title="Landing Progresiva API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@aerolab.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")


def discover_routers() -> None:
    """Escanea apis/**/*.py y registra cualquier módulo que exponga `router`."""
    apis_dir = BACKEND_DIR / "apis"
    for finder, module_name, is_pkg in pkgutil.walk_packages([str(apis_dir)], prefix="apis."):
        if is_pkg:
            continue
        module = importlib.import_module(module_name)
        router = getattr(module, "router", None)
        if router is not None:
            app.include_router(router)
            print(f"[router] registrado: {module_name}")


discover_routers()


@app.on_event("startup")
async def seed_admin_user() -> None:
    existing = await users.find_one({"email": ADMIN_EMAIL})
    if not existing:
        await users.insert_one({
            "name": "Administrador",
            "email": ADMIN_EMAIL,
            "password": pwd_context.hash(ADMIN_PASSWORD),
            "role": "admin",
        })
        print(f"[seed] Usuario administrador creado: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")


PLACEHOLDER_STRIPE_KEYS = {"", "sk_test_dummy", "sk_test_YOUR_KEY_HERE"}


@app.get("/api/health")
async def health():
    checks = {}

    try:
        await db.command("ping")
        checks["database"] = "ok"
    except Exception:
        checks["database"] = "error"

    stripe_key = os.getenv("STRIPE_SECRET_KEY", "")
    if stripe_key in PLACEHOLDER_STRIPE_KEYS:
        checks["stripe"] = "not_configured"
    elif stripe_key.startswith("sk_"):
        checks["stripe"] = "ok"
    else:
        checks["stripe"] = "error"

    healthy = checks["database"] == "ok"
    return {
        "success": healthy,
        "message": "Servidor en funcionamiento." if healthy else "La base de datos no está disponible.",
        "checks": checks,
    }
