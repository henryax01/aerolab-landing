import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle } from 'react-icons/fa';

const inputClass =
  'w-full rounded-md border border-light-border bg-light-background px-3 py-2 text-light-text-primary placeholder:text-light-text-secondary focus:border-light-accent focus:outline-none dark:border-dark-border dark:bg-dark-background dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary dark:focus:border-dark-accent';

const labelClass = 'mb-1 block text-sm font-medium text-light-text-primary dark:text-dark-text-primary';

export default function ProfileForm({ user, onSave }) {
  const { t } = useTranslation('account');
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const payload = {};
    if (name.trim() && name.trim() !== user.name) payload.name = name.trim();
    if (password) payload.password = password;

    if (!Object.keys(payload).length) {
      setError(t('profile.noChanges'));
      return;
    }

    setLoading(true);
    try {
      await onSave(payload);
      setSuccess(true);
      setPassword('');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Error al actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>{t('profile.name')}</label>
        <input
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className={labelClass}>{t('profile.newPassword')}</label>
        <input
          className={inputClass}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('profile.newPasswordHint')}
          autoComplete="new-password"
        />
      </div>

      {error && <p className="text-sm font-medium text-light-error dark:text-dark-error">{error}</p>}
      {success && (
        <p className="flex items-center gap-1.5 text-sm font-medium text-light-success dark:text-dark-success">
          <FaCheckCircle aria-hidden="true" />
          {t('profile.success')}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-light-accent px-5 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60 dark:bg-dark-accent"
      >
        {t('profile.save')}
      </button>
    </form>
  );
}
