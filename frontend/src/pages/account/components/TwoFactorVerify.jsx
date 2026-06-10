import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const inputClass =
  'w-full rounded-md border border-light-border bg-light-surface px-3 py-2 text-light-text-primary placeholder:text-light-text-secondary focus:border-light-accent focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary dark:focus:border-dark-accent';

const labelClass = 'mb-1 block text-sm font-medium text-light-text-primary dark:text-dark-text-primary';

export default function TwoFactorVerify({ onSubmit, onCancel, loading, error }) {
  const { t } = useTranslation('account');
  const [code, setCode] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await onSubmit(code);
    } catch {
      // el error se refleja desde el hook de autenticación
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">{t('twoFactor.verify.title')}</h2>
      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('twoFactor.verify.subtitle')}</p>
      <div>
        <label htmlFor="two-factor-login-code" className={labelClass}>{t('twoFactor.verify.code')}</label>
        <input
          id="two-factor-login-code"
          className={inputClass}
          type="text"
          inputMode="text"
          autoComplete="one-time-code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          required
        />
      </div>
      <button
        type="button"
        onClick={onCancel}
        className="text-sm font-medium text-light-accent hover:underline dark:text-dark-accent"
      >
        {t('twoFactor.verify.back')}
      </button>
      {error && <p className="text-sm font-medium text-light-error dark:text-dark-error">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-light-accent px-5 py-2.5 font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60 dark:bg-dark-accent"
      >
        {t('twoFactor.verify.submit')}
      </button>
    </form>
  );
}
