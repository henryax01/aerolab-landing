// ===== MANEJO DE PAGOS CON STRIPE =====

let stripe;
let elements;
let cardElement;
let currentOrderId;

// Inicializar Stripe
async function initStripe() {
  const publicKey = await fetch('/api/stripe-public-key')
    .then(r => r.json())
    .then(d => d.publicKey)
    .catch(() => 'pk_test_dummy'); // Fallback si no hay clave

  stripe = Stripe(publicKey);
  elements = stripe.elements();
  cardElement = elements.create('card');
  cardElement.mount('#card-element');

  // Mostrar errores de tarjeta
  cardElement.addEventListener('change', (event) => {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });
}

// Mostrar forma de pago
function showPaymentForm(orderId, amount, productName) {
  currentOrderId = orderId;
  
  document.getElementById('orderFormSection').style.display = 'none';
  document.getElementById('paymentSection').style.display = 'block';
  document.getElementById('paymentProduct').textContent = productName;
  document.getElementById('paymentAmount').textContent = `$${amount}`;
  
  window.scrollTo(0, 0);
}

// Procesar pago
document.getElementById('paymentForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const payBtn = document.getElementById('payBtn');
  const paymentMsg = document.getElementById('paymentMessage');
  
  payBtn.disabled = true;
  payBtn.textContent = '⏳ Procesando...';
  paymentMsg.textContent = '';

  try {
    // 1. Crear Payment Intent en el servidor
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: currentOrderId,
        amount: parseFloat(document.getElementById('paymentAmount').textContent.replace('$', ''))
      })
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);

    const { clientSecret, paymentIntentId } = data;

    // 2. Confirmar pago con Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {}
      }
    });

    if (error) {
      paymentMsg.textContent = `❌ ${error.message}`;
      payBtn.disabled = false;
      payBtn.textContent = '💳 Procesar pago';
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      // 3. Confirmar en servidor
      const confirmResponse = await fetch('/api/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: currentOrderId,
          paymentIntentId: paymentIntentId
        })
      });

      const confirmData = await confirmResponse.json();
      if (!confirmData.success) throw new Error(confirmData.error);

      paymentMsg.innerHTML = `✅ ¡Pago confirmado! Tu pedido está procesándose. Te hemos enviado un correo de confirmación.`;
      paymentMsg.style.color = '#10b981';
      
      // Resetear después de 3 segundos
      setTimeout(() => {
        document.getElementById('paymentForm').reset();
        document.getElementById('orderForm').reset();
        resetOrderForm();
      }, 3000);
    }
  } catch (err) {
    paymentMsg.textContent = `❌ Error: ${err.message}`;
  } finally {
    payBtn.disabled = false;
    payBtn.textContent = '💳 Procesar pago';
  }
});

// Cancelar pago
document.getElementById('cancelPaymentBtn')?.addEventListener('click', () => {
  document.getElementById('paymentSection').style.display = 'none';
  document.getElementById('orderFormSection').style.display = 'block';
});

// Resetear formulario
function resetOrderForm() {
  document.getElementById('orderFormSection').style.display = 'block';
  document.getElementById('paymentSection').style.display = 'none';
}

// Inicializar cuando la página carga
if (document.getElementById('paymentForm')) {
  document.addEventListener('DOMContentLoaded', initStripe);
}
