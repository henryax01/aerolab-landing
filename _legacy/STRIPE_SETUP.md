# 💳 Guía: Integración de Pagos con Stripe

## ¿Qué es Stripe?
Stripe es la plataforma más fácil para procesar pagos con tarjetas de crédito. Totalmente segura y confiable.

## 🚀 Paso 1: Crear cuenta en Stripe

1. **Ir a**: https://dashboard.stripe.com/register
2. **Registrarse** con tu email
3. **Verificar** correo electrónico
4. **Completar** información de negocio (puedes usar datos de prueba)

## 🔑 Paso 2: Obtener tus claves

1. **Ir a Dashboard** → https://dashboard.stripe.com/apikeys
2. **Ver claves de prueba** (a la derecha, click en "Show test data key")
3. Copiar las dos claves:
   - `sk_test_...` (Secret Key - PRIVADA, no compartir)
   - `pk_test_...` (Publishable Key - pública)

## 📝 Paso 3: Configurar en .env

Edita tu archivo `.env`:

```
STRIPE_SECRET_KEY=sk_test_TU_CLAVE_AQUI
STRIPE_PUBLIC_KEY=pk_test_TU_CLAVE_AQUI
```

## 🧪 Paso 4: Probar Pagos

### Tarjetas de prueba que funcionan:
- **Éxito**: `4242 4242 4242 4242`
- **Declinada**: `4000 0000 0000 0002`
- **Expiración**: Cualquier fecha futura (ej: 12/25)
- **CVC**: Cualquier 3 dígitos (ej: 123)

## 💻 Paso 5: Usar en tu aplicación

El servidor ya tiene todo configurado:

```javascript
// Frontend crea un pedido
POST /api/order → { name, email, product, quantity, address, price }
// Respuesta: { orderId }

// Frontend crea Payment Intent
POST /api/create-payment-intent → { orderId, amount }
// Respuesta: { clientSecret, paymentIntentId }

// Frontend procesa pago con Stripe.js
// Cliente completa formulario de tarjeta

// Frontend confirma pago
POST /api/confirm-payment → { orderId, paymentIntentId }
// Respuesta: { order con status: 'confirmed', paymentStatus: 'paid' }
```

## 🔒 Seguridad

⚠️ **IMPORTANTE**:
- Nunca poner `STRIPE_SECRET_KEY` en el cliente (frontend)
- Solo el servidor debe tener acceso a la claveSecreta
- Los emails de confirmación se envían automáticamente

## 📊 Dashboard de Stripe

En https://dashboard.stripe.com puedes:
- Ver todos los pagos procesados
- Verificar detalles de transacciones
- Revisar logs de errores
- Gestionar reembolsos

## ❓ Problemas comunes

**"Error: Invalid API Key"**
→ Verifica que copiaste correctamente la clave en `.env`

**"Payment declined"**
→ En pruebas, usa solo las tarjetas de prueba listed arriba

**"CORS error"**
→ Asegúrate que el servidor está corriendo en http://localhost:8080

---

**Próximos pasos**: Una vez configurado Stripe, tu plataforma puede procesar pagos reales 💰
