import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';
import ScrollReveal from '../../components/common/ScrollReveal.jsx';
import usePageMeta from '../../hooks/usePageMeta.jsx';

export const pageMetadata = {
  path: '/budget',
  label: 'Calculadora',
  category: 'general',
  minRoleLevel: 0,
  maxRoleLevel: Infinity,
  order: 56,
  locations: [],
  description: 'Calculadora de presupuesto',
  icon: 'FaCalculator',
  isSearchable: true,
};

const BASE_PRICES = [
  1200, 1800, 2500, 400, 150, 500, 600, 500, 300, 400, 800, 2000,
  300, 800, 200, 500, 200, 300, 400, 500, 1000, 400,
  600, 400, 300, 300, 400, 200, 400, 800, 300, 600,
  800, 700, 900, 1000, 500, 700, 1200, 1000, 600, 1500,
  500, 400, 800, 200, 300, 1500, 800, 500,
];

const CATEGORY_IDS = ['all', 'web', 'design', 'marketing', 'ai', 'consulting'];

export default function Budget() {
  const { t } = useTranslation('budget');
  const { t: tPortfolio } = useTranslation('portfolio');
  usePageMeta('budget', pageMetadata.path);

  const [selected, setSelected] = useState(new Set());
  const [category, setCategory] = useState('all');

  const services = tPortfolio('services.items', { returnObjects: true }) || [];
  const categories = t('categories', { returnObjects: true }) || {};

  const indexedServices = services.map((s, i) => ({ ...s, index: i, price: BASE_PRICES[i] || 0 }));
  const filtered = category === 'all' ? indexedServices : indexedServices.filter((s) => s.category === category);

  const toggle = (index) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const total = useMemo(
    () => [...selected].reduce((sum, i) => sum + (BASE_PRICES[i] || 0), 0),
    [selected]
  );

  const selectedServices = indexedServices.filter((s) => selected.has(s.index));

  const filterBtnBase = 'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors';
  const filterActive = 'border-light-accent bg-light-accent text-white dark:border-dark-accent dark:bg-dark-accent';
  const filterInactive = 'border-light-border text-light-text-secondary hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:text-dark-text-secondary dark:hover:border-dark-accent dark:hover:text-dark-accent';

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
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="mb-5 font-semibold">{t('instruction')}</p>
              <div className="mb-6 flex flex-wrap gap-2">
                {CATEGORY_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setCategory(id)}
                    className={`${filterBtnBase} ${category === id ? filterActive : filterInactive}`}
                  >
                    {categories[id]}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {filtered.map((service) => {
                  const isSelected = selected.has(service.index);
                  return (
                    <ScrollReveal key={service.index}>
                      <button
                        type="button"
                        onClick={() => toggle(service.index)}
                        className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all duration-150 ${
                          isSelected
                            ? 'border-light-accent bg-light-accent/5 dark:border-dark-accent dark:bg-dark-accent/5'
                            : 'border-light-border bg-light-surface hover:border-light-accent dark:border-dark-border dark:bg-dark-surface dark:hover:border-dark-accent'
                        }`}
                      >
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                          isSelected
                            ? 'border-light-accent bg-light-accent text-white dark:border-dark-accent dark:bg-dark-accent'
                            : 'border-light-border dark:border-dark-border'
                        }`}>
                          {isSelected && <FaCheck className="text-[10px]" aria-hidden="true" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium leading-snug">{service.name}</p>
                          <p className="mt-0.5 text-xs text-light-text-secondary dark:text-dark-text-secondary">{service.priceRange}</p>
                        </div>
                        <span className="shrink-0 text-sm font-bold text-light-accent dark:text-dark-accent">
                          ${service.price.toLocaleString()}
                        </span>
                      </button>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-light-border bg-light-surface p-6 dark:border-dark-border dark:bg-dark-surface">
                <h2 className="text-lg font-bold">{t('summary.title')}</h2>
                {selected.size === 0 ? (
                  <p className="mt-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {t('summary.empty')}
                  </p>
                ) : (
                  <>
                    <p className="mt-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      {selected.size === 1 ? t('summary.selected', { count: selected.size }) : t('summary.selected_plural', { count: selected.size })}
                    </p>
                    <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto">
                      {selectedServices.map((s) => (
                        <li key={s.index} className="flex items-center justify-between gap-2 text-sm">
                          <span className="truncate">{s.name}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-medium">${s.price.toLocaleString()}</span>
                            <button
                              type="button"
                              onClick={() => toggle(s.index)}
                              className="text-light-text-secondary hover:text-light-error dark:text-dark-text-secondary dark:hover:text-dark-error"
                              aria-label={`Quitar ${s.name}`}
                            >
                              <FaTimes className="text-xs" aria-hidden="true" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 border-t border-light-border pt-4 dark:border-dark-border">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{t('summary.total')}</span>
                        <span className="text-2xl font-black text-light-accent dark:text-dark-accent">
                          ${total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      {t('summary.disclaimer')}
                    </p>
                    <Link
                      to="/contact"
                      className="mt-4 block rounded-xl bg-light-accent py-3 text-center font-semibold text-white transition-colors hover:opacity-90 dark:bg-dark-accent"
                    >
                      {t('summary.cta')}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSelected(new Set())}
                      className="mt-2 w-full text-center text-xs text-light-text-secondary hover:text-light-error dark:text-dark-text-secondary dark:hover:text-dark-error"
                    >
                      {t('summary.clear')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
