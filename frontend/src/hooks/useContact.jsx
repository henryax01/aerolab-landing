import { useCallback, useState } from 'react';
import { sendContactMessage } from '../utils/contactData.jsx';

export default function useContact() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const sendMessage = useCallback(async (name, email, message) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await sendContactMessage({ name, email, message });
      setSuccess(true);
      return res;
    } catch (err) {
      setError(err?.response?.data?.detail || 'No se pudo enviar el mensaje.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, success, sendMessage };
}
