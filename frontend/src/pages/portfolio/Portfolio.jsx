import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Pagination from '../../components/common/Pagination.jsx';
import {
  FaLaptopCode, FaShoppingCart, FaMobileAlt, FaRocket, FaServer, FaSyncAlt, FaPlug, FaShieldAlt,
  FaTachometerAlt, FaCode, FaWindowMaximize, FaGlobe,
  FaPalette, FaDesktop, FaPen, FaBookOpen, FaFileAlt, FaImage, FaBox, FaMousePointer, FaRedo, FaNewspaper,
  FaBullhorn, FaHashtag, FaChartLine, FaUsers, FaSearch, FaEnvelope, FaChartBar, FaVideo, FaCamera, FaGlobeAmericas,
  FaRobot, FaCogs, FaBrain, FaComments, FaMicrophone, FaNetworkWired, FaStar, FaEye, FaClipboardList, FaCloud,
  FaUserTie, FaCheckCircle, FaHeadset, FaCubes, FaCloudUploadAlt, FaSeedling,
  FaTh, FaList, FaSort, FaTimes, FaChevronDown, FaChevronUp,
} from 'react-icons/fa';
import ScrollReveal from '../../components/common/ScrollReveal.jsx';
import CountUp from '../../components/common/CountUp.jsx';
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

const SERVICE_KEYS = [
  'Desarrollo web', 'Tienda online', 'Aplicación móvil', 'Landing page',
  'Mantenimiento web', 'Migración de sitio web', 'Integración de APIs', 'Auditoría de seguridad web',
  'Optimización de rendimiento web', 'Desarrollo de plugins', 'Progressive Web App', 'Portal web corporativo',
  'Diseño gráfico', 'Diseño UI/UX', 'Diseño de logotipo', 'Manual de marca',
  'Diseño de presentaciones', 'Ilustración digital', 'Diseño de empaques', 'Prototipado interactivo',
  'Rebranding', 'Diseño editorial',
  'Marketing digital', 'Gestión de redes sociales', 'Publicidad en Google Ads', 'Publicidad en redes sociales',
  'SEO y posicionamiento web', 'Email marketing', 'Marketing de contenidos', 'Producción de video',
  'Fotografía de producto', 'Estrategia de marca digital',
  'Chatbots con IA', 'Automatización de procesos', 'Análisis de datos con IA', 'Integración de modelos de lenguaje',
  'Generación de contenido con IA', 'Automatización de marketing con IA', 'Sistemas de recomendación',
  'Reconocimiento de imágenes', 'Automatización de reportes', 'Asistente de voz personalizado',
  'Consultoría estratégica', 'Consultoría tecnológica', 'Auditoría digital', 'Soporte técnico',
  'Capacitación de equipos', 'Experiencias 3D interactivas', 'Migración a la nube', 'Plan de crecimiento digital',
];

const SERVICE_ICONS = [
  FaLaptopCode, FaShoppingCart, FaMobileAlt, FaRocket, FaSyncAlt, FaServer, FaPlug, FaShieldAlt,
  FaTachometerAlt, FaCode, FaWindowMaximize, FaGlobe,
  FaPalette, FaDesktop, FaPen, FaBookOpen, FaFileAlt, FaImage, FaBox, FaMousePointer, FaRedo, FaNewspaper,
  FaBullhorn, FaHashtag, FaChartLine, FaUsers, FaSearch, FaEnvelope, FaChartBar, FaVideo, FaCamera, FaGlobeAmericas,
  FaRobot, FaCogs, FaBrain, FaComments, FaMicrophone, FaNetworkWired, FaStar, FaEye, FaClipboardList, FaCloud,
  FaUserTie, FaDesktop, FaCheckCircle, FaHeadset, FaUsers, FaCubes, FaCloudUploadAlt, FaSeedling,
];

// 5 — Services marked as popular
const POPULAR = new Set([
  'Desarrollo web', 'Tienda online', 'Chatbots con IA',
  'SEO y posicionamiento web', 'Diseño de logotipo', 'Landing page',
]);

const PAGE_SIZE  = 10;
const CATEGORY_IDS = ['all', 'web', 'design', 'marketing', 'ai', 'consulting'];
const SORT_KEYS    = ['default', 'priceAsc', 'priceDesc', 'nameAz'];

