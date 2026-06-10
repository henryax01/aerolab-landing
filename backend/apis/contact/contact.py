import os

from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

from utils.web3mongo import messages
from utils.email import send_email, contact_confirmation_html, contact_admin_notification_html

router = APIRouter(prefix="/api", tags=["contact"])


class ContactPayload(BaseModel):
    name: str
    email: EmailStr
    message: str


@router.post("/contact")
async def contact(payload: ContactPayload):
    name = payload.name.strip()
    email = payload.email.lower().strip()
    message = payload.message.strip()

    await messages.insert_one({"name": name, "email": email, "message": message})

    await send_email(email, "Confirmación de contacto", contact_confirmation_html(name, message))

    admin_to = os.getenv("EMAIL_FROM") or os.getenv("EMAIL_USER")
    await send_email(admin_to, "Nuevo mensaje de contacto", contact_admin_notification_html(name, email, message))

    return {"success": True, "message": "Tu mensaje fue recibido."}
