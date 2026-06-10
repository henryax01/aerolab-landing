from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query

from utils.web3mongo import notifications
from utils.auth.session import verify_session

router = APIRouter(prefix="/api", tags=["notifications"])

MAX_PAGE_SIZE = 50


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def serialize_notification(notification: dict) -> dict:
    notification = dict(notification)
    notification["_id"] = str(notification["_id"])
    return notification


def parse_object_id(notification_id: str) -> ObjectId:
    try:
        return ObjectId(notification_id)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=404, detail="Notificación no encontrada")


@router.get("/notifications")
async def list_notifications(
    user: dict = Depends(verify_session),
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=MAX_PAGE_SIZE),
):
    query = {"email": user["email"]}
    total = await notifications.count_documents(query)
    unread = await notifications.count_documents({**query, "read": False})
    skip = (page - 1) * pageSize
    cursor = notifications.find(query).sort("date", -1).skip(skip).limit(pageSize)
    result = [serialize_notification(item) async for item in cursor]

    return {
        "success": True,
        "notifications": result,
        "page": page,
        "pageSize": pageSize,
        "total": total,
        "totalPages": (total + pageSize - 1) // pageSize if total else 0,
        "unread": unread,
    }


@router.put("/notifications/read-all")
async def mark_all_notifications_read(user: dict = Depends(verify_session)):
    await notifications.update_many({"email": user["email"], "read": False}, {"$set": {"read": True}})
    return {"success": True}


@router.put("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, user: dict = Depends(verify_session)):
    oid = parse_object_id(notification_id)
    notification = await notifications.find_one({"_id": oid, "email": user["email"]})
    if not notification:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")

    await notifications.update_one({"_id": oid}, {"$set": {"read": True}})
    notification["read"] = True
    return {"success": True, "notification": serialize_notification(notification)}
