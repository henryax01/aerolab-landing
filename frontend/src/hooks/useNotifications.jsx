import { useCallback, useEffect, useState } from 'react';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../utils/notificationsData.jsx';

const PAGE_SIZE = 10;
const POLL_INTERVAL_MS = 30000;

export default function useNotifications(token) {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!token) {
      setNotifications([]);
      setUnread(0);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getNotifications({ token, page: 1, pageSize: PAGE_SIZE });
      setNotifications(res.notifications || []);
      setUnread(res.unread || 0);
    } catch (err) {
      setError(err?.response?.data?.detail || 'No se pudieron cargar las notificaciones.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
    if (!token) return undefined;
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [token, load]);

  const markAsRead = useCallback(
    async (id) => {
      await markNotificationRead({ id, token });
      setNotifications((current) => current.map((item) => (item._id === id ? { ...item, read: true } : item)));
      setUnread((current) => Math.max(0, current - 1));
    },
    [token],
  );

  const markAllAsRead = useCallback(async () => {
    await markAllNotificationsRead({ token });
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    setUnread(0);
  }, [token]);

  return { notifications, unread, loading, error, reload: load, markAsRead, markAllAsRead };
}
