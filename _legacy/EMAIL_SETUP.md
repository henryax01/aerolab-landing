# 📧 Guía: Notificaciones por Email con Nodemailer

## ¿Qué es Nodemailer?
Nodemailer es una librería que permite enviar emails desde Node.js. Soporta Gmail, Outlook, SendGrid, etc.

## 🚀 Opción 1: Usar Gmail (RECOMENDADO - Gratis)

### Paso 1: Activar autenticación de 2 factores en Gmail

1. **Ir a**: https://myaccount.google.com/security
2. **Click en "2-Step Verification"**
3. **Seguir** los pasos para activarlo
4. **Volver** a seguridad después de completar

### Paso 2: Generar "App Password"

1. **Ir a**: https://myaccount.google.com/apppasswords
2. **Si no aparece** "App passwords", vuelve a activar 2FA
3. **Seleccionar**:
   - App: Mail
   - Device: Windows Computer (o lo que uses)
4. **Click "Generate"**
5. **Copiar** la contraseña de 16 caracteres (SIN espacios)

### Paso 3: Configurar .env

Edita tu archivo `.env`:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop   (SIN ESPACIOS: abcdefghijklmnop)
EMAIL_FROM=tu_email@gmail.com
```

### Paso 4: Probar que funciona

Iniciar servidor:
```bash
npm start
```

Deberías ver:
```
📧 Email: Configurado
```

Al crear un pedido o registrarse, te llegará un email automático.

---

## 🚀 Opción 2: Usar SendGrid (Mejor para producción)

### Paso 1: Crear cuenta

1. **Ir a**: https://sendgrid.com
2. **Click "Sign Up"**
3. **Crear cuenta** (gratis hasta 100 emails/día)
4. **Verificar** email

### Paso 2: Obtener API Key

1. **Dashboard** → Settings → API Keys
2. **Click "Create API Key"**
3. **Copiar** la clave

### Paso 3: Configurar en .env

```
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.tu_api_key_aqui
EMAIL_FROM=tu_email@tudominio.com
```

---

## 🚀 Opción 3: Usar otro servicio (Outlook, Yahoo, etc.)

Puedes usar cualquier servicio SMTP:

```
EMAIL_HOST=smtp.office365.com           # Outlook
EMAIL_HOST=smtp.mail.yahoo.com          # Yahoo
EMAIL_HOST=smtp.zoho.com                # Zoho
```

Requiere tu email y contraseña de la cuenta.

---

## 📧 Emails automáticos que se envían:

### 1. **Bienvenida** (Al registrarse)
```
To: usuario@email.com
Subject: ¡Bienvenido a nuestra plataforma!
Body: Confirmación de registro exitoso
```

### 2. **Contacto** (Al enviar mensaje)
```
To: usuario@email.com + admin
Subject: Confirmación de contacto
Body: Tu mensaje fue recibido
```

### 3. **Pedido** (Al crear orden)
```
To: cliente@email.com
Subject: Pedido confirmado - Pendiente de pago
Body: Detalles del pedido + monto
```

### 4. **Pago confirmado** (Tras procesar pago)
```
To: cliente@email.com
Subject: Pago confirmado - Pedido confirmado
Body: Gracias, tu pedido está confirmado
```

### 5. **Actualización de estado** (Admin actualiza)
```
To: cliente@email.com
Subject: Pedido actualizado: CONFIRMED/SHIPPED/DELIVERED
Body: Estado actual + tracking number
```

---

## 🔒 Seguridad

⚠️ **IMPORTANTE**:
- Nunca compartir `EMAIL_PASSWORD` en Git
- Usar `.gitignore` para `.env`
- En producción, usar variables de entorno del servidor

---

## 🐛 Troubleshooting

**"Error: Invalid login credentials"**
→ Verifica usuario y contraseña en `.env`

**"SMTP connection timeout"**
→ Revisa que EMAIL_HOST y EMAIL_PORT sean correctos

**"Email no llega"**
→ Revisa spam/basura en Gmail

**"Less secure app access denied"**
→ Si usas Gmail, debes generar "App Password" (no usar contraseña normal)

---

## ✅ Verificar que funciona

```bash
npm start
```

1. **Registra** un usuario con tu email
2. **Revisa** tu bandeja de entrada (incluir spam)
3. **Deberías recibir** email de bienvenida

¡Si llegas aquí, todo está configurado! 🎉
