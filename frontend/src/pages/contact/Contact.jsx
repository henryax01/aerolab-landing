import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaPhone, FaEnvelope, FaClock, FaCheckCircle,
  FaGithub, FaLinkedin, FaInstagram,
} from 'react-icons/fa';
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

const SOCIALS = [
  { icon: FaGithub,    href: '#', label: 'GitHub' },
  { icon: FaLinkedin,  href: '#', label: 'LinkedIn' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
];

const inputClass =
  'w-full rounded-md border border-light-border bg-light-surface px-3 py-2.5 text-light-text-primary placeholder:text-light-text-secondary focus:border-light-accent focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary dark:focus:border-dark-accent';

const labelClass = 'mb-1 block text-sm font-medium text-light-text-primary dark:text-dark-text-primary';

const EMPTY_FORM = { name: '', email: '', company: '', subject: '', service: '', message: '' };

export default function Contact() {
  const { t } = useTranslation('contact');
  usePageMeta('contact', pageMetadata.path);
  const { loading, error, success, sendMessage } = useContact();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  const services = t('form.services', { returnObjects: true }) || {};

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const body = [
      form.subject   && `Asunto: ${form.subject}`,
      form.company   && `Empresa: ${form.company}`,
      form.service   && `Servicio: ${form.service}`,
      '',
      form.message,
    ].filter((l) => l !== false).join('\n');
    try {
      await sendMessage(form.name, form.email, body);
      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch {
      // error state already reflected by hook
    }
  };

  const handleReset = () => setSubmitted(false);

  return (
    <div className="bg-light-background text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">

      {/* ── Hero ── */}
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
            <a
              href="#"
              className="rounded-lg border border-light-accent/50 px-6 py-3 font-semibold text-light-accent transition-all duration-200 hover:-translate-y-0.5 hover:bg-light-accent/10 dark:border-dark-accent/50 dark:text-dark-accent dark:hover:bg-dark-accent/10"
            >
              {t('hero.scheduleButton')}
            </a>
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-light-border to-transparent dark:via-dark-border" />
      </section>

      {/* ── Info + Form ── */}
      <section className="mx-auto grid max-w-5xl gap-8 px-4 pt-16 pb-20 lg:grid-cols-2">

        {/* Info card */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-light-border bg-light-surface dark:border-dark-border dark:bg-dark-surface">
          {/* gradient header */}
          <div className="relative h-36 w-full overflow-hidden bg-gradient-to-br from-light-accent/10 via-light-surface to-light-accent/5 dark:from-dark-accent/10 dark:via-dark-surface dark:to-dark-accent/5">
            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center opacity-10">
              <svg viewBox="0 0 400 144" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <circle cx="80"  cy="72" r="55" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="80"  cy="72" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="320" cy="72" r="55" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="320" cy="72" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <line x1="0" y1="72" x2="400" y2="72" stroke="currentColor" strokeWidth="0.5" strokeDasharray="8 4" />
                <line x1="200" y1="0" x2="200" y2="144" stroke="currentColor" strokeWidth="0.5" strokeDasharray="8 4" />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-light-accent/30 bg-light-accent/10 dark:border-dark-accent/30 dark:bg-dark-accent/10">
                <FaEnvelope aria-hidden="true" className="text-2xl text-light-accent dark:text-dark-accent" />
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Response-time badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-light-accent/20 bg-light-accent/10 px-3 py-1 text-xs font-semibold text-light-accent dark:border-dark-accent/20 dark:bg-dark-accent/10 dark:text-dark-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {t('info.responseTime')}
            </div>

            <h2 className="text-xl font-bold">{t('info.title')}</h2>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <FaPhone aria-hidden="true" className="mt-0.5 shrink-0 text-light-accent dark:text-dark-accent" />
                <div>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">{t('info.phone')}</p>
                  <p className="font-medium">{PHONE}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaEnvelope aria-hidden="true" className="mt-0.5 shrink-0 text-light-accent dark:text-dark-accent" />
                <div>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">{t('info.email')}</p>
                  <p className="font-medium">{EMAIL}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaClock aria-hidden="true" className="mt-0.5 shrink-0 text-light-accent dark:text-dark-accent" />
                <div>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">{t('info.hours')}</p>
                  <p className="font-medium">{t('info.hoursValue')}</p>
                </div>
              </li>
            </ul>

            {/* FAQ link */}
            <Link
              to="/faq"
              className="text-sm font-medium text-light-accent transition-colors hover:underline dark:text-dark-accent"
            >
              {t('info.faqLink')}
            </Link>

            {/* Social icons */}
            <div className="mt-auto">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-light-text-secondary dark:text-dark-text-secondary">
                {t('info.social')}
              </p>
              <div className="flex gap-3">
                {SOCIALS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-light-border text-light-text-secondary transition-all duration-200 hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:text-dark-text-secondary dark:hover:border-dark-accent dark:hover:text-dark-accent"
                  >
                    <Icon aria-hidden="true" className="text-base" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form / Success panel */}
        <div className="rounded-xl border border-light-border bg-light-surface p-6 dark:border-dark-border dark:bg-dark-surface">

          {submitted && success ? (
            <div className="flex flex-col items-center justify-center gap-5 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-light-accent/10 dark:bg-dark-accent/10">
                <FaCheckCircle aria-hidden="true" className="text-4xl text-light-accent dark:text-dark-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-black">{t('messages.successTitle')}</h2>
                <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">
                  {t('messages.successSubtitle')}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="mt-2 rounded-md border border-light-accent px-5 py-2 text-sm font-semibold text-light-accent transition-colors hover:bg-light-accent/10 dark:border-dark-accent dark:text-dark-accent dark:hover:bg-dark-accent/10"
              >
                {t('messages.successBack')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-bold">{t('form.title')}</h2>
              <div className="mt-4 space-y-4">

                {/* Name + Company */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>{t('form.name')}</label>
                    <input
                      className={inputClass}
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder={t('form.namePlaceholder')}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t('form.company')}</label>
                    <input
                      className={inputClass}
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder={t('form.companyPlaceholder')}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className={labelClass}>{t('form.email')}</label>
                  <input
                    className={inputClass}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t('form.emailPlaceholder')}
                    required
                  />
                </div>

                {/* Subject + Service */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>{t('form.subject')}</label>
                    <input
                      className={inputClass}
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder={t('form.subjectPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t('form.service')}</label>
                    <select
                      className={inputClass}
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                    >
                      <option value="">{services.default}</option>
                      {['web', 'design', 'marketing', 'ai', 'consulting', 'other'].map((key) => (
                        <option key={key} value={key}>{services[key]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className={labelClass}>{t('form.message')}</label>
                  <textarea
                    className={inputClass}
                    name="message"
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    placeholder={t('form.messagePlaceholder')}
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm font-medium text-light-error dark:text-dark-error">{t('messages.error')}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-light-accent px-5 py-2.5 font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60 dark:bg-dark-accent"
                >
                  {loading ? '...' : t('form.submit')}
                </button>

                <p className="text-center text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {t('form.disclaimer')}
                </p>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
