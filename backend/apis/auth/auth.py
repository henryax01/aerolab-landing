import base64
import io
import os
import secrets
from datetime import datetime, timedelta, timezone

import pyotp
import qrcode
from fastapi import APIRouter, Depends, HTTPException
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr

from utils.web3mongo import users
from utils.auth.session import (
    create_access_token,
    create_2fa_challenge_token,
    verify_2fa_challenge_token,
    verify_session,
)
from utils.email import (
    send_email,
    welcome_email_html,
    verification_email_html,
    password_reset_email_html,
)

router = APIRouter(prefix="/api", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
RESET_TOKEN_EXPIRE_MINUTES = 60
TOTP_ISSUER = "Aerolab"
BACKUP_CODE_COUNT = 8


class RegisterPayload(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginPayload(BaseModel):
    email: EmailStr
    password: str


class VerifyEmailPayload(BaseModel):
    token: str


class ForgotPasswordPayload(BaseModel):
    email: EmailStr


class ResetPasswordPayload(BaseModel):
    token: str
    password: str


class TwoFactorCodePayload(BaseModel):
    code: str


class TwoFactorLoginPayload(BaseModel):
    challengeToken: str
    code: str


def public_user(user: dict) -> dict:
    return {
        "name": user["name"],
        "email": user["email"],
        "role": user.get("role", "customer"),
        "emailVerified": user.get("email_verified", False),
        "twoFactorEnabled": user.get("totp_enabled", False),
    }


def build_qr_data_uri(otpauth_url: str) -> str:
    image = qrcode.make(otpauth_url)
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
    return f"data:image/png;base64,{encoded}"


def generate_backup_codes() -> list[str]:
    codes = []
    for _ in range(BACKUP_CODE_COUNT):
        raw = secrets.token_hex(4).upper()
        codes.append(f"{raw[:4]}-{raw[4:]}")
    return codes


def verify_totp_or_backup_code(db_user: dict, code: str) -> tuple[bool, str | None]:
    """Devuelve (es_valido, hash_del_codigo_de_respaldo_consumido)."""
    secret = db_user.get("totp_secret")
    if secret and pyotp.TOTP(secret).verify(code, valid_window=1):
        return True, None

    for hashed in db_user.get("backup_codes") or []:
        if pwd_context.verify(code, hashed):
            return True, hashed

    return False, None


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def verification_link(token: str) -> str:
    return f"{FRONTEND_URL}/account?verify={token}"


def reset_link(token: str) -> str:
    return f"{FRONTEND_URL}/account?reset={token}"


@router.post("/register")
async def register(payload: RegisterPayload):
    email = payload.email.lower().strip()

    existing = await users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe una cuenta con ese correo.")

    verification_token = secrets.token_urlsafe(32)
    user_doc = {
        "name": payload.name.strip(),
        "email": email,
        "password": pwd_context.hash(payload.password),
        "role": "customer",
        "email_verified": False,
        "verification_token": verification_token,
        "totp_enabled": False,
    }
    result = await users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    await send_email(
        user_doc["email"],
        "¡Bienvenido a nuestra plataforma!",
        welcome_email_html(user_doc["name"], user_doc["email"], verification_link(verification_token)),
    )

    token = create_access_token(user_doc)
    return {"success": True, "token": token, "user": public_user(user_doc)}


@router.post("/login")
async def login(payload: LoginPayload):
    email = payload.email.lower().strip()
    user = await users.find_one({"email": email})

    if not user or not pwd_context.verify(payload.password, user["password"]):
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrecta.")

    if user.get("totp_enabled"):
        return {
            "success": True,
            "requires2FA": True,
            "challengeToken": create_2fa_challenge_token(user["email"]),
        }

    token = create_access_token(user)
    return {"success": True, "token": token, "user": public_user(user)}


@router.post("/login/2fa")
async def verify_login_two_factor(payload: TwoFactorLoginPayload):
    email = verify_2fa_challenge_token(payload.challengeToken)
    user = await users.find_one({"email": email})
    if not user or not user.get("totp_enabled"):
        raise HTTPException(status_code=400, detail="La verificación en dos pasos no está activa para esta cuenta.")

    is_valid, consumed_backup_code = verify_totp_or_backup_code(user, payload.code.strip())
    if not is_valid:
        raise HTTPException(status_code=401, detail="El código ingresado no es válido.")

    if consumed_backup_code:
        await users.update_one({"_id": user["_id"]}, {"$pull": {"backup_codes": consumed_backup_code}})

    token = create_access_token(user)
    return {"success": True, "token": token, "user": public_user(user)}


@router.post("/2fa/setup")
async def setup_two_factor(user: dict = Depends(verify_session)):
    db_user = await users.find_one({"email": user["email"]})
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    if db_user.get("totp_enabled"):
        raise HTTPException(status_code=400, detail="La verificación en dos pasos ya está activa.")

    secret = pyotp.random_base32()
    await users.update_one({"_id": db_user["_id"]}, {"$set": {"totp_secret": secret}})
    otpauth_url = pyotp.TOTP(secret).provisioning_uri(name=db_user["email"], issuer_name=TOTP_ISSUER)
    return {
        "success": True,
        "secret": secret,
        "otpauthUrl": otpauth_url,
        "qrCode": build_qr_data_uri(otpauth_url),
    }


@router.post("/2fa/enable")
async def enable_two_factor(payload: TwoFactorCodePayload, user: dict = Depends(verify_session)):
    db_user = await users.find_one({"email": user["email"]})
    secret = db_user.get("totp_secret") if db_user else None
    if not db_user or not secret:
        raise HTTPException(status_code=400, detail="Primero debes generar un código QR de configuración.")

    if not pyotp.TOTP(secret).verify(payload.code.strip(), valid_window=1):
        raise HTTPException(status_code=400, detail="El código ingresado no es válido.")

    backup_codes = generate_backup_codes()
    await users.update_one(
        {"_id": db_user["_id"]},
        {"$set": {"totp_enabled": True, "backup_codes": [pwd_context.hash(code) for code in backup_codes]}},
    )
    return {"success": True, "backupCodes": backup_codes}


@router.post("/2fa/disable")
async def disable_two_factor(payload: TwoFactorCodePayload, user: dict = Depends(verify_session)):
    db_user = await users.find_one({"email": user["email"]})
    if not db_user or not db_user.get("totp_enabled"):
        raise HTTPException(status_code=400, detail="La verificación en dos pasos no está activa.")

    is_valid, _ = verify_totp_or_backup_code(db_user, payload.code.strip())
    if not is_valid:
        raise HTTPException(status_code=400, detail="El código ingresado no es válido.")

    await users.update_one(
        {"_id": db_user["_id"]},
        {"$set": {"totp_enabled": False}, "$unset": {"totp_secret": "", "backup_codes": ""}},
    )
    return {"success": True}


@router.post("/verify-email")
async def verify_email(payload: VerifyEmailPayload):
    user = await users.find_one({"verification_token": payload.token})
    if not user:
        raise HTTPException(status_code=400, detail="El enlace de verificación no es válido o ya fue usado.")

    await users.update_one(
        {"_id": user["_id"]},
        {"$set": {"email_verified": True}, "$unset": {"verification_token": ""}},
    )
    return {"success": True, "message": "Tu correo fue verificado correctamente."}


@router.post("/resend-verification")
async def resend_verification(user: dict = Depends(verify_session)):
    db_user = await users.find_one({"email": user["email"]})
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    if db_user.get("email_verified"):
        return {"success": True, "message": "Tu correo ya está verificado."}

    verification_token = db_user.get("verification_token") or secrets.token_urlsafe(32)
    await users.update_one({"_id": db_user["_id"]}, {"$set": {"verification_token": verification_token}})

    await send_email(
        db_user["email"],
        "Confirma tu correo",
        verification_email_html(db_user["name"], verification_link(verification_token)),
    )
    return {"success": True, "message": "Te reenviamos el correo de verificación."}


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordPayload):
    email = payload.email.lower().strip()
    user = await users.find_one({"email": email})

    if user:
        token = secrets.token_urlsafe(32)
        expires_at = utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)
        await users.update_one(
            {"_id": user["_id"]},
            {"$set": {"reset_token": token, "reset_token_expires": expires_at}},
        )
        await send_email(
            user["email"],
            "Restablece tu contraseña",
            password_reset_email_html(user["name"], reset_link(token)),
        )

    return {
        "success": True,
        "message": "Si el correo existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña.",
    }


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordPayload):
    user = await users.find_one({"reset_token": payload.token})
    if not user:
        raise HTTPException(status_code=400, detail="El enlace de restablecimiento no es válido o ya fue usado.")

    expires_at = user.get("reset_token_expires")
    if not expires_at or expires_at < utcnow():
        raise HTTPException(status_code=400, detail="El enlace de restablecimiento expiró. Solicita uno nuevo.")

    await users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {"password": pwd_context.hash(payload.password)},
            "$unset": {"reset_token": "", "reset_token_expires": ""},
        },
    )
    return {"success": True, "message": "Tu contraseña fue actualizada correctamente."}


class UpdateProfilePayload(BaseModel):
    name: str | None = None
    password: str | None = None


@router.patch("/users/me")
async def update_profile(payload: UpdateProfilePayload, current_user: dict = Depends(verify_session)):
    update: dict = {}
    if payload.name and payload.name.strip():
        update["name"] = payload.name.strip()
    if payload.password:
        update["password"] = pwd_context.hash(payload.password)
    if not update:
        raise HTTPException(status_code=400, detail="No se enviaron datos para actualizar.")

    db_user = await users.find_one({"email": current_user["email"]})
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    await users.update_one({"email": current_user["email"]}, {"$set": update})
    updated_user = await users.find_one({"email": current_user["email"]})
    return {"success": True, "user": public_user(updated_user)}
