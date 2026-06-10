import { useCallback, useState } from 'react';
import { validateCoupon } from '../utils/couponsData.jsx';

export default function useCoupon() {
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const applyCoupon = useCallback(async (code, subtotal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await validateCoupon({ code, subtotal });
      setCoupon(res);
      return res;
    } catch (err) {
      setCoupon(null);
      setError(err?.response?.data?.detail || 'El cupón no es válido.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setError(null);
  }, []);

  return { coupon, loading, error, applyCoupon, removeCoupon };
}
