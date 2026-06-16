import { useTranslation } from 'react-i18next';
import ScrollReveal from '../../components/common/ScrollReveal.jsx';
import usePageMeta from '../../hooks/usePageMeta.jsx';

export const pageMetadata = {
  path: '/privacy',
  label: 'Política de Privacidad',
  category: 'general',
  minRoleLevel: 0,
  maxRoleLevel: Infinity,
  order: 51,
  locations: [],
  description: 'Política de privacidad',
  icon: 'FaUserShield',
  isSearchable: true,
};

export default function Privacy() {
  const { t } = useTranslation('privacy');
  usePageMeta('privacy', pageMetadata.path);

  const sections = t('sections', { returnObjects: true }) || [];

  return (
    <div className="bg-light-background text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">
      <section className="relative overflow-hidden bg-gradient-to-b from-light-surface to-light-background py-20 text-center dark:from-dark-surface dark:to-dark-background">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-light-accent/40 to-transparent dark:via-dark-accent/40" />
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{t('title')}</h1>
          <p className="mt-3 text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('updated')}</p>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-light-border to-transparent dark:via-dark-border" />
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-4">
          <p className="text-light-text-secondary dark:text-dark-text-secondary">{t('intro')}</p>
          {sections.map((section, index) => (
            <ScrollReveal key={section.heading} delay={index * 40}>
              <div>
                <h2 className="text-xl font-bold">{section.heading}</h2>
                <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">{section.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
