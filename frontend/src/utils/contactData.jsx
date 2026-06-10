import api from './api.jsx';

export async function sendContactMessage({ name, email, message }) {
  return api({ method: 'POST', endpoint: '/contact', data: { name, email, message } });
}
