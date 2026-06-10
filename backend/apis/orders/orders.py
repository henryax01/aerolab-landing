import os
from datetime import datetime, timezone

import stripe
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, EmailStr

from config.roles import ROLE_LEVELS
from utils.web3mongo import orders, notifications, coupons
from utils.auth.session import verify_session, require_role_level
from apis.coupons.coupons import normalize_code, compute_discount
from utils.email import (
    send_email,
    order_created_html,
    payment_confirmed_html,
    order_status_update_html,
)

router = APIRouter(prefix="/api", tags=["orders"])

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_dummy")

VALID_STATUSES = ["pending", "confirmed", "shipped", "delivered"]
MAX_PAGE_SIZE = 100


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


class OrderPayload(BaseModel):
    name: str
    email: EmailStr
    product: str
    quantity: int
    address: str
    notes: str | None = None
    price: float | None = None
    couponCode: str | None = None


class PaymentIntentPayload(BaseModel):
    orderId: str
    amount: float


class ConfirmPaymentPayload(BaseModel):
    orderId: str
    paymentIntentId: str


class OrderStatusPayload(BaseModel):
    status: str
    trackingNumber: str | None = None


def serialize_order(order: dict) -> dict:
    order = dict(order)
    order["_id"] = str(order["_id"])
    return order


def parse_object_id(order_id: str) -> ObjectId:
    try:
        return ObjectId(order_id)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=404, detail="Pedido no encontrado")


@router.post("/order")
async def create_order(payload: OrderPayload):
    subtotal = payload.price or 0
    discount = 0.0
    coupon_code = None

    if payload.couponCode:
        code = normalize_code(payload.couponCode)
        coupon = await coupons.find_one({"code": code})
        if not coupon or not coupon.get("active", True):
            raise HTTPException(status_code=400, detail="El cupón no es válido o ya no está disponible.")
        discount = compute_discount(coupon, subtotal)
        coupon_code = coupon["code"]

    final_price = max(round(subtotal - discount, 2), 0)

    order_doc = {
        "name": payload.name.strip(),
        "email": payload.email.lower().strip(),
        "product": payload.product.strip(),
        "quantity": payload.quantity,
        "address": payload.address.strip(),
        "notes": payload.notes.strip() if payload.notes else "",
        "subtotal": subtotal,
        "discount": discount,
        "couponCode": coupon_code,
        "price": final_price,
        "status": "pending",
        "paymentStatus": "unpaid",
        "date": utcnow(),
    }
    result = await orders.insert_one(order_doc)
    order_id = str(result.inserted_id)

    await send_email(
        order_doc["email"],
        "Pedido confirmado - Pendiente de pago",
        order_created_html(order_id, order_doc["name"], order_doc["product"], order_doc["quantity"], order_doc["price"], order_doc["address"]),
    )

    return {"success": True, "orderId": order_id, "message": "Pedido creado. Procede con el pago."}


@router.get("/orders")
async def list_orders(
    user: dict = Depends(verify_session),
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=MAX_PAGE_SIZE),
    status: str | None = Query(None),
    q: str | None = Query(None),
):
    is_admin = user["role_level"] >= ROLE_LEVELS["admin"]
    query: dict = {} if is_admin else {"email": user["email"]}

    if status:
        if status not in VALID_STATUSES:
            raise HTTPException(status_code=400, detail="Estado inválido")
        query["status"] = status

    if q and is_admin:
        pattern = {"$regex": q.strip(), "$options": "i"}
        query["$or"] = [{"name": pattern}, {"email": pattern}, {"product": pattern}]

    total = await orders.count_documents(query)
    skip = (page - 1) * pageSize
    cursor = orders.find(query).sort("date", -1).skip(skip).limit(pageSize)
    result = [serialize_order(order) async for order in cursor]

    return {
        "success": True,
        "orders": result,
        "page": page,
        "pageSize": pageSize,
        "total": total,
        "totalPages": (total + pageSize - 1) // pageSize if total else 0,
    }


@router.put("/orders/{order_id}")
async def update_order(order_id: str, payload: OrderStatusPayload, _user: dict = Depends(require_role_level(ROLE_LEVELS["admin"]))):
    if payload.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail="Estado inválido")

    oid = parse_object_id(order_id)
    order = await orders.find_one({"_id": oid})
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    update = {"status": payload.status}
    if payload.trackingNumber:
        update["trackingNumber"] = payload.trackingNumber

    await orders.update_one({"_id": oid}, {"$set": update})
    order.update(update)

    await notifications.insert_one({
        "email": order["email"],
        "type": "order_status",
        "orderId": order_id,
        "product": order["product"],
        "status": payload.status,
        "read": False,
        "date": utcnow(),
    })

    html = order_status_update_html(order_id, order["name"], order["product"], payload.status, payload.trackingNumber)
    if html:
        await send_email(order["email"], f"Pedido actualizado: {payload.status.upper()}", html)

    return {"success": True, "order": serialize_order(order)}


@router.get("/stripe-public-key")
async def stripe_public_key():
    return {"publicKey": os.getenv("STRIPE_PUBLIC_KEY", "pk_test_dummy")}


@router.post("/create-payment-intent")
async def create_payment_intent(payload: PaymentIntentPayload):
    oid = parse_object_id(payload.orderId)
    order = await orders.find_one({"_id": oid})
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    payment_intent = stripe.PaymentIntent.create(
        amount=round(payload.amount * 100),
        currency="usd",
        metadata={"orderId": payload.orderId},
    )

    await orders.update_one({"_id": oid}, {"$set": {"stripePaymentIntentId": payment_intent.id}})

    return {
        "success": True,
        "clientSecret": payment_intent.client_secret,
        "paymentIntentId": payment_intent.id,
    }


@router.post("/confirm-payment")
async def confirm_payment(payload: ConfirmPaymentPayload):
    payment_intent = stripe.PaymentIntent.retrieve(payload.paymentIntentId)
    if payment_intent.status != "succeeded":
        raise HTTPException(status_code=400, detail="El pago no fue completado")

    oid = parse_object_id(payload.orderId)
    order = await orders.find_one({"_id": oid})
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    update = {"paymentStatus": "paid", "status": "confirmed"}
    await orders.update_one({"_id": oid}, {"$set": update})
    order.update(update)

    await send_email(
        order["email"],
        "Pago confirmado - Pedido confirmado",
        payment_confirmed_html(payload.orderId, order["name"], order["price"]),
    )

    return {"success": True, "order": serialize_order(order)}
