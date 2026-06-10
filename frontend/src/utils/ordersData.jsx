import api from './api.jsx';

export async function createOrder(payload) {
  return api({ method: 'POST', endpoint: '/order', data: payload });
}

export async function getOrders({ token, page, pageSize, status, q }) {
  return api({
    method: 'GET',
    endpoint: '/orders',
    token,
    params: { page, pageSize, status: status || undefined, q: q || undefined },
  });
}

export async function updateOrderStatus({ orderId, status, trackingNumber, token }) {
  return api({
    method: 'PUT',
    endpoint: `/orders/${orderId}`,
    data: { status, trackingNumber },
    token,
  });
}

export async function getStripePublicKey() {
  return api({ method: 'GET', endpoint: '/stripe-public-key' });
}

export async function createPaymentIntent({ orderId, amount }) {
  return api({ method: 'POST', endpoint: '/create-payment-intent', data: { orderId, amount } });
}

export async function confirmPayment({ orderId, paymentIntentId }) {
  return api({ method: 'POST', endpoint: '/confirm-payment', data: { orderId, paymentIntentId } });
}
