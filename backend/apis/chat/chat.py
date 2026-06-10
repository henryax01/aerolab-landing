import os
from typing import Literal

import anthropic
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["chat"])

SYSTEM_PROMPT = """Eres un asistente virtual amable y profesional de Aerolab, una agencia digital.
La agencia ofrece cuatro servicios principales:
- Desarrollo web (sitios modernos, aplicaciones web, e-commerce)
- Diseño gráfico (identidad visual, branding, UI/UX)
- Marketing digital (SEO, redes sociales, campañas publicitarias)
- Consultoría (estrategia digital, auditorías, planes de crecimiento)

Tu rol es ayudar a los visitantes a entender los servicios, responder sus preguntas, guiarlos hacia la página de pedidos (/order) o contacto (/contact) cuando sea apropiado, y crear una experiencia amigable y profesional.

Responde siempre en el mismo idioma que el usuario. Sé conciso (máximo 3 párrafos por respuesta). No inventes precios específicos si no los conoces — invita al usuario a ver la sección de servicios o a contactarnos para una cotización personalizada."""


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatPayload(BaseModel):
    messages: list[ChatMessage]


@router.post("/chat")
async def chat(payload: ChatPayload):
    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    if not api_key or api_key == "tu_api_key_aqui":
        raise HTTPException(status_code=503, detail="Chatbot no configurado. Agrega ANTHROPIC_API_KEY al .env.")

    if not payload.messages:
        raise HTTPException(status_code=422, detail="Se requiere al menos un mensaje.")

    client = anthropic.Anthropic(api_key=api_key)

    messages = [{"role": m.role, "content": m.content} for m in payload.messages]

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=512,
        system=SYSTEM_PROMPT,
        messages=messages,
    )

    reply = response.content[0].text
    return {"reply": reply}
