import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useCoupons from './useCoupons.jsx';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../utils/couponsData.jsx';

vi.mock('../utils/couponsData.jsx', () => ({
  getCoupons: vi.fn(),
  createCoupon: vi.fn(),
  updateCoupon: vi.fn(),
  deleteCoupon: vi.fn(),
}));

const SAMPLE = [
  { _id: '1', code: 'PROMO10', type: 'percentage', value: 10, active: true },
  { _id: '2', code: 'FIJO5', type: 'fixed', value: 5, active: false },
];

describe('useCoupons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCoupons.mockResolvedValue({ coupons: SAMPLE });
    createCoupon.mockResolvedValue({ success: true });
    updateCoupon.mockResolvedValue({ success: true });
    deleteCoupon.mockResolvedValue({ success: true });
  });

  it('no carga nada sin token', () => {
    const { result } = renderHook(() => useCoupons(null));

    expect(getCoupons).not.toHaveBeenCalled();
    expect(result.current.coupons).toHaveLength(0);
  });

  it('carga la lista de cupones con un token', async () => {
    const { result } = renderHook(() => useCoupons('token-123'));

    await act(async () => {
      await result.current.loadCoupons();
    });

    expect(getCoupons).toHaveBeenCalledWith({ token: 'token-123' });
    expect(result.current.coupons).toHaveLength(2);
  });

  it('crea un cupón y recarga la lista', async () => {
    const { result } = renderHook(() => useCoupons('token-123'));

    await act(async () => {
      await result.current.addCoupon({ code: 'NUEVO', type: 'percentage', value: 15, active: true });
    });

    expect(createCoupon).toHaveBeenCalledWith({ token: 'token-123', code: 'NUEVO', type: 'percentage', value: 15, active: true });
    expect(getCoupons).toHaveBeenCalled();
  });

  it('edita un cupón y recarga la lista', async () => {
    const { result } = renderHook(() => useCoupons('token-123'));

    await act(async () => {
      await result.current.editCoupon('1', { active: false });
    });

    expect(updateCoupon).toHaveBeenCalledWith({ token: 'token-123', id: '1', active: false });
    expect(getCoupons).toHaveBeenCalled();
  });

  it('elimina un cupón y recarga la lista', async () => {
    const { result } = renderHook(() => useCoupons('token-123'));

    await act(async () => {
      await result.current.removeCoupon('2');
    });

    expect(deleteCoupon).toHaveBeenCalledWith({ token: 'token-123', id: '2' });
    expect(getCoupons).toHaveBeenCalled();
  });

  it('guarda un mensaje de error si la carga falla', async () => {
    getCoupons.mockRejectedValue({ response: { data: { detail: 'No autorizado.' } } });
    const { result } = renderHook(() => useCoupons('token-123'));

    await act(async () => {
      await result.current.loadCoupons();
    });

    await waitFor(() => expect(result.current.error).toBe('No autorizado.'));
  });
});
