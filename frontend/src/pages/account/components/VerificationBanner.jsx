import { useTranslation } from 'react-i18next';

export default function VerificationBanner({ onResend, loading, error, message }) {
  const { t } = useTranslation('account');

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-light-accent/40 bg-light-accent/10 p-4 text-sm dark:border-dark-accent/40 dark:bg-dark-accent/10">
      <div>
        <p className="font-semibold text-light-text-primary dark:text-dark-text-primary">{t('verification.pendingTitle')}</p>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">{t('verification.pendingSubtitle')}</p>
        {message && <p className="mt-1 font-medium text-light-success dark:text-dark-success">{message}</p>}
        {error && <p className="mt-1 font-medium text-light-error dark:text-dark-error">{error}</p>}
      </div>
      <button
        type="button"
        onClick={onResend}
        disabled={loading}
        className="shrink-0 rounded-md border border-light-border px-4 py-2 font-semibold text-light-text-primary transition-colors hover:bg-light-surface-secondary disabled:opacity-60 dark:border-dark-border dark:text-dark-text-primary dark:hover:bg-dark-surface-secondary"
      >
        {t('verification.resend')}
      </button>
    </div>
  );
}
