import { useCallback, useState } from 'react';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../utils/couponsData.jsx';

export default function useCoupons(token) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCoupons = useCallback(async () => {
    if (!token) return [];
    setLoading(true);
    setError(null);
    try {
      const res = await getCoupons({ token });
      setCoupons(res.coupons || []);
      return res.coupons || [];
    } catch (err) {
      setError(err?.response?.data?.detail || 'No se pudieron cargar los cupones.');
      return [];
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addCoupon = useCallback(
    async (payload) => {
      const res = await createCoupon({ token, ...payload });
      await loadCoupons();
      return res;
    },
    [token, loadCoupons],
  );

  const editCoupon = useCallback(
    async (id, changes) => {
      const res = await updateCoupon({ token, id, ...changes });
      await loadCoupons();
      return res;
    },
    [token, loadCoupons],
  );

  const removeCoupon = useCallback(
    async (id) => {
      const res = await deleteCoupon({ token, id });
      await loadCoupons();
      return res;
    },
    [token, loadCoupons],
  );

  return { coupons, loading, error, loadCoupons, addCoupon, editCoupon, removeCoupon };
}
