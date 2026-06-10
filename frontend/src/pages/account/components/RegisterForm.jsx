import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const inputClass =
  'w-full rounded-md border border-light-border bg-light-surface px-3 py-2 text-light-text-primary placeholder:text-light-text-secondary focus:border-light-accent focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary dark:focus:border-dark-accent';

const labelClass = 'mb-1 block text-sm font-medium text-light-text-primary dark:text-dark-text-primary';

export default function RegisterForm({ onSubmit, loading, error }) {
  const { t } = useTranslation('account');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await onSubmit(form.name, form.email, form.password);
    } catch {
      // el error se refleja desde el hook de autenticación
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">{t('register.title')}</h2>
      <div>
        <label className={labelClass}>{t('register.name')}</label>
        <input className={inputClass} name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label className={labelClass}>{t('register.email')}</label>
        <input className={inputClass} type="email" name="email" value={form.email} onChange={handleChange} required />
      </div>
      <div>
        <label className={labelClass}>{t('register.password')}</label>
        <input className={inputClass} type="password" name="password" value={form.password} onChange={handleChange} required />
      </div>
      {error && <p className="text-sm font-medium text-light-error dark:text-dark-error">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-light-accent px-5 py-2.5 font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60 dark:bg-dark-accent"
      >
        {t('register.submit')}
      </button>
    </form>
  );
}