function parseMinPrice(priceRange) {
  const m = String(priceRange).replace(/,/g, '').match(/\$(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

// ── Gradient card header (replaces loremflickr) ──────────────────────────────
function ServiceCardImage({ Icon, index }) {
  return (
    <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-light-accent/10 via-light-surface to-light-accent/5 dark:from-dark-accent/10 dark:via-dark-surface dark:to-dark-accent/5">
      <svg aria-hidden="true" viewBox="0 0 480 160" className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <circle cx={80 + (index % 3) * 100} cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx={320 - (index % 2) * 60} cy="80" r="50" fill="none" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="80" x2="480" y2="80" stroke="currentColor" strokeWidth="0.6" strokeDasharray="10 5" />
        <line x1="240" y1="0" x2="240" y2="160" stroke="currentColor" strokeWidth="0.6" strokeDasharray="10 5" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon aria-hidden="true" className="text-5xl text-light-accent/70 transition-transform duration-300 group-hover:scale-110 dark:text-dark-accent/70" />
      </div>
    </div>
  );
}

// ── FAQ accordion item ───────────────────────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-light-border last:border-0 dark:border-dark-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left font-semibold text-light-text-primary transition-colors hover:text-light-accent dark:text-dark-text-primary dark:hover:text-dark-accent"
        aria-expanded={open}
      >
        <span>{q}</span>
        {open ? <FaChevronUp aria-hidden="true" className="shrink-0 text-sm" /> : <FaChevronDown aria-hidden="true" className="shrink-0 text-sm" />}
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">{a}</p>
      )}
    </div>
  );
}

