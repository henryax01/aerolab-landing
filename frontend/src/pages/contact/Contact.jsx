import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import useContact from '../../hooks/useContact.jsx';
import usePageMeta from '../../hooks/usePageMeta.jsx';

export const pageMetadata = {
  path: '/contact',
  label: 'Contacto',
  category: 'general',
  minRoleLevel: 0,
  maxRoleLevel: Infinity,
  order: 5,
  locations: ['header'],
  description: 'Formulario y datos de contacto',
  icon: 'FaEnvelope',
  isSearchable: true,
};

const PHONE = '+1 (555) 123-4567';
const EMAIL = 'contacto@aerolab.com';

const inputClass =
  'w-full rounded-md border border-light-border bg-light-surface px-3 py-2 text-light-text-primary placeholder:text-light-text-secondary focus:border-light-accent focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary dark:focus:border-dark-accent';

const labelClass = 'mb-1 block text-sm font-medium text-light-text-primary dark:text-dark-text-primary';

export default function Contact() {
  const { t } = useTranslation('contact');
  usePageMeta('contact', pageMetadata.path);
  const { loading, error, success, sendMessage } = useContact();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await sendMessage(form.name, form.email, form.message);
      setForm({ name: '', email: '', message: '' });
    } catch {
      // el error ya queda reflejado en el estado del hook
    }
  };

  return (
    <div className="bg-light-background text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">
      <section className="relative overflow-hidden bg-gradient-to-b from-light-surface to-light-background py-24 text-center dark:from-dark-surface dark:to-dark-background">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-light-accent/40 to-transparent dark:via-dark-accent/40" />
        <div className="mx-auto max-w-4xl px-4">
          <span className="inline-block rounded-full border border-light-accent/20 bg-light-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-light-accent dark:border-dark-accent/20 dark:bg-dark-accent/10 dark:text-dark-accent">
            {t('hero.badge')}
          </span>
          <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl">{t('hero.title')}</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-light-text-secondary dark:text-dark-text-secondary">
            {t('hero.subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={`tel:${PHONE.replace(/[^+\d]/g, '')}`}
              className="rounded-lg bg-light-accent px-6 py-3 font-semibold text-white shadow-lg shadow-light-accent/20 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 dark:bg-dark-accent dark:shadow-dark-accent/20"
            >
              {t('hero.callButton')}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="rounded-lg border border-light-border px-6 py-3 font-semibold text-light-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-light-accent hover:bg-light-surface dark:border-dark-border dark:text-dark-text-primary dark:hover:border-dark-accent dark:hover:bg-dark-surface"
            >
              {t('hero.emailButton')}
            </a>
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-light-border to-transparent dark:via-dark-border" />
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 pt-16 pb-20 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg border border-light-border bg-light-surface dark:border-dark-border dark:bg-dark-surface">
          <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-light-accent/10 via-light-surface to-light-accent/5 dark:from-dark-accent/10 dark:via-dark-surface dark:to-dark-accent/5">
            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center opacity-10">
              <svg viewBox="0 0 400 160" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <circle cx="80" cy="80" r="60" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="80" cy="80" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="320" cy="80" r="60" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="320" cy="80" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <line x1="0" y1="80" x2="400" y2="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="8 4" />
                <line x1="200" y1="0" x2="200" y2="160" stroke="currentColor" strokeWidth="0.5" strokeDasharray="8 4" />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-light-accent/30 bg-light-accent/10 dark:border-dark-accent/30 dark:bg-dark-accent/10">
                <FaEnvelope aria-hidden="true" className="text-2xl text-light-accent dark:text-dark-accent" />
              </div>
            </div>
          </div>
          <div className="p-6">
          <h2 className="text-xl font-bold">{t('info.title')}</h2>
          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <FaPhone aria-hidden="true" className="text-light-accent dark:text-dark-accent" />
              <div>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">{t('info.phone')}</p>
                <p className="font-medium">{PHONE}</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope aria-hidden="true" className="text-light-accent dark:text-dark-accent" />
              <div>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">{t('info.email')}</p>
                <p className="font-medium">{EMAIL}</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <FaClock aria-hidden="true" className="text-light-accent dark:text-dark-accent" />
              <div>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">{t('info.hours')}</p>
                <p className="font-medium">{t('info.hoursValue')}</p>
              </div>
            </li>
          </ul>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-light-border bg-light-surface p-6 dark:border-dark-border dark:bg-dark-surface"
        >
          <h2 className="text-xl font-bold">{t('form.title')}</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className={labelClass}>{t('form.name')}</label>
              <input className={inputClass} name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label className={labelClass}>{t('form.email')}</label>
              <input className={inputClass} type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label className={labelClass}>{t('form.message')}</label>
              <textarea className={inputClass} name="message" rows="4" value={form.message} onChange={handleChange} required />
            </div>

            {success && (
              <p className="text-sm font-medium text-light-success dark:text-dark-success">{t('messages.success')}</p>
            )}
            {error && <p className="text-sm font-medium text-light-error dark:text-dark-error">{t('messages.error')}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-light-accent px-5 py-2.5 font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60 dark:bg-dark-accent"
            >
              {loading ? t('common:actions.sending', { defaultValue: '...' }) : t('form.submit')}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
