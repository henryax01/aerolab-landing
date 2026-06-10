import api from './api.jsx';

export async function validateCoupon({ code, subtotal }) {
  return api({ method: 'POST', endpoint: '/coupons/validate', data: { code, subtotal } });
}

export async function getCoupons({ token }) {
  return api({ method: 'GET', endpoint: '/coupons', token });
}

export async function createCoupon({ token, code, type, value, active }) {
  return api({ method: 'POST', endpoint: '/coupons', data: { code, type, value, active }, token });
}

export async function updateCoupon({ token, id, ...changes }) {
  return api({ method: 'PUT', endpoint: `/coupons/${id}`, data: changes, token });
}

export async function deleteCoupon({ token, id }) {
  return api({ method: 'DELETE', endpoint: `/coupons/${id}`, token });
}
