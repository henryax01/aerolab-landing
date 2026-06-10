import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth.jsx';
import useOrders from '../../hooks/useOrders.jsx';
import useAccountRecovery from '../../hooks/useAccountRecovery.jsx';
import usePageMeta from '../../hooks/usePageMeta.jsx';
import { ROLE_LEVELS } from '../../utils/roles.js';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import ForgotPasswordForm from './components/ForgotPasswordForm.jsx';
import ResetPasswordForm from './components/ResetPasswordForm.jsx';
import VerificationBanner from './components/VerificationBanner.jsx';
import TwoFactorVerify from './components/TwoFactorVerify.jsx';
import TwoFactorSetup from './components/TwoFactorSetup.jsx';
import MyOrders from './components/MyOrders.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import CouponManager from './components/CouponManager.jsx';
import FaceEnroll from './components/FaceEnroll.jsx';

export const pageMetadata = {
  path: '/account',
  label: 'Mi cuenta',
  category: 'cuenta',
  minRoleLevel: 0,
  maxRoleLevel: Infinity,
  order: 6,
  locations: ['header'],
  description: 'Inicio de sesión, registro y panel de usuario',
  icon: 'FaUserCircle',
  isSearchable: true,
};

export default function Account() {
  const { t } = useTranslation('account');
  usePageMeta('account', pageMetadata.path);
  const {
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
  } = useAuth();
  const orderState = useOrders(token);
  const [tab, setTab] = useState('login');
  const [searchParams, setSearchParams] = useSearchParams();
  const recovery = useAccountRecovery(token);

  const resetToken = searchParams.get('reset');
  const verifyToken = searchParams.get('verify');

  const handleFaceLogin = (data) => {
    loginWithSession(data);
  };

  const clearParam = (key) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    if (!verifyToken) return;
    recovery
      .verifyEmail(verifyToken)
      .then(() => markEmailVerified())
      .catch(() => {})
      .finally(() => clearParam('verify'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifyToken]);

  if (resetToken) {
    return (
      <div className="bg-light-background text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">
        <section className="mx-auto max-w-md px-4 py-16">
          <div className="rounded-lg border border-light-border bg-light-surface p-6 dark:border-dark-border dark:bg-dark-surface">
            <ResetPasswordForm
              token={resetToken}
              onSubmit={recovery.resetPassword}
              onBack={() => clearParam('reset')}
              loading={recovery.loading}
              error={recovery.error}
              message={recovery.message}
            />
          </div>
        </section>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-light-background text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">
        <section className="mx-auto max-w-md px-4 py-16">
          <div className="rounded-lg border border-light-border bg-light-surface p-6 dark:border-dark-border dark:bg-dark-surface">
            {twoFactorChallenge ? (
              <TwoFactorVerify
                onSubmit={verifyTwoFactorLogin}
                onCancel={cancelTwoFactorLogin}
                loading={loading}
                error={error}
              />
            ) : (
              <>
            {tab !== 'forgot' && (
              <div role="tablist" aria-label={t('meta.label')} className="mb-6 flex gap-2">
                <button
                  type="button"
                  role="tab"
                  id="account-tab-login"
                  aria-selected={tab === 'login'}
                  aria-controls="account-tabpanel"
                  onClick={() => setTab('login')}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                    tab === 'login'
                      ? 'bg-light-accent text-white dark:bg-dark-accent'
                      : 'bg-light-surface-secondary text-light-text-secondary dark:bg-dark-surface-secondary dark:text-dark-text-secondary'
                  }`}
                >
                  {t('tabs.login')}
                </button>
                <button
                  type="button"
                  role="tab"
                  id="account-tab-register"
                  aria-selected={tab === 'register'}
                  aria-controls="account-tabpanel"
                  onClick={() => setTab('register')}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                    tab === 'register'
                      ? 'bg-light-accent text-white dark:bg-dark-accent'
                      : 'bg-light-surface-secondary text-light-text-secondary dark:bg-dark-surface-secondary dark:text-dark-text-secondary'
                  }`}
                >
                  {t('tabs.register')}
                </button>
              </div>
            )}

            <div
              id="account-tabpanel"
              role="tabpanel"
              aria-labelledby={tab === 'register' ? 'account-tab-register' : tab === 'login' ? 'account-tab-login' : undefined}
            >
              {tab === 'login' && (
                <LoginForm onSubmit={login} loading={loading} error={error} onForgotPassword={() => setTab('forgot')} onFaceLogin={handleFaceLogin} />
              )}
              {tab === 'register' && <RegisterForm onSubmit={register} loading={loading} error={error} />}
              {tab === 'forgot' && (
                <ForgotPasswordForm
                  onSubmit={recovery.requestPasswordReset}
                  onBack={() => setTab('login')}
                  loading={recovery.loading}
                  error={recovery.error}
                  message={recovery.message}
                />
              )}
            </div>
              </>
            )}
          </div>
        </section>
      </div>
    );
  }

  const isAdmin = roleLevel >= ROLE_LEVELS.admin;

  return (
    <div className="bg-light-background text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-light-border bg-light-surface p-6 dark:border-dark-border dark:bg-dark-surface">
          <div>
            <p className="text-xl font-bold">{t('session.greeting', { name: user.name })}</p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {t('session.role')}: {user.role}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 rounded-md border border-light-border px-4 py-2 text-sm font-semibold text-light-text-primary transition-colors hover:bg-light-surface-secondary dark:border-dark-border dark:text-dark-text-primary dark:hover:bg-dark-surface-secondary"
          >
            <FaSignOutAlt aria-hidden="true" />
            {t('session.logout')}
          </button>
        </div>

        {!user.emailVerified && (
          <VerificationBanner
            onResend={recovery.resendVerification}
            loading={recovery.loading}
            error={recovery.error}
            message={recovery.message}
          />
        )}

        <div className="mt-8">
          <FaceEnroll token={token} />
        </div>

        <div className="mt-8 rounded-lg border border-light-border bg-light-surface p-6 dark:border-dark-border dark:bg-dark-surface">
          <TwoFactorSetup
            enabled={user.twoFactorEnabled}
            onSetup={setupTwoFactor}
            onEnable={enableTwoFactor}
            onDisable={disableTwoFactor}
          />
        </div>

        <div className="mt-8 rounded-lg border border-light-border bg-light-surface p-6 dark:border-dark-border dark:bg-dark-surface">
          {isAdmin ? <AdminPanel {...orderState} /> : <MyOrders {...orderState} />}
        </div>

        {isAdmin && (
          <div className="mt-8 rounded-lg border border-light-border bg-light-surface p-6 dark:border-dark-border dark:bg-dark-surface">
            <CouponManager token={token} />
          </div>
        )}
      </section>
    </div>
  );
}
