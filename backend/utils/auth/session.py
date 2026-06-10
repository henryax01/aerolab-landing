import os
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from config.roles import get_role_level

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60 * 24
TWO_FA_CHALLENGE_EXPIRE_MINUTES = 5

bearer_scheme = HTTPBearer(auto_error=False)


def create_access_token(user: dict) -> str:
    payload = {
        "sub": user["email"],
        "name": user["name"],
        "role": user["role"],
        "exp": datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def verify_session(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No autenticado.")

    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido o expirado.")

    role = payload.get("role", "customer")
    return {
        "email": payload["sub"],
        "name": payload.get("name"),
        "role": role,
        "role_level": get_role_level(role),
    }


def create_2fa_challenge_token(email: str) -> str:
    payload = {
        "sub": email,
        "purpose": "2fa_challenge",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=TWO_FA_CHALLENGE_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_2fa_challenge_token(token: str) -> str:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="El código de verificación expiró. Inicia sesión de nuevo.")

    if payload.get("purpose") != "2fa_challenge":
        raise HTTPException(status_code=401, detail="Token de verificación inválido.")

    return payload["sub"]


def require_role_level(min_level: int):
    async def dependency(user: dict = Depends(verify_session)) -> dict:
        if user["role_level"] < min_level:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tienes permisos suficientes.")
        return user

    return dependency
