import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCube } from 'react-icons/fa';
import GuideBot from './GuideBot.jsx';
import ScrollReveal from '../../../components/common/ScrollReveal.jsx';

const Scene3D = lazy(() => import('./Scene3D.jsx'));

function ScenePlaceholder({ label }) {
  return (
    <div className="flex h-full min-h-[320px] items-center justify-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
      {label}
    </div>
  );
}

export default function ExperienceSection() {
  const { t } = useTranslation('experience');

  return (
    <section className="relative overflow-hidden bg-light-surface py-16 dark:bg-dark-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-light-accent/10 blur-3xl dark:bg-dark-accent/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-light-accent/10 blur-3xl dark:bg-dark-accent/10"
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <ScrollReveal className="text-center">
          <span className="inline-block rounded-full bg-light-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent">
            {t('section.badge')}
          </span>
          <h2 className="mt-3 text-3xl font-bold">{t('section.title')}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-light-text-secondary dark:text-dark-text-secondary">
            {t('section.subtitle')}
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[3fr_2fr]">
          <ScrollReveal delay={80}>
            <div className="group relative h-[420px] overflow-hidden rounded-xl border border-light-border bg-light-background shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-light-accent/10 dark:border-dark-border dark:bg-dark-background dark:hover:shadow-dark-accent/10">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-light-surface/40 via-transparent to-transparent dark:from-dark-surface/40" />
              <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-light-surface/80 px-3 py-1 text-xs font-semibold text-light-text-secondary backdrop-blur-sm dark:bg-dark-surface/80 dark:text-dark-text-secondary">
                <FaCube aria-hidden="true" className="text-light-accent dark:text-dark-accent" />
                3D
              </span>
              <Suspense fallback={<ScenePlaceholder label={t('section.loading')} />}>
                <Scene3D />
              </Suspense>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={160} className="h-[420px]">
            <GuideBot />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
