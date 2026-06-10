import { useCallback, useState } from 'react';
import {
  forgotPasswordRequest,
  resendVerificationRequest,
  resetPasswordRequest,
  verifyEmailRequest,
} from '../utils/authData.jsx';

export default function useAccountRecovery(token) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const run = useCallback(async (request, fallbackError) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await request();
      setMessage(res?.message || null);
      return res;
    } catch (err) {
      setError(err?.response?.data?.detail || fallbackError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const requestPasswordReset = useCallback(
    (email) => run(() => forgotPasswordRequest({ email }), 'No se pudo procesar la solicitud.'),
    [run],
  );

  const resetPassword = useCallback(
    (resetToken, password) =>
      run(() => resetPasswordRequest({ token: resetToken, password }), 'No se pudo restablecer la contraseña.'),
    [run],
  );

  const verifyEmail = useCallback(
    (verifyToken) => run(() => verifyEmailRequest({ token: verifyToken }), 'No se pudo verificar el correo.'),
    [run],
  );

  const resendVerification = useCallback(
    () => run(() => resendVerificationRequest({ token }), 'No se pudo reenviar el correo de verificación.'),
    [run, token],
  );

  return { loading, error, message, requestPasswordReset, resetPassword, verifyEmail, resendVerification };
}
