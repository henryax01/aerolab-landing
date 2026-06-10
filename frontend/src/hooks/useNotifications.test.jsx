import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useNotifications from './useNotifications.jsx';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../utils/notificationsData.jsx';

vi.mock('../utils/notificationsData.jsx', () => ({
  getNotifications: vi.fn(),
  markNotificationRead: vi.fn(),
  markAllNotificationsRead: vi.fn(),
}));

const SAMPLE = [
  { _id: '1', product: 'Desarrollo web', status: 'shipped', read: false },
  { _id: '2', product: 'Consultoría', status: 'delivered', read: true },
];

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getNotifications.mockResolvedValue({ notifications: SAMPLE, unread: 1 });
    markNotificationRead.mockResolvedValue({ success: true });
    markAllNotificationsRead.mockResolvedValue({ success: true });
  });

  it('no carga nada sin token', () => {
    const { result } = renderHook(() => useNotifications(null));

    expect(getNotifications).not.toHaveBeenCalled();
    expect(result.current.notifications).toHaveLength(0);
    expect(result.current.unread).toBe(0);
  });

  it('carga notificaciones y el contador de no leídas con un token', async () => {
    const { result } = renderHook(() => useNotifications('token-123'));

    await waitFor(() => expect(result.current.notifications).toHaveLength(2));
    expect(result.current.unread).toBe(1);
    expect(getNotifications).toHaveBeenCalledWith({ token: 'token-123', page: 1, pageSize: 10 });
  });

  it('marca una notificación como leída de forma optimista', async () => {
    const { result } = renderHook(() => useNotifications('token-123'));
    await waitFor(() => expect(result.current.notifications).toHaveLength(2));

    await act(async () => {
      await result.current.markAsRead('1');
    });

    expect(markNotificationRead).toHaveBeenCalledWith({ id: '1', token: 'token-123' });
    expect(result.current.notifications.find((item) => item._id === '1').read).toBe(true);
    expect(result.current.unread).toBe(0);
  });

  it('marca todas las notificaciones como leídas', async () => {
    const { result } = renderHook(() => useNotifications('token-123'));
    await waitFor(() => expect(result.current.notifications).toHaveLength(2));

    await act(async () => {
      await result.current.markAllAsRead();
    });

    expect(markAllNotificationsRead).toHaveBeenCalledWith({ token: 'token-123' });
    expect(result.current.notifications.every((item) => item.read)).toBe(true);
    expect(result.current.unread).toBe(0);
  });
});
