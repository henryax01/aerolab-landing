import api from './api.jsx';

export async function loginRequest({ email, password }) {
  return api({ method: 'POST', endpoint: '/login', data: { email, password } });
}

export async function registerRequest({ name, email, password }) {
  return api({ method: 'POST', endpoint: '/register', data: { name, email, password } });
}

export async function verifyEmailRequest({ token }) {
  return api({ method: 'POST', endpoint: '/verify-email', data: { token } });
}

export async function resendVerificationRequest({ token }) {
  return api({ method: 'POST', endpoint: '/resend-verification', token });
}

export async function forgotPasswordRequest({ email }) {
  return api({ method: 'POST', endpoint: '/forgot-password', data: { email } });
}

export async function resetPasswordRequest({ token, password }) {
  return api({ method: 'POST', endpoint: '/reset-password', data: { token, password } });
}

export async function verifyTwoFactorLoginRequest({ challengeToken, code }) {
  return api({ method: 'POST', endpoint: '/login/2fa', data: { challengeToken, code } });
}

export async function setupTwoFactorRequest({ token }) {
  return api({ method: 'POST', endpoint: '/2fa/setup', token });
}

export async function enableTwoFactorRequest({ token, code }) {
  return api({ method: 'POST', endpoint: '/2fa/enable', data: { code }, token });
}

export async function disableTwoFactorRequest({ token, code }) {
  return api({ method: 'POST', endpoint: '/2fa/disable', data: { code }, token });
}
