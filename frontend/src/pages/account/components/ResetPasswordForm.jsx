import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const inputClass =
  'w-full rounded-md border border-light-border bg-light-surface px-3 py-2 text-light-text-primary placeholder:text-light-text-secondary focus:border-light-accent focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary dark:focus:border-dark-accent';

const labelClass = 'mb-1 block text-sm font-medium text-light-text-primary dark:text-dark-text-primary';

export default function ResetPasswordForm({ token, onSubmit, onBack, loading, error, message }) {
  const { t } = useTranslation('account');
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [mismatch, setMismatch] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMismatch(false);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMismatch(true);
      return;
    }
    try {
      await onSubmit(token, form.password);
    } catch {
      // el error se refleja desde el hook de recuperación
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">{t('resetPassword.title')}</h2>
      <div>
        <label className={labelClass}>{t('resetPassword.password')}</label>
        <input className={inputClass} type="password" name="password" value={form.password} onChange={handleChange} required />
      </div>
      <div>
        <label className={labelClass}>{t('resetPassword.confirmPassword')}</label>
        <input
          className={inputClass}
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      {mismatch && <p className="text-sm font-medium text-light-error dark:text-dark-error">{t('resetPassword.mismatch')}</p>}
      {message && <p className="text-sm font-medium text-light-success dark:text-dark-success">{message}</p>}
      {error && <p className="text-sm font-medium text-light-error dark:text-dark-error">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-light-accent px-5 py-2.5 font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60 dark:bg-dark-accent"
      >
        {t('resetPassword.submit')}
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
