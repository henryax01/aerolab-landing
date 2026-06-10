import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '../../../i18n.js';
import TwoFactorVerify from './TwoFactorVerify.jsx';

describe('TwoFactorVerify', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('es');
  });

  let onSubmit;
  let onCancel;

  beforeEach(() => {
    onSubmit = vi.fn().mockResolvedValue({});
    onCancel = vi.fn();
  });

  it('envía el código ingresado', async () => {
    const user = userEvent.setup();
    render(<TwoFactorVerify onSubmit={onSubmit} onCancel={onCancel} loading={false} error={null} />);

    await user.type(screen.getByLabelText('Código de verificación'), '123456');
    await user.click(screen.getByRole('button', { name: 'Verificar' }));

    expect(onSubmit).toHaveBeenCalledWith('123456');
  });

  it('permite cancelar y volver a iniciar sesión', async () => {
    const user = userEvent.setup();
    render(<TwoFactorVerify onSubmit={onSubmit} onCancel={onCancel} loading={false} error={null} />);

    await user.click(screen.getByRole('button', { name: 'Volver a iniciar sesión' }));

    expect(onCancel).toHaveBeenCalled();
  });

  it('muestra el mensaje de error', () => {
    render(<TwoFactorVerify onSubmit={onSubmit} onCancel={onCancel} loading={false} error="Código inválido." />);

    expect(screen.getByText('Código inválido.')).toBeInTheDocument();
  });
});
