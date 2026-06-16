import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import ScrollReveal from '../../components/common/ScrollReveal.jsx';
import CountUp from '../../components/common/CountUp.jsx';
import usePageMeta from '../../hooks/usePageMeta.jsx';

export const pageMetadata = {
  path: '/pricing',
  label: 'Precios',
  category: 'general',
  minRoleLevel: 0,
  maxRoleLevel: Infinity,
  order: 53,
  locations: [],
  description: 'Planes y precios',
  icon: 'FaTag',
  isSearchable: true,
};

const STATS = [
  { value: '+50', label: { es: 'Servicios', en: 'Services' } },
  { value: '+150', label: { es: 'Proyectos', en: 'Projects' } },
  { value: '98%', label: { es: 'Satisfacción', en: 'Satisfaction' } },
];

export default function Pricing() {
  const { t, i18n } = useTranslation('pricing');
  usePageMeta('pricing', pageMetadata.path);

  const plans = t('plans', { returnObjects: true }) || [];
  const lang = i18n.language;

  return (
    <div className="bg-light-background text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">
      <section className="relative overflow-hidden bg-gradient-to-b from-light-surface to-light-background py-24 text-center dark:from-dark-surface dark:to-dark-background">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-light-accent/40 to-transparent dark:via-dark-accent/40" />
        <div className="mx-auto max-w-4xl px-4">
          <span className="inline-block rounded-full border border-light-accent/20 bg-light-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-light-accent dark:border-dark-accent/20 dark:bg-dark-accent/10 dark:text-dark-accent">
            {t('hero.badge')}
          </span>
          <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl">{t('hero.title')}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-light-text-secondary dark:text-dark-text-secondary">
            {t('hero.subtitle')}
          </p>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div key={s.value} className="rounded-xl border border-light-border bg-light-surface p-4 text-center dark:border-dark-border dark:bg-dark-surface">
                <CountUp value={s.value} className="block text-2xl font-black text-light-accent dark:text-dark-accent" />
                <p className="mt-1 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {s.label[lang] || s.label.es}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-light-border to-transparent dark:via-dark-border" />
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <ScrollReveal key={plan.name} delay={index * 80}>
                <div className={`relative flex h-full flex-col rounded-2xl border p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                  plan.highlight
                    ? 'border-light-accent bg-light-accent text-white shadow-lg shadow-light-accent/20 dark:border-dark-accent dark:bg-dark-accent dark:shadow-dark-accent/20'
                    : 'border-light-border bg-light-surface hover:border-light-accent dark:border-dark-border dark:bg-dark-surface dark:hover:border-dark-accent'
                }`}>
                  {plan.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-light-text-primary px-4 py-1 text-xs font-bold text-light-surface dark:bg-dark-text-primary dark:text-dark-surface">
                      {plan.badge}
                    </span>
                  )}
                  <div>
                    <p className={`text-sm font-semibold uppercase tracking-widest ${plan.highlight ? 'text-white/80' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
                      {plan.name}
                    </p>
                    <p className={`mt-2 text-4xl font-black ${plan.highlight ? 'text-white' : 'text-light-text-primary dark:text-dark-text-primary'}`}>
                      {plan.price}
                    </p>
                    <p className={`text-sm ${plan.highlight ? 'text-white/70' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
                      {plan.period}
                    </p>
                    <p className={`mt-4 text-sm leading-relaxed ${plan.highlight ? 'text-white/80' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
                      {plan.description}
                    </p>
                  </div>
                  <ul className="my-6 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <FaCheck aria-hidden="true" className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-white/80' : 'text-light-accent dark:text-dark-accent'}`} />
                        <span className={plan.highlight ? 'text-white/90' : ''}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className={`mt-auto block rounded-xl py-3 text-center font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                      plan.highlight
                        ? 'bg-white text-light-accent hover:bg-light-background dark:text-dark-accent'
                        : 'bg-light-accent text-white hover:opacity-90 dark:bg-dark-accent'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="mt-12 text-center">
            <p className="text-light-text-secondary dark:text-dark-text-secondary">{t('faq.title')}</p>
            <Link to="/faq" className="mt-2 inline-block font-semibold text-light-accent underline underline-offset-2 hover:opacity-80 dark:text-dark-accent">
              {t('faq.link')}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
