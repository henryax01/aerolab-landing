import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '../../i18n.js';
import NotificationBell from './NotificationBell.jsx';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../utils/notificationsData.jsx';

vi.mock('../../utils/notificationsData.jsx', () => ({
  getNotifications: vi.fn(),
  markNotificationRead: vi.fn(),
  markAllNotificationsRead: vi.fn(),
}));

const SAMPLE = [
  { _id: '1', product: 'Desarrollo web', status: 'shipped', read: false },
  { _id: '2', product: 'Consultoría', status: 'delivered', read: true },
];

function LocationDisplay() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

function renderWithRouter(token = 'token-123') {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <NotificationBell token={token} />
      <LocationDisplay />
    </MemoryRouter>,
  );
}

describe('NotificationBell', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('es');
  });

  beforeEach(() => {
    vi.clearAllMocks();
    getNotifications.mockResolvedValue({ notifications: SAMPLE, unread: 1 });
    markNotificationRead.mockResolvedValue({ success: true });
    markAllNotificationsRead.mockResolvedValue({ success: true });
  });

  it('no renderiza nada sin sesión activa', () => {
    const { container } = renderWithRouter(null);

    expect(container.querySelector('button')).not.toBeInTheDocument();
  });

  it('muestra el contador de no leídas y abre el panel con los mensajes', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    const toggle = await screen.findByRole('button', { name: /1 sin leer/i });
    await user.click(toggle);

    expect(await screen.findByText(/Tu pedido de Desarrollo web ahora está Enviado/i)).toBeInTheDocument();
  });

  it('marca como leída y navega a la cuenta al seleccionar una notificación', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    const toggle = await screen.findByRole('button', { name: /1 sin leer/i });
    await user.click(toggle);

    const item = await screen.findByText(/Tu pedido de Desarrollo web ahora está Enviado/i);
    await user.click(item);

    expect(markNotificationRead).toHaveBeenCalledWith({ id: '1', token: 'token-123' });
    expect(screen.getByTestId('location').textContent).toBe('/account');
  });

  it('marca todo como leído al usar el botón correspondiente', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    const toggle = await screen.findByRole('button', { name: /1 sin leer/i });
    await user.click(toggle);

    await user.click(await screen.findByRole('button', { name: 'Marcar todo como leído' }));

    expect(markAllNotificationsRead).toHaveBeenCalledWith({ token: 'token-123' });
  });
});
