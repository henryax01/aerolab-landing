import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ScrollReveal from '../../components/common/ScrollReveal.jsx';
import usePageMeta from '../../hooks/usePageMeta.jsx';

export const pageMetadata = {
  path: '/faq',
  label: 'FAQ',
  category: 'general',
  minRoleLevel: 0,
  maxRoleLevel: Infinity,
  order: 52,
  locations: [],
  description: 'Preguntas frecuentes',
  icon: 'FaQuestionCircle',
  isSearchable: true,
};

function FaqItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <ScrollReveal delay={index * 40}>
      <div className="border-b border-light-border dark:border-dark-border">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-light-text-primary transition-colors hover:text-light-accent dark:text-dark-text-primary dark:hover:text-dark-accent"
        >
          <span>{item.q}</span>
          <FaChevronDown
            aria-hidden="true"
            className={`shrink-0 text-sm text-light-accent transition-transform duration-200 dark:text-dark-accent ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {open && (
          <p className="pb-5 text-light-text-secondary dark:text-dark-text-secondary">
            {item.a}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}

export default function Faq() {
  const { t } = useTranslation('faq');
  usePageMeta('faq', pageMetadata.path);

  const items = t('items', { returnObjects: true }) || [];

  return (
    <div className="bg-light-background text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">
      <section className="relative overflow-hidden bg-gradient-to-b from-light-surface to-light-background py-24 text-center dark:from-dark-surface dark:to-dark-background">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-light-accent/40 to-transparent dark:via-dark-accent/40" />
        <div className="mx-auto max-w-3xl px-4">
          <span className="inline-block rounded-full border border-light-accent/20 bg-light-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-light-accent dark:border-dark-accent/20 dark:bg-dark-accent/10 dark:text-dark-accent">
            {t('hero.badge')}
          </span>
          <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl">{t('hero.title')}</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-light-text-secondary dark:text-dark-text-secondary">
            {t('hero.subtitle')}
          </p>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-light-border to-transparent dark:via-dark-border" />
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          {items.map((item, index) => (
            <FaqItem key={item.q} item={item} index={index} />
          ))}
        </div>
      </section>

      <section className="bg-light-surface py-16 text-center dark:bg-dark-surface">
        <ScrollReveal>
          <p className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
            ¿Todavía tienes dudas?
          </p>
          <Link
            to="/contact"
            className="mt-4 inline-block rounded-lg bg-light-accent px-8 py-3 font-semibold text-white shadow-lg shadow-light-accent/20 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 dark:bg-dark-accent dark:shadow-dark-accent/20"
          >
            Contactar
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
