import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  FaCode,
  FaPalette,
  FaBullhorn,
  FaComments,
  FaHeadset,
  FaChartLine,
  FaStar,
} from 'react-icons/fa';
import ExperienceSection from './components/ExperienceSection.jsx';
import ScrollReveal from '../../components/common/ScrollReveal.jsx';
import usePageMeta from '../../hooks/usePageMeta.jsx';

export const pageMetadata = {
  path: '/',
  label: 'Inicio',
  category: 'general',
  minRoleLevel: 0,
  maxRoleLevel: Infinity,
  order: 1,
  locations: ['header'],
  description: 'Página principal de presentación',
  icon: 'FaHome',
  isSearchable: true,
};

const FEATURE_ICONS = [FaCode, FaPalette, FaBullhorn, FaComments, FaHeadset, FaChartLine];

const SECTION_LINKS = [
  { key: 'home', path: '/' },
  { key: 'about', path: '/about' },
  { key: 'portfolio', path: '/portfolio' },
  { key: 'order', path: '/order' },
  { key: 'contact', path: '/contact' },
  { key: 'account', path: '/account' },
];

export default function Home() {
  const { t } = useTranslation('home');
  usePageMeta('home', pageMetadata.path);

  const features = t('features.items', { returnObjects: true }) || [];
  const steps = t('process.steps', { returnObjects: true }) || [];
  const testimonials = t('testimonials.items', { returnObjects: true }) || [];
  const stats = t('hero.stats', { returnObjects: true }) || [];

  return (
    <div className="bg-light-background text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">
      <section className="relative overflow-hidden bg-gradient-to-b from-light-surface to-light-background py-24 text-center dark:from-dark-surface dark:to-dark-background">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-light-accent/40 to-transparent dark:via-dark-accent/40" />
        <div className="mx-auto max-w-6xl px-4">
          <span className="inline-block rounded-full border border-light-accent/20 bg-light-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-light-accent dark:border-dark-accent/20 dark:bg-dark-accent/10 dark:text-dark-accent">
            {t('hero.badge')}
          </span>
          <h1 className="mt-5 text-5xl font-black tracking-tight text-light-text-primary sm:text-6xl dark:text-dark-text-primary">{t('hero.title')}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-light-text-secondary dark:text-dark-text-secondary">
            {t('hero.subtitle')}
          </p>
          <Link
            to="/portfolio"
            className="mt-8 inline-block rounded-lg bg-light-accent px-8 py-3.5 font-semibold text-white shadow-lg shadow-light-accent/20 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl dark:bg-dark-accent dark:shadow-dark-accent/20"
          >
            {t('hero.cta')}
          </Link>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-light-border to-transparent dark:via-dark-border" />
        <ScrollReveal delay={120} className="mt-12">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 px-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-light-border bg-light-surface px-4 py-6 text-center dark:border-dark-border dark:bg-dark-surface"
              >
                <p className="text-3xl font-black text-light-accent dark:text-dark-accent">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-light-surface py-16 dark:bg-dark-surface">
        <div className="mx-auto max-w-6xl px-4">
          <ScrollReveal>
            <h2 className="text-center text-3xl font-black tracking-tight">{t('features.title')}</h2>
          </ScrollReveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
              return (
                <ScrollReveal key={feature.title} delay={index * 80}>
                  <div className="group rounded-lg border border-light-border bg-light-background p-6 transition-all duration-200 hover:-translate-y-1 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-background dark:hover:border-dark-accent">
                    <Icon
                      aria-hidden="true"
                      className="text-2xl text-light-accent transition-transform duration-200 group-hover:scale-110 dark:text-dark-accent"
                    />
                    <h3 className="mt-3 text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">{feature.text}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <ScrollReveal>
            <h2 className="text-center text-3xl font-black tracking-tight">{t('process.title')}</h2>
          </ScrollReveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <ScrollReveal key={step.title} delay={index * 80}>
                <div className="group rounded-lg border border-light-border bg-light-surface p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-surface dark:hover:border-dark-accent">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-light-accent font-bold text-white transition-transform duration-200 group-hover:scale-110 dark:bg-dark-accent">
                    {index + 1}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">{step.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-light-surface py-16 dark:bg-dark-surface">
        <div className="mx-auto max-w-6xl px-4">
          <ScrollReveal>
            <h2 className="text-center text-3xl font-black tracking-tight">{t('testimonials.title')}</h2>
          </ScrollReveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={testimonial.name} delay={index * 80}>
                <div className="flex h-full flex-col rounded-lg border border-light-border bg-light-background p-6 dark:border-dark-border dark:bg-dark-background">
                  <div className="flex gap-1 text-light-accent dark:text-dark-accent">
                    {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                      <FaStar key={starIndex} aria-hidden="true" />
                    ))}
                  </div>
                  <p className="mt-3 flex-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    “{testimonial.text}”
                  </p>
                  <div className="mt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{testimonial.role}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-light-accent py-16 text-white dark:bg-dark-accent">
        <ScrollReveal className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-black tracking-tight">{t('cta.title')}</h2>
          <p className="mt-3 text-white/90">{t('cta.subtitle')}</p>
          <Link
            to="/order"
            className="mt-6 inline-block rounded-md bg-white px-6 py-3 font-semibold text-light-accent transition-colors hover:bg-light-background dark:text-dark-accent"
          >
            {t('cta.button')}
          </Link>
        </ScrollReveal>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <ScrollReveal>
            <h2 className="text-center text-3xl font-black tracking-tight">{t('sections.title')}</h2>
          </ScrollReveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECTION_LINKS.map((link, index) => (
              <ScrollReveal key={link.path} delay={index * 60}>
                <Link
                  to={link.path}
                  className="block rounded-lg border border-light-border bg-light-surface p-6 text-center font-semibold transition-all duration-200 hover:-translate-y-1 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-surface dark:hover:border-dark-accent"
                >
                  {t(`sections.${link.key}`)}
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <ExperienceSection />
    </div>
  );
}
