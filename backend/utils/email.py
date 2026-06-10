import os

import aiosmtplib
from email.message import EmailMessage

EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USER = os.getenv("EMAIL_USER", "test@example.com")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "password")
EMAIL_FROM = os.getenv("EMAIL_FROM", EMAIL_USER)


async def send_email(to: str, subject: str, html: str) -> None:
    message = EmailMessage()
    message["From"] = EMAIL_FROM
    message["To"] = to
    message["Subject"] = subject
    message.set_content("Este correo requiere un cliente compatible con HTML.")
    message.add_alternative(html, subtype="html")

    try:
        await aiosmtplib.send(
            message,
            hostname=EMAIL_HOST,
            port=EMAIL_PORT,
            username=EMAIL_USER,
            password=EMAIL_PASSWORD,
            start_tls=True,
        )
        print(f"[email] enviado a {to}")
    except Exception as err:
        print(f"[email] error enviando a {to}: {err}")


def welcome_email_html(name: str, email: str, verify_link: str) -> str:
    return f"""
      <h2>¡Bienvenido {name}!</h2>
      <p>Tu cuenta ha sido creada exitosamente.</p>
      <p>Email: {email}</p>
      <p>Confirma tu correo electrónico haciendo clic en el siguiente enlace:</p>
      <p><a href="{verify_link}">{verify_link}</a></p>
      <p>Ahora puedes hacer pedidos y acceder a tu panel de control.</p>
    """


def verification_email_html(name: str, verify_link: str) -> str:
    return f"""
      <h2>Confirma tu correo, {name}</h2>
      <p>Haz clic en el siguiente enlace para verificar tu dirección de correo:</p>
      <p><a href="{verify_link}">{verify_link}</a></p>
      <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
    """


def password_reset_email_html(name: str, reset_link: str) -> str:
    return f"""
      <h2>Restablece tu contraseña</h2>
      <p>Hola {name},</p>
      <p>Recibimos una solicitud para restablecer tu contraseña. Este enlace es válido por una hora:</p>
      <p><a href="{reset_link}">{reset_link}</a></p>
      <p>Si no solicitaste esto, puedes ignorar este mensaje.</p>
    """


def contact_confirmation_html(name: str, message: str) -> str:
    return f"""
      <h2>Recibimos tu mensaje</h2>
      <p>Hola {name},</p>
      <p>Gracias por contactarnos. Nos pondremos en contacto pronto.</p>
      <p><strong>Tu mensaje:</strong> {message}</p>
    """


def contact_admin_notification_html(name: str, email: str, message: str) -> str:
    return f"""
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>De:</strong> {name} ({email})</p>
      <p><strong>Mensaje:</strong> {message}</p>
    """


def order_created_html(order_id: str, name: str, product: str, quantity: int, price: float, address: str) -> str:
    return f"""
      <h2>Pedido recibido - #{order_id}</h2>
      <p>Hola {name},</p>
      <p>Tu pedido ha sido registrado. Por favor completa el pago para confirmar.</p>
      <p><strong>Producto:</strong> {product}</p>
      <p><strong>Cantidad:</strong> {quantity}</p>
      <p><strong>Precio total:</strong> ${price}</p>
      <p><strong>Dirección:</strong> {address}</p>
      <p>El estado de tu pedido será actualizado próximamente.</p>
    """


def payment_confirmed_html(order_id: str, name: str, price: float) -> str:
    return f"""
      <h2>¡Pago confirmado!</h2>
      <p>Hola {name},</p>
      <p>Tu pago de ${price} ha sido procesado exitosamente.</p>
      <p><strong>ID de Pedido:</strong> {order_id}</p>
      <p><strong>Estado:</strong> Confirmado</p>
      <p>Tu pedido será preparado y enviado pronto.</p>
    """


STATUS_MESSAGES = {
    "confirmed": "Tu pedido ha sido confirmado y está siendo preparado.",
    "shipped": "Tu pedido ha sido enviado. Número de seguimiento: {tracking}",
    "delivered": "Tu pedido ha sido entregado. ¡Gracias por tu compra!",
}


def order_status_update_html(order_id: str, name: str, product: str, status: str, tracking_number: str | None) -> str | None:
    template = STATUS_MESSAGES.get(status)
    if not template:
        return None

    status_text = template.format(tracking=tracking_number or "Por definir")
    return f"""
        <h2>Actualización de tu pedido #{order_id}</h2>
        <p>Hola {name},</p>
        <p>{status_text}</p>
        <p><strong>Producto:</strong> {product}</p>
        <p><strong>Nuevo estado:</strong> {status.upper()}</p>
      """
