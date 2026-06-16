import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SITE_NAME = 'Aerolab';
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://tudominio.com').replace(/\/$/, '');

function setMetaTag(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonicalLink(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/** Sincroniza <title>, meta description, Open Graph y Twitter Card con la página actual. */
export default function usePageMeta(ns, path) {
  const { t, i18n } = useTranslation('common');
  const { t: tPage } = useTranslation(ns);

  useEffect(() => {
    const label = tPage('meta.label', { defaultValue: '' });
    const description = tPage('meta.description', { defaultValue: '' });
    const keywords = tPage('meta.keywords', { defaultValue: '' });
    const brand = t('brand');
    const title = label ? `${label} · ${brand}` : brand;
    const url = `${SITE_URL}${path === '/' ? '' : path}`;

    document.title = title;
    document.documentElement.lang = i18n.language;

    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', brand);
    setMetaTag('property', 'og:locale', i18n.language === 'en' ? 'en_US' : 'es_ES');
    setMetaTag('name', 'twitter:card', 'summary');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setCanonicalLink(url);
  }, [path, t, tPage, i18n.language]);
}
