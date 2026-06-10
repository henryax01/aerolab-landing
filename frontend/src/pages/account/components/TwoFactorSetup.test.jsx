import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '../../../i18n.js';
import TwoFactorSetup from './TwoFactorSetup.jsx';

const SETUP_RESULT = {
  secret: 'ABCDEFGH',
  otpauthUrl: 'otpauth://totp/Mi%20Empresa:cliente@example.com?secret=ABCDEFGH&issuer=Mi%20Empresa',
  qrCode: 'data:image/png;base64,abc123',
};

describe('TwoFactorSetup', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('es');
  });

  let onSetup;
  let onEnable;
  let onDisable;

  beforeEach(() => {
    onSetup = vi.fn().mockResolvedValue(SETUP_RESULT);
    onEnable = vi.fn().mockResolvedValue({ backupCodes: ['AAAA-1111', 'BBBB-2222'] });
    onDisable = vi.fn().mockResolvedValue({ success: true });
  });

  it('muestra el estado desactivado y permite iniciar la activación con QR', async () => {
    const user = userEvent.setup();
    render(<TwoFactorSetup enabled={false} onSetup={onSetup} onEnable={onEnable} onDisable={onDisable} />);

    expect(screen.getByText('Desactivada')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Activar verificación en dos pasos' }));

    expect(onSetup).toHaveBeenCalled();
    expect(await screen.findByAltText('Escanea el código QR')).toHaveAttribute('src', SETUP_RESULT.qrCode);
    expect(screen.getByText('ABCDEFGH')).toBeInTheDocument();
  });

  it('confirma el código y muestra los códigos de respaldo', async () => {
    const user = userEvent.setup();
    render(<TwoFactorSetup enabled={false} onSetup={onSetup} onEnable={onEnable} onDisable={onDisable} />);

    await user.click(screen.getByRole('button', { name: 'Activar verificación en dos pasos' }));
    await screen.findByAltText('Escanea el código QR');

    await user.type(screen.getByLabelText('Código de confirmación'), '654321');
    await user.click(screen.getByRole('button', { name: 'Confirmar y activar' }));

    expect(onEnable).toHaveBeenCalledWith('654321');
    expect(await screen.findByText('AAAA-1111')).toBeInTheDocument();
    expect(screen.getByText('BBBB-2222')).toBeInTheDocument();
  });

  it('muestra el estado activado y permite desactivar con un código', async () => {
    const user = userEvent.setup();
    render(<TwoFactorSetup enabled onSetup={onSetup} onEnable={onEnable} onDisable={onDisable} />);

    expect(screen.getByText('Activada')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Desactivar verificación en dos pasos' }));

    await user.type(screen.getByLabelText('Código de verificación'), '111222');
    await user.click(screen.getByRole('button', { name: 'Desactivar' }));

    expect(onDisable).toHaveBeenCalledWith('111222');
  });
});
