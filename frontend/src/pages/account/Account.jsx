import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FaSignOutAlt, FaChevronDown, FaShieldAlt, FaUserEdit,
  FaShoppingCart, FaTh,
} from 'react-icons/fa';
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
import ProfileForm from './components/ProfileForm.jsx';

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

// ── Helpers ────────────────────────────────────────────────────────────────────
function initials(name = '') {
  return name.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';
}

const ROLE_BADGE_STYLES = {
  admin:    'bg-light-accent/10 text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent',
  customer: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
};

function roleBadgeClass(role) {
  return ROLE_BADGE_STYLES[role] || 'bg-light-surface-secondary text-light-text-secondary dark:bg-dark-surface-secondary dark:text-dark-text-secondary';
}

// ── Collapsible section ───────────────────────────────────────────────────────
function Section({ icon: Icon, title, subtitle, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-lg border border-light-border bg-light-surface dark:border-dark-border dark:bg-dark-surface">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between p-5 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-light-accent/10 dark:bg-dark-accent/10">
            <Icon aria-hidden="true" className="text-light-accent dark:text-dark-accent" />
          </div>
          <div>
            <p className="font-bold">{title}</p>
            {subtitle && <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{subtitle}</p>}
          </div>
        </div>
        <FaChevronDown
          aria-hidden="true"
          className={`text-light-text-secondary transition-transform duration-200 dark:text-dark-text-secondary ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="border-t border-light-border p-5 dark:border-dark-border">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Account() {
  const { t } = useTranslation('account');
  usePageMeta('account', pageMetadata.path);

  const {
    user, token, roleLevel, loading, error,
    login, loginWithSession, register, logout, markEmailVerified,
    twoFactorChallenge, verifyTwoFactorLogin, cancelTwoFactorLogin,
    setupTwoFactor, enableTwoFactor, disableTwoFactor,
    updateProfile,
  } = useAuth();

  const orderState = useOrders(token);
  const [tab, setTab] = useState('login');
  const [searchParams, setSearchParams] = useSearchParams();
  const recovery = useAccountRecovery(token);

  const resetToken  = searchParams.get('reset');
  const verifyToken = searchParams.get('verify');

  const clearParam = (key) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    setSearchParams(next, { replace: true });
  };

  // Auto-verify email link
  useEffect(() => {
    if (!verifyToken) return;
    recovery.verifyEmail(verifyToken)
      .then(() => markEmailVerified())
      .catch(() => {})
      .finally(() => clearParam('verify'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifyToken]);

  // ── Password reset deep link ───────────────────────────────────────────────
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

  // ── Unauthenticated ────────────────────────────────────────────────────────
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
                    {['login', 'register'].map((id) => (
                      <button
                        key={id}
                        type="button"
                        role="tab"
                        id={`account-tab-${id}`}
                        aria-selected={tab === id}
                        aria-controls="account-tabpanel"
                        onClick={() => setTab(id)}
                        className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                          tab === id
                            ? 'bg-light-accent text-white dark:bg-dark-accent'
                            : 'bg-light-surface-secondary text-light-text-secondary dark:bg-dark-surface-secondary dark:text-dark-text-secondary'
                        }`}
                      >
                        {t(`tabs.${id}`)}
                      </button>
                    ))}
                  </div>
                )}
                <div
                  id="account-tabpanel"
                  role="tabpanel"
                  aria-labelledby={tab !== 'forgot' ? `account-tab-${tab}` : undefined}
                >
                  {tab === 'login' && (
                    <LoginForm
                      onSubmit={login}
                      loading={loading}
                      error={error}
                      onForgotPassword={() => setTab('forgot')}
                      onFaceLogin={loginWithSession}
                    />
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

  // ── Authenticated dashboard ────────────────────────────────────────────────
  const isAdmin = roleLevel >= ROLE_LEVELS.admin;

  return (
    <div className="bg-light-background text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">
      <section className="mx-auto max-w-5xl space-y-6 px-4 py-12">

        {/* 1 + 10 — Hero card with avatar + role badge */}
        <div className="flex flex-wrap items-center gap-5 rounded-xl border border-light-border bg-light-surface p-6 dark:border-dark-border dark:bg-dark-surface">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-light-accent/20 to-light-accent/5 text-2xl font-black text-light-accent dark:from-dark-accent/20 dark:to-dark-accent/5 dark:text-dark-accent">
            {initials(user.name)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xl font-black">{t('session.greeting', { name: user.name })}</p>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${roleBadgeClass(user.role)}`}>
                {user.role}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-light-text-secondary dark:text-dark-text-secondary">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex shrink-0 items-center gap-2 rounded-md border border-light-border px-4 py-2 text-sm font-semibold text-light-text-primary transition-colors hover:bg-light-surface-secondary dark:border-dark-border dark:text-dark-text-primary dark:hover:bg-dark-surface-secondary"
          >
            <FaSignOutAlt aria-hidden="true" />
            {t('session.logout')}
          </button>
        </div>

        {/* 2 — Quick actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/order"
            className="flex items-center gap-2 rounded-lg border border-light-border bg-light-surface px-4 py-2.5 text-sm font-semibold text-light-text-primary transition-all hover:-translate-y-0.5 hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:hover:border-dark-accent dark:hover:text-dark-accent"
          >
            <FaShoppingCart aria-hidden="true" />
            {t('quickActions.newOrder')}
          </Link>
          <Link
            to="/portfolio"
            className="flex items-center gap-2 rounded-lg border border-light-border bg-light-surface px-4 py-2.5 text-sm font-semibold text-light-text-primary transition-all hover:-translate-y-0.5 hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:hover:border-dark-accent dark:hover:text-dark-accent"
          >
            <FaTh aria-hidden="true" />
            {t('quickActions.viewServices')}
          </Link>
        </div>

        {/* Verification banner */}
        {!user.emailVerified && (
          <VerificationBanner
            onResend={recovery.resendVerification}
            loading={recovery.loading}
            error={recovery.error}
            message={recovery.message}
          />
        )}

        {/* 6 — Profile section */}
        <Section icon={FaUserEdit} title={t('profile.title')}>
          <ProfileForm user={user} onSave={updateProfile} />
        </Section>

        {/* 5 — Security section (2FA + Face enroll grouped) */}
        <Section icon={FaShieldAlt} title={t('security.title')} subtitle={t('security.subtitle')}>
          <div className="space-y-6">
            <FaceEnroll token={token} />
            <div className="rounded-lg border border-light-border p-5 dark:border-dark-border">
              <TwoFactorSetup
                enabled={user.twoFactorEnabled}
                onSetup={setupTwoFactor}
                onEnable={enableTwoFactor}
                onDisable={disableTwoFactor}
              />
            </div>
          </div>
        </Section>

        {/* 3 + 4 + 7 + 8 — Orders (MyOrders or AdminPanel) */}
        <div className="rounded-lg border border-light-border bg-light-surface p-6 dark:border-dark-border dark:bg-dark-surface">
          {isAdmin ? <AdminPanel {...orderState} /> : <MyOrders {...orderState} />}
        </div>

        {/* Coupons (admin only) */}
        {isAdmin && (
          <div className="rounded-lg border border-light-border bg-light-surface p-6 dark:border-dark-border dark:bg-dark-surface">
            <CouponManager token={token} />
          </div>
        )}

      </section>
    </div>
  );
}
