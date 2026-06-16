import { useTranslation } from 'react-i18next';
import { FaHandshake, FaGem, FaUsers, FaRocket, FaBullseye } from 'react-icons/fa';
import ScrollReveal from '../../components/common/ScrollReveal.jsx';
import usePageMeta from '../../hooks/usePageMeta.jsx';

export const pageMetadata = {
  path: '/about',
  label: 'Nosotros',
  category: 'general',
  minRoleLevel: 0,
  maxRoleLevel: Infinity,
  order: 2,
  locations: ['header'],
  description: 'Quiénes somos y qué nos mueve',
  icon: 'FaInfoCircle',
  isSearchable: true,
};

const VALUE_ICONS = [FaHandshake, FaGem, FaUsers];

export default function About() {
  const { t } = useTranslation('about');
  usePageMeta('about', pageMetadata.path);

  const stats = t('hero.stats', { returnObjects: true }) || [];
  const paragraphs = t('story.paragraphs', { returnObjects: true }) || [];
  const highlight = t('story.highlight', { returnObjects: true }) || {};
  const values = t('values.items', { returnObjects: true }) || [];

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
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.label} delay={index * 80}>
                <div className="rounded-lg border border-light-border bg-light-surface p-4 transition-all duration-200 hover:-translate-y-1 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-surface dark:hover:border-dark-accent">
                  <p className="text-2xl font-extrabold text-light-accent dark:text-dark-accent sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs text-light-text-secondary dark:text-dark-text-secondary sm:text-sm">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-light-border to-transparent dark:via-dark-border" />
      </section>

      <section className="bg-light-surface py-20 dark:bg-dark-surface">
        <div className="mx-auto grid max-w-5xl items-center gap-12 px-4 lg:grid-cols-[1fr_1.2fr]">
          <ScrollReveal>
            <div className="relative">
              <img
                src="https://loremflickr.com/640/520/robot,ai,futuristic/all?lock=42"
                alt=""
                loading="lazy"
                className="w-full rounded-2xl border border-light-border object-cover shadow-lg dark:border-dark-border"
              />
              <div className="absolute -bottom-6 -right-6 hidden rounded-xl border border-light-border bg-light-background p-4 shadow-lg sm:block dark:border-dark-border dark:bg-dark-background">
                <p className="text-3xl font-black text-light-accent dark:text-dark-accent">{highlight.value}</p>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{highlight.label}</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <span className="inline-block rounded-full border border-light-accent/20 bg-light-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-light-accent dark:border-dark-accent/20 dark:bg-dark-accent/10 dark:text-dark-accent">
              {t('story.badge')}
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight">{t('story.title')}</h2>
            <div className="mt-5 space-y-4 text-light-text-secondary dark:text-dark-text-secondary">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 sm:grid-cols-2">
            <ScrollReveal>
              <div className="group h-full rounded-xl border border-light-border bg-light-surface p-8 transition-all duration-200 hover:-translate-y-1 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-surface dark:hover:border-dark-accent">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-light-accent/10 dark:bg-dark-accent/10">
                  <FaRocket aria-hidden="true" className="text-2xl text-light-accent transition-transform duration-200 group-hover:scale-110 dark:text-dark-accent" />
                </div>
                <h3 className="mt-4 text-xl font-bold">{t('mission.title')}</h3>
                <p className="mt-2 leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">{t('mission.text')}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <div className="group h-full rounded-xl border border-light-border bg-light-surface p-8 transition-all duration-200 hover:-translate-y-1 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-surface dark:hover:border-dark-accent">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-light-accent/10 dark:bg-dark-accent/10">
                  <FaBullseye aria-hidden="true" className="text-2xl text-light-accent transition-transform duration-200 group-hover:scale-110 dark:text-dark-accent" />
                </div>
                <h3 className="mt-4 text-xl font-bold">{t('vision.title')}</h3>
                <p className="mt-2 leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">{t('vision.text')}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="bg-light-surface py-20 dark:bg-dark-surface">
        <div className="mx-auto max-w-6xl px-4">
          <ScrollReveal>
            <h2 className="text-center text-3xl font-black tracking-tight">{t('values.title')}</h2>
          </ScrollReveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {values.map((value, index) => {
              const Icon = VALUE_ICONS[index % VALUE_ICONS.length];
              return (
                <ScrollReveal key={value.title} delay={index * 80}>
                  <div className="group rounded-xl border border-light-border bg-light-background p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-background dark:hover:border-dark-accent">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-light-accent/10 dark:bg-dark-accent/10">
                      <Icon aria-hidden="true" className="text-2xl text-light-accent transition-transform duration-200 group-hover:scale-110 dark:text-dark-accent" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">{value.text}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
