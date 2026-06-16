import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaPhone, FaEnvelope, FaClock, FaCheckCircle,
  FaGithub, FaLinkedin, FaInstagram,
  FaMapMarkerAlt, FaRobot, FaPaperclip,
} from 'react-icons/fa';
import useContact from '../../hooks/useContact.jsx';
import usePageMeta from '../../hooks/usePageMeta.jsx';
import CountUp from '../../components/common/CountUp.jsx';
import ScrollReveal from '../../components/common/ScrollReveal.jsx';

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
const MAX_CHARS = 1000;

const SOCIALS = [
  { icon: FaGithub,    href: '#', label: 'GitHub' },
  { icon: FaLinkedin,  href: '#', label: 'LinkedIn' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
];

const inputBase =
  'w-full rounded-md border bg-light-surface px-3 py-2.5 text-light-text-primary placeholder:text-light-text-secondary focus:outline-none dark:bg-dark-surface dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary';
const inputOk  = `${inputBase} border-light-border focus:border-light-accent dark:border-dark-border dark:focus:border-dark-accent`;
const inputErr = `${inputBase} border-light-error focus:border-light-error dark:border-dark-error dark:focus:border-dark-error`;

const labelClass = 'mb-1 block text-sm font-medium text-light-text-primary dark:text-dark-text-primary';
const errClass   = 'mt-1 text-xs text-light-error dark:text-dark-error';

const EMPTY = { name: '', email: '', company: '', subject: '', service: '', message: '' };

function isAvailableNow() {
  const d = new Date();
  const day = d.getDay();
  const h = d.getHours();
  return day >= 1 && day <= 5 && h >= 9 && h < 18;
}

export default function Contact() {
  const { t } = useTranslation('contact');
  usePageMeta('contact', pageMetadata.path);
  const { loading, error, success, sendMessage } = useContact();
  const [searchParams] = useSearchParams();
  const fileRef = useRef(null);

  const [form, setForm]           = useState(EMPTY);
  const [touched, setTouched]     = useState({});
  const [fieldErrors, setFErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [attached, setAttached]   = useState(null);
  const [wordIdx, setWordIdx]     = useState(0);
  const [wordOn, setWordOn]       = useState(true);

  const words      = useMemo(() => t('hero.words', { returnObjects: true }) || [t('hero.title')], [t]);
  const services   = useMemo(() => t('form.services',  { returnObjects: true }) || {}, [t]);
  const trustStats = useMemo(() => t('trust.stats',    { returnObjects: true }) || [], [t]);
  const steps      = useMemo(() => t('steps.items',    { returnObjects: true }) || [], [t]);
  const available  = useMemo(() => isAvailableNow(), []);

  // 3 — URL auto-fill
  useEffect(() => {
    const svc = searchParams.get('service');
    if (svc) setForm(f => ({ ...f, service: svc }));
  }, [searchParams]);

  // 9 — Typewriter cycling
  useEffect(() => {
    if (!words || words.length <= 1) return;
    const id = setInterval(() => {
      setWordOn(false);
      setTimeout(() => { setWordIdx(i => (i + 1) % words.length); setWordOn(true); }, 350);
    }, 2800);
    return () => clearInterval(id);
  }, [words.length]);

  // 1 — Inline validation helpers
  const validate = (name, value) => {
    if ((name === 'name' || name === 'message') && !value.trim()) return t('form.errors.required');
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t('form.errors.email');
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (touched[name]) setFErrors(p => ({ ...p, [name]: validate(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    setFErrors(p => ({ ...p, [name]: validate(name, value) }));
  };

  const handleFile = (e) => setAttached(e.target.files[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    ['name', 'email', 'message'].forEach(k => { const err = validate(k, form[k]); if (err) errs[k] = err; });
    if (Object.keys(errs).length) {
      setFErrors(errs);
      setTouched({ name: true, email: true, message: true });
      return;
    }
    const body = [
      form.subject && `Asunto: ${form.subject}`,
      form.company && `Empresa: ${form.company}`,
      form.service && `Servicio: ${services[form.service] || form.service}`,
      attached     && `Adjunto: ${attached.name}`,
      '',
      form.message,
    ].filter(Boolean).join('\n');
    try {
      await sendMessage(form.name, form.email, body);
      setSubmitted(true);
      setForm(EMPTY);
      setTouched({});
      setFErrors({});
      setAttached(null);
    } catch { /* error state handled by hook */ }
  };

  // 5 — Open chat via custom event (ChatWidget listens for this)
  const openChat = () => window.dispatchEvent(new CustomEvent('openChat'));

  return (
    <div className="bg-light-background text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-light-surface to-light-background py-24 text-center dark:from-dark-surface dark:to-dark-background">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-light-accent/40 to-transparent dark:via-dark-accent/40" />
        <div className="mx-auto max-w-4xl px-4">
          <span className="inline-block rounded-full border border-light-accent/20 bg-light-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-light-accent dark:border-dark-accent/20 dark:bg-dark-accent/10 dark:text-dark-accent">
            {t('hero.badge')}
          </span>

          {/* 9 — Typewriter title */}
          <h1
            className="mt-5 text-5xl font-black tracking-tight sm:text-6xl"
            style={{
              opacity: wordOn ? 1 : 0,
              transform: wordOn ? 'translateY(0)' : 'translateY(-10px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}
          >
            {words[wordIdx]}
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-light-text-secondary dark:text-dark-text-secondary">
            {t('hero.subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={`tel:${PHONE.replace(/[^+\d]/g, '')}`}
              className="rounded-lg bg-light-accent px-6 py-3 font-semibold text-white shadow-lg shadow-light-accent/20 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 dark:bg-dark-accent dark:shadow-dark-accent/20">
              {t('hero.callButton')}
            </a>
            <a href={`mailto:${EMAIL}`}
              className="rounded-lg border border-light-border px-6 py-3 font-semibold text-light-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-light-accent hover:bg-light-surface dark:border-dark-border dark:text-dark-text-primary dark:hover:border-dark-accent dark:hover:bg-dark-surface">
              {t('hero.emailButton')}
            </a>
            <a href="#"
              className="rounded-lg border border-light-accent/50 px-6 py-3 font-semibold text-light-accent transition-all duration-200 hover:-translate-y-0.5 hover:bg-light-accent/10 dark:border-dark-accent/50 dark:text-dark-accent dark:hover:bg-dark-accent/10">
              {t('hero.scheduleButton')}
            </a>
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-light-border to-transparent dark:via-dark-border" />
      </section>

      {/* ── Info card + Form ── */}
      <section className="mx-auto grid max-w-5xl gap-8 px-4 pt-16 pb-12 lg:grid-cols-2">

        {/* Info card */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-light-border bg-light-surface dark:border-dark-border dark:bg-dark-surface">
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

          <div className="flex flex-1 flex-col gap-5 p-6">
            {/* 2 — Live availability badge */}
            <div className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
              available
                ? 'border-green-400/40 bg-green-400/10 text-green-600 dark:text-green-400'
                : 'border-light-accent/20 bg-light-accent/10 text-light-accent dark:border-dark-accent/20 dark:bg-dark-accent/10 dark:text-dark-accent'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${available ? 'animate-pulse bg-green-500' : 'bg-current'}`} />
              {available ? t('info.availableNow') : t('info.unavailable')}
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
              {/* 7 — Location */}
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt aria-hidden="true" className="mt-0.5 shrink-0 text-light-accent dark:text-dark-accent" />
                <div>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">{t('info.location')}</p>
                  <p className="font-medium">{t('info.locationValue')}</p>
                </div>
              </li>
            </ul>

            <Link to="/faq"
              className="text-sm font-medium text-light-accent transition-colors hover:underline dark:text-dark-accent">
              {t('info.faqLink')}
            </Link>

            {/* 5 — Open chat button */}
            <button type="button" onClick={openChat}
              className="flex w-fit items-center gap-2 rounded-lg border border-light-border px-4 py-2 text-sm font-medium text-light-text-primary transition-all duration-200 hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:text-dark-text-primary dark:hover:border-dark-accent dark:hover:text-dark-accent">
              <FaRobot aria-hidden="true" className="text-base" />
              {t('info.openChat')}
            </button>

            {/* Social icons */}
            <div className="mt-auto">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-light-text-secondary dark:text-dark-text-secondary">
                {t('info.social')}
              </p>
              <div className="flex gap-3">
                {SOCIALS.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-light-border text-light-text-secondary transition-all duration-200 hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:text-dark-text-secondary dark:hover:border-dark-accent dark:hover:text-dark-accent">
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
                <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">{t('messages.successSubtitle')}</p>
              </div>
              <button onClick={() => setSubmitted(false)}
                className="mt-2 rounded-md border border-light-accent px-5 py-2 text-sm font-semibold text-light-accent transition-colors hover:bg-light-accent/10 dark:border-dark-accent dark:text-dark-accent dark:hover:bg-dark-accent/10">
                {t('messages.successBack')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <h2 className="text-xl font-bold">{t('form.title')}</h2>
              <div className="mt-4 space-y-4">

                {/* Name + Company */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>{t('form.name')}</label>
                    <input name="name" value={form.name}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder={t('form.namePlaceholder')} required
                      className={fieldErrors.name && touched.name ? inputErr : inputOk} />
                    {fieldErrors.name && touched.name && <p className={errClass}>{fieldErrors.name}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>{t('form.company')}</label>
                    <input name="company" value={form.company}
                      onChange={handleChange}
                      placeholder={t('form.companyPlaceholder')}
                      className={inputOk} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className={labelClass}>{t('form.email')}</label>
                  <input type="email" name="email" value={form.email}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder={t('form.emailPlaceholder')} required
                    className={fieldErrors.email && touched.email ? inputErr : inputOk} />
                  {fieldErrors.email && touched.email && <p className={errClass}>{fieldErrors.email}</p>}
                </div>

                {/* Subject + Service */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>{t('form.subject')}</label>
                    <input name="subject" value={form.subject}
                      onChange={handleChange}
                      placeholder={t('form.subjectPlaceholder')}
                      className={inputOk} />
                  </div>
                  <div>
                    <label className={labelClass}>{t('form.service')}</label>
                    <select name="service" value={form.service} onChange={handleChange} className={inputOk}>
                      <option value="">{services.default}</option>
                      {['web','design','marketing','ai','consulting','other'].map(k => (
                        <option key={k} value={k}>{services[k]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message + 4 — char counter */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      {t('form.message')}
                    </label>
                    <span className={`text-xs tabular-nums transition-colors ${
                      form.message.length > MAX_CHARS * 0.9
                        ? 'text-light-error dark:text-dark-error'
                        : 'text-light-text-secondary dark:text-dark-text-secondary'
                    }`}>
                      {form.message.length} / {MAX_CHARS}
                    </span>
                  </div>
                  <textarea name="message" rows="5" value={form.message}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder={t('form.messagePlaceholder')}
                    maxLength={MAX_CHARS} required
                    className={fieldErrors.message && touched.message ? inputErr : inputOk} />
                  {fieldErrors.message && touched.message && <p className={errClass}>{fieldErrors.message}</p>}
                </div>

                {/* 8 — File attachment */}
                <div>
                  <input ref={fileRef} type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={handleFile} className="hidden" />
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="flex w-full items-center gap-2 rounded-md border border-dashed border-light-border px-3 py-2.5 text-sm text-light-text-secondary transition-colors hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:text-dark-text-secondary dark:hover:border-dark-accent dark:hover:text-dark-accent">
                    <FaPaperclip aria-hidden="true" className="shrink-0" />
                    <span className="flex-1 truncate text-left">
                      {attached ? attached.name : t('form.attachment')}
                    </span>
                    <span className="shrink-0 text-xs opacity-50">{t('form.attachmentHint')}</span>
                  </button>
                </div>

                {error && <p className="text-sm font-medium text-light-error dark:text-dark-error">{t('messages.error')}</p>}

                <button type="submit" disabled={loading}
                  className="w-full rounded-md bg-light-accent px-5 py-2.5 font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60 dark:bg-dark-accent">
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

      {/* 6 — Trust stats */}
      {trustStats.length > 0 && (
        <section className="border-y border-light-border bg-light-surface py-12 dark:border-dark-border dark:bg-dark-surface">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-4 sm:grid-cols-4">
            {trustStats.map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 70}>
                <div className="text-center">
                  <CountUp value={s.value} className="block text-3xl font-black text-light-accent dark:text-dark-accent" />
                  <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">{s.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* 10 — Process steps */}
      {steps.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4">
            <ScrollReveal>
              <h2 className="text-center text-3xl font-black tracking-tight">{t('steps.title')}</h2>
            </ScrollReveal>
            <div className="relative mt-12">
              <div aria-hidden="true" className="absolute top-6 left-[calc(12.5%+1.5rem)] right-[calc(12.5%+1.5rem)] hidden h-px bg-gradient-to-r from-light-accent/20 via-light-border to-light-accent/20 dark:from-dark-accent/20 dark:via-dark-border dark:to-dark-accent/20 sm:block" />
              <div className="grid gap-10 sm:grid-cols-4">
                {steps.map((step, i) => (
                  <ScrollReveal key={step.num} delay={i * 80}>
                    <div className="flex flex-col items-center text-center">
                      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-light-accent bg-light-background text-sm font-black text-light-accent dark:border-dark-accent dark:bg-dark-background dark:text-dark-accent">
                        {step.num}
                      </div>
                      <h3 className="mt-4 font-bold">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">
                        {step.text}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
