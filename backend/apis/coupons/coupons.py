from datetime import datetime, timezone
from typing import Literal

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from config.roles import ROLE_LEVELS
from utils.web3mongo import coupons
from utils.auth.session import require_role_level

router = APIRouter(prefix="/api", tags=["coupons"])


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def normalize_code(code: str) -> str:
    return code.strip().upper()


def serialize_coupon(coupon: dict) -> dict:
    coupon = dict(coupon)
    coupon["_id"] = str(coupon["_id"])
    return coupon


def parse_object_id(coupon_id: str) -> ObjectId:
    try:
        return ObjectId(coupon_id)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=404, detail="Cupón no encontrado")


def compute_discount(coupon: dict, subtotal: float) -> float:
    if coupon["type"] == "percentage":
        return round(subtotal * coupon["value"] / 100, 2)
    return round(min(coupon["value"], subtotal), 2)


def validate_coupon_value(coupon_type: str, value: float) -> None:
    if coupon_type == "percentage" and not (0 < value <= 100):
        raise HTTPException(status_code=400, detail="El porcentaje debe estar entre 1 y 100.")
    if coupon_type == "fixed" and value <= 0:
        raise HTTPException(status_code=400, detail="El monto del descuento debe ser mayor a cero.")


class CouponPayload(BaseModel):
    code: str
    type: Literal["percentage", "fixed"]
    value: float
    active: bool = True


class CouponUpdatePayload(BaseModel):
    type: Literal["percentage", "fixed"] | None = None
    value: float | None = None
    active: bool | None = None


class CouponValidatePayload(BaseModel):
    code: str
    subtotal: float


@router.post("/coupons/validate")
async def validate_coupon(payload: CouponValidatePayload):
    coupon = await coupons.find_one({"code": normalize_code(payload.code)})
    if not coupon or not coupon.get("active", True):
        raise HTTPException(status_code=404, detail="El cupón no es válido o ya no está disponible.")

    discount = compute_discount(coupon, payload.subtotal)
    total = max(round(payload.subtotal - discount, 2), 0)
    return {
        "success": True,
        "code": coupon["code"],
        "type": coupon["type"],
        "value": coupon["value"],
        "discount": discount,
        "total": total,
    }


@router.get("/coupons")
async def list_coupons(_user: dict = Depends(require_role_level(ROLE_LEVELS["admin"]))):
    cursor = coupons.find().sort("code", 1)
    result = [serialize_coupon(coupon) async for coupon in cursor]
    return {"success": True, "coupons": result}


@router.post("/coupons")
async def create_coupon(payload: CouponPayload, _user: dict = Depends(require_role_level(ROLE_LEVELS["admin"]))):
    validate_coupon_value(payload.type, payload.value)
    code = normalize_code(payload.code)

    existing = await coupons.find_one({"code": code})
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe un cupón con ese código.")

    coupon_doc = {
        "code": code,
        "type": payload.type,
        "value": payload.value,
        "active": payload.active,
        "date": utcnow(),
    }
    result = await coupons.insert_one(coupon_doc)
    coupon_doc["_id"] = result.inserted_id
    return {"success": True, "coupon": serialize_coupon(coupon_doc)}


@router.put("/coupons/{coupon_id}")
async def update_coupon(
    coupon_id: str,
    payload: CouponUpdatePayload,
    _user: dict = Depends(require_role_level(ROLE_LEVELS["admin"])),
):
    oid = parse_object_id(coupon_id)
    coupon = await coupons.find_one({"_id": oid})
    if not coupon:
        raise HTTPException(status_code=404, detail="Cupón no encontrado")

    update: dict = {}
    if payload.type is not None:
        update["type"] = payload.type
    if payload.value is not None:
        update["value"] = payload.value
    if payload.active is not None:
        update["active"] = payload.active

    if not update:
        raise HTTPException(status_code=400, detail="No hay cambios para aplicar.")

    validate_coupon_value(update.get("type", coupon["type"]), update.get("value", coupon["value"]))

    await coupons.update_one({"_id": oid}, {"$set": update})
    coupon.update(update)
    return {"success": True, "coupon": serialize_coupon(coupon)}


@router.delete("/coupons/{coupon_id}")
async def delete_coupon(coupon_id: str, _user: dict = Depends(require_role_level(ROLE_LEVELS["admin"]))):
    oid = parse_object_id(coupon_id)
    result = await coupons.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cupón no encontrado")
    return {"success": True}
