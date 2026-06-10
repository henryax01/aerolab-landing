import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUserCircle } from 'react-icons/fa';
import FaceCameraModal from '../../../components/common/FaceCameraModal.jsx';

const inputClass =
  'w-full rounded-md border border-light-border bg-light-surface px-3 py-2 text-light-text-primary placeholder:text-light-text-secondary focus:border-light-accent focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary dark:focus:border-dark-accent';

const labelClass = 'mb-1 block text-sm font-medium text-light-text-primary dark:text-dark-text-primary';

export default function LoginForm({ onSubmit, loading, error, onForgotPassword, onFaceLogin }) {
  const { t } = useTranslation('account');
  const [form, setForm] = useState({ email: '', password: '' });
  const [showFaceModal, setShowFaceModal] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await onSubmit(form.email, form.password);
    } catch {
      // el error se refleja desde el hook de autenticación
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">{t('login.title')}</h2>
      <div>
        <label className={labelClass}>{t('login.email')}</label>
        <input className={inputClass} type="email" name="email" value={form.email} onChange={handleChange} required />
      </div>
      <div>
        <label className={labelClass}>{t('login.password')}</label>
        <input className={inputClass} type="password" name="password" value={form.password} onChange={handleChange} required />
      </div>
      <button
        type="button"
        onClick={onForgotPassword}
        className="text-sm font-medium text-light-accent hover:underline dark:text-dark-accent"
      >
        {t('login.forgotPassword')}
      </button>
      {error && <p className="text-sm font-medium text-light-error dark:text-dark-error">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-light-accent px-5 py-2.5 font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60 dark:bg-dark-accent"
      >
        {t('login.submit')}
      </button>

      <div className="relative flex items-center gap-3 py-1">
        <div className="flex-1 border-t border-light-border dark:border-dark-border" />
        <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">o</span>
        <div className="flex-1 border-t border-light-border dark:border-dark-border" />
      </div>

      <button
        type="button"
        onClick={() => setShowFaceModal(true)}
        disabled={!form.email}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-light-border px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-light-accent hover:text-light-accent disabled:opacity-40 dark:border-dark-border dark:hover:border-dark-accent dark:hover:text-dark-accent"
      >
        <FaUserCircle aria-hidden="true" />
        Iniciar sesión con rostro
      </button>
      {!form.email && (
        <p className="text-center text-xs text-light-text-secondary dark:text-dark-text-secondary">
          Escribe tu email para usar el login con rostro
        </p>
      )}

      {showFaceModal && (
        <FaceCameraModal
          mode="login"
          email={form.email}
          onSuccess={(data) => { setShowFaceModal(false); onFaceLogin?.(data); }}
          onClose={() => setShowFaceModal(false)}
        />
      )}
    </form>
  );
}
