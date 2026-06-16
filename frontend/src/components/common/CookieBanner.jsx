import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const KEY = 'lp_cookie_consent';

export default function CookieBanner() {
  const { t } = useTranslation('common');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true);
  }, []);

  const accept = () => { localStorage.setItem(KEY, 'accepted'); setVisible(false); };
  const reject = () => { localStorage.setItem(KEY, 'rejected'); setVisible(false); };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-light-border bg-light-surface px-4 py-4 shadow-xl dark:border-dark-border dark:bg-dark-surface">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {t('cookies.text')}{' '}
          <Link to="/privacy" className="underline hover:text-light-accent dark:hover:text-dark-accent">
            {t('cookies.policy')}
          </Link>.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={reject}
            className="rounded-md border border-light-border px-4 py-2 text-sm font-medium text-light-text-secondary transition-colors hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:text-dark-text-secondary dark:hover:border-dark-accent dark:hover:text-dark-accent"
          >
            {t('cookies.reject')}
          </button>
          <button
            onClick={accept}
            className="rounded-md bg-light-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 dark:bg-dark-accent"
          >
            {t('cookies.accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
