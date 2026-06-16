import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ScrollReveal from '../../components/common/ScrollReveal.jsx';
import CountUp from '../../components/common/CountUp.jsx';
import usePageMeta from '../../hooks/usePageMeta.jsx';

export const pageMetadata = {
  path: '/cases',
  label: 'Casos de éxito',
  category: 'general',
  minRoleLevel: 0,
  maxRoleLevel: Infinity,
  order: 55,
  locations: [],
  description: 'Casos de éxito y proyectos destacados',
  icon: 'FaTrophy',
  isSearchable: true,
};

export default function Cases() {
  const { t } = useTranslation('cases');
  usePageMeta('cases', pageMetadata.path);

  const cases = t('cases', { returnObjects: true }) || [];

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
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-light-border to-transparent dark:via-dark-border" />
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl space-y-12 px-4">
          {cases.map((c, index) => (
            <ScrollReveal key={c.client} delay={index * 60}>
              <div className={`grid items-center gap-8 rounded-2xl border border-light-border bg-light-surface p-8 transition-all duration-200 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-surface dark:hover:border-dark-accent lg:grid-cols-[1fr_auto] ${index % 2 === 1 ? 'lg:grid-cols-[auto_1fr]' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-light-accent/10 px-3 py-1 text-xs font-semibold text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent">
                      {c.industry}
                    </span>
                  </div>
                  <h2 className="mt-3 text-2xl font-black">{c.client}</h2>
                  <p className="mt-1 text-sm font-medium text-light-accent dark:text-dark-accent">{c.service}</p>
                  <p className="mt-3 leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">{c.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {c.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-light-border px-3 py-1 text-xs text-light-text-secondary dark:border-dark-border dark:text-dark-text-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={`flex shrink-0 flex-col items-center justify-center rounded-xl border border-light-border bg-light-background p-8 text-center dark:border-dark-border dark:bg-dark-background ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <CountUp value={c.metric} className="block text-5xl font-black text-light-accent dark:text-dark-accent" />
                  <p className="mt-1 text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">{c.metricLabel}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-light-accent py-16 text-center text-white dark:bg-dark-accent">
        <ScrollReveal className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-black">{t('cta')}</h2>
          <Link
            to="/portfolio"
            className="mt-6 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-light-accent transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:text-dark-accent"
          >
            {t('ctaButton')}
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
