import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getRoutablePages } from '../pages/pagesConfig.js';

const PAGE_NAMESPACES = {
  '/': 'home',
  '/about': 'about',
  '/portfolio': 'portfolio',
  '/order': 'order',
  '/contact': 'contact',
  '/account': 'account',
};

function normalize(value) {
  return value.trim().toLowerCase();
}

export default function useGlobalSearch(roleLevel = 0) {
  const { t } = useTranslation(['common', 'home', 'about', 'portfolio', 'order', 'contact', 'account']);
  const [query, setQuery] = useState('');

  const index = useMemo(() => {
    const entries = [];

    for (const page of getRoutablePages(roleLevel)) {
      if (!page.isSearchable) continue;
      const ns = PAGE_NAMESPACES[page.path];
      if (!ns) continue;
      entries.push({
        type: 'page',
        key: `page-${page.path}`,
        path: page.path,
        label: t(`${ns}:meta.label`, { defaultValue: page.label }),
        description: t(`${ns}:meta.description`, { defaultValue: '' }),
      });
    }

    const services = t('portfolio:services.items', { returnObjects: true });
    if (Array.isArray(services)) {
      services.forEach((service, position) => {
        entries.push({
          type: 'service',
          key: `service-${position}`,
          path: `/order?product=${encodeURIComponent(service.name)}`,
          label: service.name,
          description: service.description,
        });
      });
    }

    return entries;
  }, [roleLevel, t]);

  const results = useMemo(() => {
    const term = normalize(query);
    if (!term) return [];
    return index.filter(
      (entry) => normalize(entry.label).includes(term) || normalize(entry.description || '').includes(term),
    );
  }, [index, query]);

  return { query, setQuery, results };
}
