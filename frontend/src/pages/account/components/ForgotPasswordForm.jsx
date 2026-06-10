import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const inputClass =
  'w-full rounded-md border border-light-border bg-light-surface px-3 py-2 text-light-text-primary placeholder:text-light-text-secondary focus:border-light-accent focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary dark:focus:border-dark-accent';

const labelClass = 'mb-1 block text-sm font-medium text-light-text-primary dark:text-dark-text-primary';

export default function ForgotPasswordForm({ onSubmit, onBack, loading, error, message }) {
  const { t } = useTranslation('account');
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await onSubmit(email);
    } catch {
      // el error se refleja desde el hook de recuperación
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">{t('forgotPassword.title')}</h2>
      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('forgotPassword.subtitle')}</p>
      <div>
        <label className={labelClass}>{t('forgotPassword.email')}</label>
        <input className={inputClass} type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      {message && <p className="text-sm font-medium text-light-success dark:text-dark-success">{message}</p>}
      {error && <p className="text-sm font-medium text-light-error dark:text-dark-error">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-light-accent px-5 py-2.5 font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60 dark:bg-dark-accent"
      >
        {t('forgotPassword.submit')}
      </button>
      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm font-medium text-light-accent hover:underline dark:text-dark-accent"
      >
        {t('forgotPassword.backToLogin')}
      </button>
    </form>
  );
}
