import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const inputClass =
  'w-full rounded-md border border-light-border bg-light-surface px-3 py-2 text-light-text-primary placeholder:text-light-text-secondary focus:border-light-accent focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary dark:focus:border-dark-accent';

const labelClass = 'mb-1 block text-sm font-medium text-light-text-primary dark:text-dark-text-primary';

const buttonClass =
  'rounded-md bg-light-accent px-5 py-2.5 font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60 dark:bg-dark-accent';

const secondaryButtonClass =
  'rounded-md border border-light-border px-5 py-2.5 font-semibold text-light-text-primary transition-colors hover:bg-light-surface-secondary disabled:opacity-60 dark:border-dark-border dark:text-dark-text-primary dark:hover:bg-dark-surface-secondary';

function downloadBackupCodes(codes) {
  const blob = new Blob([codes.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'codigos-respaldo.txt';
  link.click();
  URL.revokeObjectURL(url);
}

export default function TwoFactorSetup({ enabled, onSetup, onEnable, onDisable }) {
  const { t } = useTranslation('account');
  const [stage, setStage] = useState('idle');
  const [setupData, setSetupData] = useState(null);
  const [backupCodes, setBackupCodes] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reset = () => {
    setStage('idle');
    setSetupData(null);
    setBackupCodes(null);
    setCode('');
    setError(null);
  };

  const startSetup = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await onSetup();
      setSetupData(res);
      setStage('setup');
    } catch (err) {
      setError(err?.response?.data?.detail || null);
    } finally {
      setLoading(false);
    }
  };

  const startDisable = () => {
    setStage('disable');
    setCode('');
    setError(null);
  };

  const confirmEnable = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await onEnable(code);
      setBackupCodes(res.backupCodes);
      setStage('backupCodes');
      setCode('');
    } catch (err) {
      setError(err?.response?.data?.detail || null);
    } finally {
      setLoading(false);
    }
  };

  const confirmDisable = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onDisable(code);
      reset();
    } catch (err) {
      setError(err?.response?.data?.detail || null);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 className="text-lg font-bold">{t('twoFactor.settings.title')}</h3>
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {enabled ? t('twoFactor.settings.enabledSubtitle') : t('twoFactor.settings.disabledSubtitle')}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
          enabled
            ? 'bg-light-success/15 text-light-success dark:bg-dark-success/15 dark:text-dark-success'
            : 'bg-light-surface-secondary text-light-text-secondary dark:bg-dark-surface-secondary dark:text-dark-text-secondary'
        }`}
      >
        {enabled ? t('twoFactor.settings.enabledBadge') : t('twoFactor.settings.disabledBadge')}
      </span>
    </div>
  );

  if (stage === 'setup' && setupData) {
    return (
      <div className="space-y-4">
        {renderHeader()}
        <div className="rounded-md border border-light-border p-4 dark:border-dark-border">
          <h4 className="font-semibold">{t('twoFactor.settings.setupTitle')}</h4>
          <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {t('twoFactor.settings.setupInstructions')}
          </p>
          <img src={setupData.qrCode} alt={t('twoFactor.settings.setupTitle')} className="mt-4 h-44 w-44 rounded-md border border-light-border bg-white p-2 dark:border-dark-border" />
          <p className="mt-3 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {t('twoFactor.settings.manualEntry')}: <code className="font-mono text-light-text-primary dark:text-dark-text-primary">{setupData.secret}</code>
          </p>
          <form onSubmit={confirmEnable} className="mt-4 space-y-3">
            <div>
              <label htmlFor="two-factor-setup-code" className={labelClass}>{t('twoFactor.settings.confirmCode')}</label>
              <input
                id="two-factor-setup-code"
                className={inputClass}
                type="text"
                inputMode="text"
                autoComplete="one-time-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm font-medium text-light-error dark:text-dark-error">{error}</p>}
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={loading} className={buttonClass}>
                {t('twoFactor.settings.confirmSubmit')}
              </button>
              <button type="button" onClick={reset} disabled={loading} className={secondaryButtonClass}>
                {t('twoFactor.settings.cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (stage === 'backupCodes' && backupCodes) {
    return (
      <div className="space-y-4">
        {renderHeader()}
        <div className="rounded-md border border-light-border p-4 dark:border-dark-border">
          <h4 className="font-semibold">{t('twoFactor.settings.backupCodesTitle')}</h4>
          <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {t('twoFactor.settings.backupCodesSubtitle')}
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-2 font-mono text-sm">
            {backupCodes.map((item) => (
              <li key={item} className="rounded-md border border-light-border bg-light-surface-secondary px-3 py-2 text-center dark:border-dark-border dark:bg-dark-surface-secondary">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => downloadBackupCodes(backupCodes)} className={secondaryButtonClass}>
              {t('twoFactor.settings.downloadCodes')}
            </button>
            <button type="button" onClick={reset} className={buttonClass}>
              {t('twoFactor.settings.done')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'disable') {
    return (
      <div className="space-y-4">
        {renderHeader()}
        <form onSubmit={confirmDisable} className="space-y-3 rounded-md border border-light-border p-4 dark:border-dark-border">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {t('twoFactor.settings.disableInstructions')}
          </p>
          <div>
            <label htmlFor="two-factor-disable-code" className={labelClass}>{t('twoFactor.verify.code')}</label>
            <input
              id="two-factor-disable-code"
              className={inputClass}
              type="text"
              inputMode="text"
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm font-medium text-light-error dark:text-dark-error">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={loading} className={buttonClass}>
              {t('twoFactor.settings.confirmDisable')}
            </button>
            <button type="button" onClick={reset} disabled={loading} className={secondaryButtonClass}>
              {t('twoFactor.settings.cancel')}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {renderHeader()}
      {error && <p className="text-sm font-medium text-light-error dark:text-dark-error">{error}</p>}
      {enabled ? (
        <button type="button" onClick={startDisable} disabled={loading} className={secondaryButtonClass}>
          {t('twoFactor.settings.disable')}
        </button>
      ) : (
        <button type="button" onClick={startSetup} disabled={loading} className={buttonClass}>
          {t('twoFactor.settings.enable')}
        </button>
      )}
    </div>
  );
}
