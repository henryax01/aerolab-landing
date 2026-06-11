# Proyecto: Landing Progresiva

Plataforma completa para negocio digital, construida con **FastAPI (Python) + React (Vite + TailwindCSS) + MongoDB**, siguiendo la arquitectura de 4 capas **Page → Hook → Util → Backend** (auto-discovery de routers/páginas, `pageMetadata`, i18n es/en, tema dual claro/oscuro y autenticación JWT con roles numéricos).

## 🏗️ Estructura

```
├── backend/                  # FastAPI + Motor (MongoDB async)
│   ├── main.py               # App + auto-discovery de routers + seed admin
│   ├── requirements.txt
│   ├── .env                  # Configuración (Mongo, JWT, Stripe, Email)
│   ├── apis/                 # Routers: auth, orders, contact, coupons, notifications
│   ├── utils/                # Conexión Mongo, sesión JWT, envío de emails, TOTP/2FA
│   └── config/roles.py       # Niveles de rol numéricos (admin=6, customer=1)
│
├── frontend/                 # React + Vite + TailwindCSS v4
│   └── src/
│       ├── pages/            # Home, About, Portfolio, Order, Contact, Account
│       ├── hooks/            # useAuth, useOrders, useContact, useTheme, useNotifications,
│       │                     # useGlobalSearch, useCoupon(s), useAccountRecovery
│       ├── utils/            # api.jsx + *Data.jsx (capa de transporte HTTP)
│       ├── locales/{es,en}/  # Traducciones por página (i18next)
│       └── components/common # Header, Footer, ThemeToggle, LangSwitcher
│
├── _legacy/                  # Stack anterior (Express + HTML vanilla), archivado
└── cursos-vanellix.md        # Documento de referencia de la arquitectura
```

## 🐳 Inicio rápido con Docker (recomendado)

Requiere [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y abierto.

```bash
docker compose up -d --build
```

Esto levanta 3 contenedores:
- **mongo** — base de datos MongoDB en `localhost:27017`
- **backend** — API FastAPI en `http://localhost:8000` (con auto-reload)
- **frontend** — React/Vite en `http://localhost:5173` (con hot-reload)

Comandos útiles:
```bash
docker compose logs -f          # ver logs de todos los servicios
docker compose logs -f backend  # ver logs solo del backend
docker compose down             # detener y eliminar los contenedores
docker compose down -v          # además borra los datos de MongoDB
```

Los cambios que hagas en `backend/` y `frontend/` se reflejan automáticamente (volúmenes montados + reload).

## 🚀 Inicio rápido (sin Docker)

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Requiere MongoDB corriendo en `mongodb://localhost:27017/landing-project` (ver `backend/.env`).

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Abre `http://localhost:5173` — el proxy de Vite reenvía `/api` a `http://127.0.0.1:8000`.

## 🔐 Credenciales por defecto

- **Email**: `admin@aerolab.com`
- **Contraseña**: `admin123`

(Se siembra automáticamente al iniciar el backend si no existe.)

## 📊 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/register` | Crear nueva cuenta (JWT + email de bienvenida) |
| POST | `/api/login` | Iniciar sesión (devuelve JWT, o un reto de 2FA si está activado) |
| POST | `/api/login/2fa` | Verificar el código de 2FA y completar el inicio de sesión |
| POST | `/api/2fa/setup` | Generar secreto TOTP + código QR para activar 2FA |
| POST | `/api/2fa/enable` | Confirmar el código y activar 2FA (entrega códigos de respaldo) |
| POST | `/api/2fa/disable` | Desactivar 2FA con un código TOTP o de respaldo |
| POST | `/api/verify-email` | Verificar la dirección de correo del usuario |
| POST | `/api/resend-verification` | Reenviar el correo de verificación |
| POST | `/api/forgot-password` | Solicitar enlace de restablecimiento de contraseña |
| POST | `/api/reset-password` | Restablecer la contraseña con el token recibido |
| POST | `/api/contact` | Enviar mensaje de contacto |
| POST | `/api/order` | Crear nuevo pedido (admite código de cupón opcional) |
| GET | `/api/orders` | Listar pedidos (propios, o todos si es admin) |
| PUT | `/api/orders/{id}` | Actualizar estado de un pedido (solo admin) |
| GET | `/api/stripe-public-key` | Clave pública de Stripe para el frontend |
| POST | `/api/create-payment-intent` | Crear intención de pago (Stripe) |
| POST | `/api/confirm-payment` | Confirmar pago y marcar pedido como pagado |
| POST | `/api/coupons/validate` | Validar un código de cupón y calcular el descuento |
| GET/POST | `/api/coupons` | Listar / crear cupones de descuento (solo admin) |
| PUT/DELETE | `/api/coupons/{id}` | Actualizar / eliminar un cupón (solo admin) |
| GET | `/api/notifications` | Listar notificaciones del usuario (paginado) |
| PUT | `/api/notifications/{id}/read` | Marcar una notificación como leída |
| PUT | `/api/notifications/read-all` | Marcar todas las notificaciones como leídas |
| GET | `/api/health` | Verificar servidor activo |

## 💾 Base de datos MongoDB

**Colecciones:**
- `users` — Cuentas de usuario (admin + clientes), contraseñas con bcrypt, secretos TOTP y códigos de respaldo para 2FA
- `orders` — Pedidos realizados, con estado, seguimiento, descuentos aplicados y código de cupón
- `messages` — Mensajes de contacto
- `notifications` — Notificaciones de cambios de estado de pedidos
- `coupons` — Cupones de descuento (porcentaje o monto fijo)

## 🔧 Tecnologías

- **Frontend**: React, Vite, TailwindCSS v4 (tema dual claro/oscuro), react-router-dom, react-i18next, axios, Stripe Elements
- **Backend**: FastAPI, Motor (MongoDB async), Pydantic, python-jose (JWT), passlib/bcrypt, pyotp + qrcode (2FA), Stripe SDK, aiosmtplib
- **Autenticación**: JWT + `verify_session` + roles numéricos (`admin`=6, `customer`=1)
- **Base de datos**: MongoDB

## 📱 Características

✅ Autenticación JWT con roles numéricos
✅ Registro e inicio de sesión con email de bienvenida
✅ Verificación de correo y recuperación de contraseña
✅ Autenticación en dos pasos (2FA) con TOTP, código QR y códigos de respaldo de un solo uso
✅ Búsqueda global de páginas y servicios desde el encabezado
✅ Notificaciones de cambios de estado de pedidos, con contador de no leídas
✅ Formulario de contacto con notificación doble (cliente + admin)
✅ Sistema de pedidos con resumen, cupones de descuento y pago Stripe integrado
✅ Panel de administrador con gestión de estados de pedido y de cupones de descuento
✅ i18n completo (español / inglés)
✅ Tema dual claro/oscuro persistido
✅ Auto-discovery de páginas (`pageMetadata`) y de routers del backend
✅ Diseño responsive (mobile-first)

## 🎨 Páginas

1. **Home** (`/`) — Hero, características, proceso y CTA
2. **About** (`/about`) — Historia y valores
3. **Portfolio** (`/portfolio`) — Catálogo de servicios y precios
4. **Order** (`/order`) — Formulario de pedido + pago con Stripe
5. **Contact** (`/contact`) — Información de contacto y formulario
6. **Account** (`/account`) — Login / registro / mis pedidos / panel admin

## 📦 Stack anterior

El stack anterior (Express.js + HTML/JS vanilla) se conserva en `_legacy/` como referencia histórica. No forma parte del flujo activo del proyecto.