export default function Portfolio() {
  const { t } = useTranslation('portfolio');
  usePageMeta('portfolio', pageMetadata.path);

  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy]   = useState('default');
  const [view, setView]       = useState('grid');  // 'grid' | 'list'

  const stats      = useMemo(() => t('hero.stats',    { returnObjects: true }) || [], [t]);
  const services   = useMemo(() => t('services.items',{ returnObjects: true }) || [], [t]);
  const categories = useMemo(() => t('categories',    { returnObjects: true }) || {}, [t]);
  const sortOpts   = useMemo(() => t('filters.sortOptions', { returnObjects: true }) || {}, [t]);
  const faqItems   = useMemo(() => t('faq.items',     { returnObjects: true }) || [], [t]);

  // 6 — Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: services.length };
    services.forEach((s) => { counts[s.category] = (counts[s.category] || 0) + 1; });
    return counts;
  }, [services]);

  const indexedServices = useMemo(() => services.map((s, i) => ({ ...s, index: i })), [services]);

  const query = search.trim().toLowerCase();
  const filteredServices = useMemo(() => {
    const base = indexedServices.filter((s) => {
      const matchesCat    = category === 'all' || s.category === category;
      const matchesSearch = !query || s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
    if (sortBy === 'priceAsc')  return [...base].sort((a, b) => parseMinPrice(a.priceRange) - parseMinPrice(b.priceRange));
    if (sortBy === 'priceDesc') return [...base].sort((a, b) => parseMinPrice(b.priceRange) - parseMinPrice(a.priceRange));
    if (sortBy === 'nameAz')    return [...base].sort((a, b) => a.name.localeCompare(b.name));
    return base;
  }, [indexedServices, category, query, sortBy]);

  const totalPages   = Math.max(1, Math.ceil(filteredServices.length / PAGE_SIZE));
  const currentPage  = Math.min(page, totalPages);
  const pageServices = filteredServices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = (p) => {
    setPage(p);
    document.getElementById('services-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleCat    = (c)  => { setCategory(c); setPage(1); };
  const handleSort   = (e)  => { setSortBy(e.target.value); setPage(1); };
  const clearSearch  = ()   => { setSearch(''); setPage(1); };

  return (
    <div className="bg-light-background text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">

      {/* ── Hero ── */}
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
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 80}>
                <div className="rounded-lg border border-light-border bg-light-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-surface dark:hover:border-dark-accent">
                  <CountUp value={stat.value} className="block text-3xl font-extrabold text-light-accent dark:text-dark-accent" />
                  <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-light-border to-transparent dark:via-dark-border" />
      </section>

      {/* ── Services grid ── */}
      <section id="services-grid" className="bg-light-surface py-16 dark:bg-dark-surface">
        <div className="mx-auto max-w-6xl px-4">

          {/* 7 — Sticky filter bar */}
          <div className="sticky top-0 z-20 -mx-4 bg-light-surface/95 px-4 pb-4 pt-3 backdrop-blur-md dark:bg-dark-surface/95">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative mx-auto max-w-xl">
                <FaSearch aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary" />
                <label htmlFor="service-search" className="sr-only">{t('filters.searchLabel')}</label>
                <input
                  id="service-search"
                  type="search"
                  value={search}
                  onChange={handleSearch}
                  placeholder={t('filters.searchPlaceholder')}
                  className="w-full rounded-full border border-light-border bg-light-background py-2.5 pl-11 pr-10 text-sm text-light-text-primary placeholder:text-light-text-secondary focus:border-light-accent focus:outline-none dark:border-dark-border dark:bg-dark-background dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary dark:focus:border-dark-accent"
                />
                {search && (
                  <button type="button" onClick={clearSearch} aria-label={t('filters.clearSearch')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-secondary hover:text-light-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary">
                    <FaTimes aria-hidden="true" className="text-sm" />
                  </button>
                )}
              </div>

              {/* Category filters + sort + view toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* 6 — Category buttons with count */}
                <div className="flex flex-wrap items-center gap-2">
                  {CATEGORY_IDS.map((id) => (
                    <button key={id} type="button" onClick={() => handleCat(id)}
                      aria-pressed={category === id}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                        category === id
                          ? 'border-light-accent bg-light-accent text-white dark:border-dark-accent dark:bg-dark-accent'
                          : 'border-light-border text-light-text-secondary hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:text-dark-text-secondary dark:hover:border-dark-accent dark:hover:text-dark-accent'
                      }`}
                    >
                      {categories[id]}
                      {categoryCounts[id] !== undefined && (
                        <span className="ml-1 opacity-70">({categoryCounts[id]})</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {/* 4 — Sort dropdown */}
                  <div className="relative flex items-center gap-1.5">
                    <FaSort aria-hidden="true" className="shrink-0 text-xs text-light-text-secondary dark:text-dark-text-secondary" />
                    <select value={sortBy} onChange={handleSort} aria-label={t('filters.sort')}
                      className="rounded-lg border border-light-border bg-light-background py-1.5 pl-2 pr-7 text-xs text-light-text-primary focus:border-light-accent focus:outline-none dark:border-dark-border dark:bg-dark-background dark:text-dark-text-primary dark:focus:border-dark-accent">
                      {SORT_KEYS.map((k) => (
                        <option key={k} value={k}>{sortOpts[k] || k}</option>
                      ))}
                    </select>
                  </div>

                  {/* 2 — View toggle */}
                  <div className="flex overflow-hidden rounded-lg border border-light-border dark:border-dark-border">
                    <button type="button" onClick={() => setView('grid')}
                      aria-label={t('filters.viewGrid')} aria-pressed={view === 'grid'}
                      className={`px-2.5 py-1.5 text-sm transition-colors ${view === 'grid' ? 'bg-light-accent text-white dark:bg-dark-accent' : 'text-light-text-secondary hover:text-light-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary'}`}>
                      <FaTh aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => setView('list')}
                      aria-label={t('filters.viewList')} aria-pressed={view === 'list'}
                      className={`border-l border-light-border px-2.5 py-1.5 text-sm transition-colors dark:border-dark-border ${view === 'list' ? 'bg-light-accent text-white dark:bg-dark-accent' : 'text-light-text-secondary hover:text-light-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary'}`}>
                      <FaList aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 — Result counter */}
              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                {t('filters.resultCount', { shown: pageServices.length, total: filteredServices.length })}
              </p>
            </div>
          </div>

          {/* 8 — Empty state */}
          {filteredServices.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-light-border dark:bg-dark-border">
                <FaSearch aria-hidden="true" className="text-2xl text-light-text-secondary dark:text-dark-text-secondary" />
              </div>
              <h3 className="text-lg font-bold">{t('filters.noResultsTitle')}</h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('filters.noResultsText')}</p>
              <button type="button" onClick={clearSearch}
                className="rounded-lg border border-light-accent px-4 py-2 text-sm font-semibold text-light-accent hover:bg-light-accent/10 dark:border-dark-accent dark:text-dark-accent dark:hover:bg-dark-accent/10">
                {t('filters.clearSearch')}
              </button>
            </div>
          ) : view === 'grid' ? (
            /* ── Grid view ── */
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              {pageServices.map((service, localIdx) => {
                const { index } = service;
                const Icon       = SERVICE_ICONS[index % SERVICE_ICONS.length];
                const productKey = SERVICE_KEYS[index] || service.name;
                const isPopular  = POPULAR.has(SERVICE_KEYS[index]);
                return (
                  <ScrollReveal key={service.name} delay={localIdx * 60}>
                    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-light-border bg-light-background transition-all duration-200 hover:-translate-y-1 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-background dark:hover:border-dark-accent">
                      {/* 5 — Popular badge */}
                      {isPopular && (
                        <span className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-light-accent px-2.5 py-0.5 text-xs font-bold text-white shadow dark:bg-dark-accent">
                          <FaStar aria-hidden="true" className="text-[10px]" />
                          {t('services.popular')}
                        </span>
                      )}
                      {/* 1 — SVG gradient panel instead of loremflickr */}
                      <ServiceCardImage Icon={Icon} index={index} />
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="text-lg font-semibold">{service.name}</h3>
                        <span className="mt-1 inline-block w-fit rounded-full bg-light-accent/10 px-3 py-0.5 text-sm font-bold text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent">
                          {service.priceRange}
                        </span>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">
                          {service.description}
                        </p>
                        {/* 9 — Two CTAs */}
                        <div className="mt-4 flex gap-2">
                          <Link to={`/order?product=${encodeURIComponent(productKey)}`}
                            className="flex-1 rounded-md bg-light-accent px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:opacity-90 dark:bg-dark-accent">
                            {t('services.cta')}
                          </Link>
                          <Link to={`/contact?service=${service.category}`}
                            className="rounded-md border border-light-border px-4 py-2 text-center text-sm font-semibold text-light-text-primary transition-colors hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:text-dark-text-primary dark:hover:border-dark-accent dark:hover:text-dark-accent">
                            {t('services.consultCta')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            /* ── List view ── */
            <div className="mt-4 flex flex-col gap-3">
              {pageServices.map((service, localIdx) => {
                const { index } = service;
                const Icon       = SERVICE_ICONS[index % SERVICE_ICONS.length];
                const productKey = SERVICE_KEYS[index] || service.name;
                const isPopular  = POPULAR.has(SERVICE_KEYS[index]);
                return (
                  <ScrollReveal key={service.name} delay={localIdx * 40}>
                    <div className="group flex items-center gap-4 rounded-xl border border-light-border bg-light-background p-4 transition-all duration-200 hover:border-light-accent hover:shadow-md dark:border-dark-border dark:bg-dark-background dark:hover:border-dark-accent">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-light-accent/10 dark:bg-dark-accent/10">
                        <Icon aria-hidden="true" className="text-lg text-light-accent dark:text-dark-accent" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{service.name}</h3>
                          {/* 5 — Popular badge in list */}
                          {isPopular && (
                            <span className="flex items-center gap-1 rounded-full bg-light-accent/10 px-2 py-0.5 text-xs font-bold text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent">
                              <FaStar aria-hidden="true" className="text-[9px]" />
                              {t('services.popular')}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          {service.description}
                        </p>
                      </div>
                      <span className="shrink-0 whitespace-nowrap rounded-full bg-light-accent/10 px-3 py-1 text-xs font-bold text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent">
                        {service.priceRange}
                      </span>
                      {/* 9 — Two CTAs in list */}
                      <div className="hidden shrink-0 gap-2 sm:flex">
                        <Link to={`/order?product=${encodeURIComponent(productKey)}`}
                          className="rounded-md bg-light-accent px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:opacity-90 dark:bg-dark-accent">
                          {t('services.cta')}
                        </Link>
                        <Link to={`/contact?service=${service.category}`}
                          className="rounded-md border border-light-border px-4 py-1.5 text-sm font-semibold text-light-text-primary transition-colors hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:text-dark-text-primary dark:hover:border-dark-accent dark:hover:text-dark-accent">
                          {t('services.consultCta')}
                        </Link>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={handlePageChange}
            previousLabel={t('pagination.previous')}
            nextLabel={t('pagination.next')}
          />

          {/* Budget CTA */}
          <div className="mt-10 rounded-xl border border-light-accent/30 bg-light-accent/5 p-6 text-center dark:border-dark-accent/30 dark:bg-dark-accent/5">
            <p className="font-semibold text-light-text-primary dark:text-dark-text-primary">{t('budgetCta')}</p>
            <Link to="/budget"
              className="mt-3 inline-block rounded-lg bg-light-accent px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 dark:bg-dark-accent">
              {t('budgetCtaButton')}
            </Link>
          </div>
        </div>
      </section>

      {/* 10 — FAQ section */}
      {faqItems.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4">
            <ScrollReveal>
              <h2 className="text-center text-3xl font-black tracking-tight">{t('faq.title')}</h2>
            </ScrollReveal>
            <div className="mt-10 rounded-xl border border-light-border bg-light-surface px-6 dark:border-dark-border dark:bg-dark-surface">
              {faqItems.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link to="/faq"
                className="text-sm font-semibold text-light-accent transition-colors hover:underline dark:text-dark-accent">
                {t('faq.viewAll')}
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
