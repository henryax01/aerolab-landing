import api from './api.jsx';

export async function getNotifications({ token, page, pageSize }) {
  return api({ method: 'GET', endpoint: '/notifications', token, params: { page, pageSize } });
}

export async function markNotificationRead({ id, token }) {
  return api({ method: 'PUT', endpoint: `/notifications/${id}/read`, token });
}

export async function markAllNotificationsRead({ token }) {
  return api({ method: 'PUT', endpoint: '/notifications/read-all', token });
}
