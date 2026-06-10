import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '../../../i18n.js';
import CouponManager from './CouponManager.jsx';
import useCoupons from '../../../hooks/useCoupons.jsx';

vi.mock('../../../hooks/useCoupons.jsx', () => ({
  default: vi.fn(),
}));

const SAMPLE = [
  { _id: '1', code: 'PROMO10', type: 'percentage', value: 10, active: true },
  { _id: '2', code: 'FIJO5', type: 'fixed', value: 5, active: false },
];

describe('CouponManager', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('es');
  });

  let loadCoupons;
  let addCoupon;
  let editCoupon;
  let removeCoupon;

  beforeEach(() => {
    loadCoupons = vi.fn();
    addCoupon = vi.fn().mockResolvedValue({ success: true });
    editCoupon = vi.fn().mockResolvedValue({ success: true });
    removeCoupon = vi.fn().mockResolvedValue({ success: true });
    useCoupons.mockReturnValue({
      coupons: SAMPLE,
      loading: false,
      error: null,
      loadCoupons,
      addCoupon,
      editCoupon,
      removeCoupon,
    });
  });

  it('carga los cupones al montar y muestra la lista', () => {
    render(<CouponManager token="token-123" />);

    expect(loadCoupons).toHaveBeenCalled();
    expect(screen.getByText('PROMO10')).toBeInTheDocument();
    expect(screen.getByText('FIJO5')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getAllByText('Activo').length).toBeGreaterThan(0);
    expect(screen.getByText('Inactivo')).toBeInTheDocument();
  });

  it('crea un cupón con los datos del formulario', async () => {
    const user = userEvent.setup();
    render(<CouponManager token="token-123" />);

    await user.type(screen.getByLabelText('Código'), 'nuevo10');
    await user.selectOptions(screen.getByLabelText('Tipo'), 'percentage');
    await user.type(screen.getByLabelText('Valor'), '20');
    await user.click(screen.getByRole('button', { name: 'Crear cupón' }));

    expect(addCoupon).toHaveBeenCalledWith({ code: 'nuevo10', type: 'percentage', value: 20, active: true });
    expect(await screen.findByText('Cupón creado correctamente.')).toBeInTheDocument();
  });

  it('activa o desactiva un cupón existente', async () => {
    const user = userEvent.setup();
    render(<CouponManager token="token-123" />);

    await user.click(screen.getAllByRole('button', { name: 'Desactivar' })[0]);

    expect(editCoupon).toHaveBeenCalledWith('1', { active: false });
    expect(await screen.findByText('Cupón actualizado correctamente.')).toBeInTheDocument();
  });

  it('elimina un cupón tras confirmar', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<CouponManager token="token-123" />);

    await user.click(screen.getAllByRole('button', { name: 'Eliminar' })[0]);

    expect(removeCoupon).toHaveBeenCalledWith('1');
    expect(await screen.findByText('Cupón eliminado correctamente.')).toBeInTheDocument();
  });

  it('muestra el estado vacío cuando no hay cupones', () => {
    useCoupons.mockReturnValue({
      coupons: [],
      loading: false,
      error: null,
      loadCoupons,
      addCoupon,
      editCoupon,
      removeCoupon,
    });

    render(<CouponManager token="token-123" />);

    expect(screen.getByText('Todavía no hay cupones creados.')).toBeInTheDocument();
  });
});
