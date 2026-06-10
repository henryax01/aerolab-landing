import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useCoupon from './useCoupon.jsx';
import { validateCoupon } from '../utils/couponsData.jsx';

vi.mock('../utils/couponsData.jsx', () => ({
  validateCoupon: vi.fn(),
}));

describe('useCoupon', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('aplica un cupón válido y guarda el resultado', async () => {
    validateCoupon.mockResolvedValue({
      success: true,
      code: 'PROMO10',
      type: 'percentage',
      value: 10,
      discount: 12,
      total: 108,
    });

    const { result } = renderHook(() => useCoupon());

    await act(async () => {
      await result.current.applyCoupon('promo10', 120);
    });

    expect(validateCoupon).toHaveBeenCalledWith({ code: 'promo10', subtotal: 120 });
    expect(result.current.coupon.code).toBe('PROMO10');
    expect(result.current.coupon.discount).toBe(12);
    expect(result.current.error).toBeNull();
  });

  it('guarda el error y limpia el cupón cuando el código no es válido', async () => {
    validateCoupon.mockRejectedValue({ response: { data: { detail: 'El cupón no es válido o ya no está disponible.' } } });

    const { result } = renderHook(() => useCoupon());

    await act(async () => {
      await expect(result.current.applyCoupon('BADCODE', 120)).rejects.toBeTruthy();
    });

    await waitFor(() => expect(result.current.error).toBe('El cupón no es válido o ya no está disponible.'));
    expect(result.current.coupon).toBeNull();
  });

  it('quita el cupón aplicado y limpia el error', async () => {
    validateCoupon.mockResolvedValue({ success: true, code: 'PROMO10', discount: 12, total: 108 });
    const { result } = renderHook(() => useCoupon());

    await act(async () => {
      await result.current.applyCoupon('PROMO10', 120);
    });
    expect(result.current.coupon).not.toBeNull();

    act(() => {
      result.current.removeCoupon();
    });

    expect(result.current.coupon).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
