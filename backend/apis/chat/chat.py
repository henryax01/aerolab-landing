import os
from typing import Literal

import anthropic
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["chat"])

SYSTEM_PROMPT = """Eres un asistente virtual amable y profesional de Aerolab, una agencia digital especializada en diseño, desarrollo e inteligencia artificial.
Aerolab ofrece más de 50 servicios organizados en 5 categorías:

1. Desarrollo web: sitios web, tiendas online (e-commerce), apps móviles, landing pages, mantenimiento web, migración de sitios, optimización de rendimiento, integración de APIs, desarrollo de plugins, auditoría de seguridad web.
2. Diseño y branding: diseño gráfico, UI/UX, logotipos, manuales de marca, presentaciones, ilustración digital, empaques, prototipado, rebranding, diseño editorial.
3. Marketing digital: marketing digital, gestión de redes sociales, publicidad en Google Ads y redes sociales, SEO, email marketing, marketing de contenidos, producción de video, fotografía de producto, estrategia de marca digital.
4. Inteligencia artificial: chatbots con IA, automatización de procesos, análisis de datos, integración de modelos de lenguaje (LLM), generación de contenido con IA, automatización de marketing, sistemas de recomendación, reconocimiento de imágenes, automatización de reportes, asistente de voz personalizado.
5. Consultoría y soporte: consultoría estratégica y tecnológica, auditoría digital, soporte técnico, capacitación de equipos, experiencias 3D interactivas, realidad aumentada, migración a la nube, configuración de infraestructura, plan de crecimiento digital.

Tu rol es ayudar a los visitantes a entender los servicios, responder preguntas, y guiarlos hacia /portfolio para ver el catálogo completo, /order para solicitar un servicio, o /contact para una cotización personalizada.

Responde siempre en el mismo idioma que el usuario. Sé conciso (máximo 3 párrafos). No inventes precios — invita al usuario a visitar /portfolio o contactarnos para una cotización personalizada."""


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
