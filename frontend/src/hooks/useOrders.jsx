import { useCallback, useState } from 'react';
import {
  createOrder,
  getOrders,
  updateOrderStatus,
  createPaymentIntent,
  confirmPayment,
} from '../utils/ordersData.jsx';

const PAGE_SIZE = 10;

export default function useOrders(token) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');

  const loadOrders = useCallback(async () => {
    if (!token) return [];
    setLoading(true);
    setError(null);
    try {
      const res = await getOrders({ token, page, pageSize: PAGE_SIZE, status, q });
      setOrders(res.orders || []);
      setTotalPages(res.totalPages || 0);
      setTotal(res.total || 0);
      return res.orders || [];
    } catch (err) {
      setError(err?.response?.data?.detail || 'No se pudieron cargar los pedidos.');
      return [];
    } finally {
      setLoading(false);
    }
  }, [token, page, status, q]);

  const filterByStatus = useCallback((nextStatus) => {
    setStatus(nextStatus);
    setPage(1);
  }, []);

  const search = useCallback((nextQ) => {
    setQ(nextQ);
    setPage(1);
  }, []);

  const goToPage = useCallback((nextPage) => {
    setPage(nextPage);
  }, []);

  const placeOrder = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      return await createOrder(payload);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Error al crear el pedido.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changeOrderStatus = useCallback(async (orderId, status, trackingNumber) => {
    const res = await updateOrderStatus({ orderId, status, trackingNumber, token });
    await loadOrders();
    return res;
  }, [token, loadOrders]);

  const startPayment = useCallback(async (orderId, amount) => {
    return createPaymentIntent({ orderId, amount });
  }, []);

  const finishPayment = useCallback(async (orderId, paymentIntentId) => {
    return confirmPayment({ orderId, paymentIntentId });
  }, []);

  return {
    orders,
    loading,
    error,
    loadOrders,
    placeOrder,
    changeOrderStatus,
    startPayment,
    finishPayment,
    page,
    totalPages,
    total,
    pageSize: PAGE_SIZE,
    status,
    q,
    filterByStatus,
    search,
    goToPage,
  };
}
