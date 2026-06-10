import { useCallback, useEffect, useState } from 'react';
import {
  loginRequest,
  registerRequest,
  verifyTwoFactorLoginRequest,
  setupTwoFactorRequest,
  enableTwoFactorRequest,
  disableTwoFactorRequest,
} from '../utils/authData.jsx';
import { getRoleLevel } from '../utils/roles.js';

const STORAGE_KEY = 'lp_session';

function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function useAuth() {
  const [session, setSession] = useState(readSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [twoFactorChallenge, setTwoFactorChallenge] = useState(null);

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const loginWithSession = useCallback((data) => {
    setSession({ token: data.token, user: data.user });
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginRequest({ email, password });
      if (res.requires2FA) {
        setTwoFactorChallenge({ challengeToken: res.challengeToken });
        return null;
      }
      setSession({ token: res.token, user: res.user });
      return res.user;
    } catch (err) {
      setError(err?.response?.data?.detail || 'Error al iniciar sesión.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerRequest({ name, email, password });
      setSession({ token: res.token, user: res.user });
      return res.user;
    } catch (err) {
      setError(err?.response?.data?.detail || 'Error al crear la cuenta.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyTwoFactorLogin = useCallback(
    async (code) => {
      if (!twoFactorChallenge) return null;
      setLoading(true);
      setError(null);
      try {
        const res = await verifyTwoFactorLoginRequest({ challengeToken: twoFactorChallenge.challengeToken, code });
        setSession({ token: res.token, user: res.user });
        setTwoFactorChallenge(null);
        return res.user;
      } catch (err) {
        setError(err?.response?.data?.detail || 'Código de verificación inválido.');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [twoFactorChallenge],
  );

  const cancelTwoFactorLogin = useCallback(() => {
    setTwoFactorChallenge(null);
    setError(null);
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    setTwoFactorChallenge(null);
  }, []);

  const markEmailVerified = useCallback(() => {
    setSession((current) => (current ? { ...current, user: { ...current.user, emailVerified: true } } : current));
  }, []);

  const setTwoFactorEnabled = useCallback((enabled) => {
    setSession((current) =>
      current ? { ...current, user: { ...current.user, twoFactorEnabled: enabled } } : current,
    );
  }, []);

  const token = session?.token || null;

  const setupTwoFactor = useCallback(async () => {
    return setupTwoFactorRequest({ token });
  }, [token]);

  const enableTwoFactor = useCallback(
    async (code) => {
      const res = await enableTwoFactorRequest({ token, code });
      setTwoFactorEnabled(true);
      return res;
    },
    [token, setTwoFactorEnabled],
  );

  const disableTwoFactor = useCallback(
    async (code) => {
      const res = await disableTwoFactorRequest({ token, code });
      setTwoFactorEnabled(false);
      return res;
    },
    [token, setTwoFactorEnabled],
  );

  const user = session?.user || null;
  const roleLevel = user ? getRoleLevel(user.role) : 0;

  return {
    user,
    token,
    roleLevel,
    loading,
    error,
    login,
    loginWithSession,
    register,
    logout,
    markEmailVerified,
    twoFactorChallenge,
    verifyTwoFactorLogin,
    cancelTwoFactorLogin,
    setupTwoFactor,
    enableTwoFactor,
    disableTwoFactor,
  };
}
