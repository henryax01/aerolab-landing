import math

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr

from utils.auth.session import create_access_token, verify_session
from utils.web3mongo import users

router = APIRouter(prefix="/api", tags=["face"])

FACE_MATCH_THRESHOLD = 0.55


def euclidean_distance(d1: list[float], d2: list[float]) -> float:
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(d1, d2)))


class FaceDescriptorPayload(BaseModel):
    descriptor: list[float]


class FaceLoginPayload(BaseModel):
    email: EmailStr
    descriptor: list[float]


@router.put("/users/me/face-descriptor")
async def save_face_descriptor(
    payload: FaceDescriptorPayload,
    session: dict = Depends(verify_session),
):
    if len(payload.descriptor) != 128:
        raise HTTPException(status_code=422, detail="El descriptor debe tener 128 valores.")

    await users.update_one(
        {"email": session["email"]},
        {"$set": {"faceDescriptor": payload.descriptor}},
    )
    return {"success": True, "message": "Rostro registrado correctamente."}


@router.delete("/users/me/face-descriptor")
async def remove_face_descriptor(session: dict = Depends(verify_session)):
    await users.update_one(
        {"email": session["email"]},
        {"$unset": {"faceDescriptor": ""}},
    )
    return {"success": True, "message": "Rostro eliminado."}


@router.get("/users/me/face-enrolled")
async def face_enrolled(session: dict = Depends(verify_session)):
    user = await users.find_one({"email": session["email"]}, {"faceDescriptor": 1})
    return {"enrolled": bool(user and user.get("faceDescriptor"))}


@router.post("/auth/face-login")
async def face_login(payload: FaceLoginPayload):
    if len(payload.descriptor) != 128:
        raise HTTPException(status_code=422, detail="Descriptor inválido.")

    user = await users.find_one({"email": payload.email.lower()})
    if not user:
        raise HTTPException(status_code=401, detail="No se encontró el usuario.")

    stored = user.get("faceDescriptor")
    if not stored:
        raise HTTPException(status_code=404, detail="Este usuario no tiene rostro registrado.")

    distance = euclidean_distance(payload.descriptor, stored)
    if distance > FACE_MATCH_THRESHOLD:
        raise HTTPException(status_code=401, detail="Rostro no reconocido. Inténtalo de nuevo.")

    token = create_access_token(user)
    return {
        "success": True,
        "token": token,
        "user": {"name": user["name"], "email": user["email"], "role": user["role"]},
    }
