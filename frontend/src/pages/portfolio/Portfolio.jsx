import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaLaptopCode, FaPaintBrush, FaBullhorn, FaUserTie } from 'react-icons/fa';
import ScrollReveal from '../../components/common/ScrollReveal.jsx';
import usePageMeta from '../../hooks/usePageMeta.jsx';

export const pageMetadata = {
  path: '/portfolio',
  label: 'Servicios',
  category: 'servicios',
  minRoleLevel: 0,
  maxRoleLevel: Infinity,
  order: 3,
  locations: ['header'],
  description: 'Catálogo de servicios y precios',
  icon: 'FaBriefcase',
  isSearchable: true,
};

const SERVICE_KEYS = ['Desarrollo web', 'Diseño gráfico', 'Marketing digital', 'Consultoría'];
const SERVICE_ICONS = [FaLaptopCode, FaPaintBrush, FaBullhorn, FaUserTie];
const SERVICE_IMAGE_TOPICS = ['coding,programming', 'design,creative', 'marketing,advertising', 'consulting,meeting'];

export default function Portfolio() {
  const { t } = useTranslation('portfolio');
  usePageMeta('portfolio', pageMetadata.path);

  const stats = t('hero.stats', { returnObjects: true }) || [];
  const services = t('services.items', { returnObjects: true }) || [];

  return (
    <div className="bg-light-background text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">
      <section className="relative overflow-hidden bg-gradient-to-b from-light-surface to-light-background py-24 text-center dark:from-dark-surface dark:to-dark-background">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-light-accent/40 to-transparent dark:via-dark-accent/40" />
        <div className="mx-auto max-w-5xl px-4">
          <span className="inline-block rounded-full border border-light-accent/20 bg-light-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-light-accent dark:border-dark-accent/20 dark:bg-dark-accent/10 dark:text-dark-accent">
            {t('hero.badge')}
          </span>
          <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl">{t('hero.title')}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-light-text-secondary dark:text-dark-text-secondary">
            {t('hero.subtitle')}
          </p>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 80}>
              <div className="rounded-lg border border-light-border bg-light-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-surface dark:hover:border-dark-accent">
                <p className="text-3xl font-extrabold text-light-accent dark:text-dark-accent">{stat.value}</p>
                <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-light-border to-transparent dark:via-dark-border" />
      </section>

      <section className="bg-light-surface py-16 dark:bg-dark-surface">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 sm:grid-cols-2">
            {services.map((service, index) => {
              const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
              const productKey = SERVICE_KEYS[index] || service.name;
              return (
                <ScrollReveal key={service.name} delay={index * 80}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-light-border bg-light-background transition-all duration-200 hover:-translate-y-1 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-background dark:hover:border-dark-accent">
                    <img
                      src={`https://loremflickr.com/480/240/${SERVICE_IMAGE_TOPICS[index % SERVICE_IMAGE_TOPICS.length]}`}
                      alt=""
                      loading="lazy"
                      className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="flex flex-1 flex-col p-6">
                      <Icon
                        aria-hidden="true"
                        className="text-3xl text-light-accent transition-transform duration-200 group-hover:scale-110 dark:text-dark-accent"
                      />
                      <h3 className="mt-3 text-xl font-semibold">{service.name}</h3>
                      <span className="mt-1 inline-block w-fit rounded-full bg-light-accent/10 px-3 py-1 text-sm font-bold text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent">
                        {service.priceRange}
                      </span>
                      <p className="mt-2 flex-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        {service.description}
                      </p>
                      <Link
                        to={`/order?product=${encodeURIComponent(productKey)}`}
                        className="mt-4 inline-block rounded-md bg-light-accent px-5 py-2.5 text-center font-semibold text-white transition-colors hover:opacity-90 dark:bg-dark-accent"
                      >
                        {t('services.cta')}
                      </Link>
                    </div>
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
