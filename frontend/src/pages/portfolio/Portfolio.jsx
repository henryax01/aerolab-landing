import { useState } from 'react';
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
  // web (0-11)
  'Desarrollo web', 'Tienda online', 'Aplicación móvil', 'Landing page',
  'Mantenimiento web', 'Migración de sitio web', 'Integración de APIs', 'Auditoría de seguridad web',
  'Optimización de rendimiento web', 'Desarrollo de plugins', 'Progressive Web App', 'Portal web corporativo',
  // design (12-21)
  'Diseño gráfico', 'Diseño UI/UX', 'Diseño de logotipo', 'Manual de marca',
  'Diseño de presentaciones', 'Ilustración digital', 'Diseño de empaques', 'Prototipado interactivo',
  'Rebranding', 'Diseño editorial',
  // marketing (22-31)
  'Marketing digital', 'Gestión de redes sociales', 'Publicidad en Google Ads', 'Publicidad en redes sociales',
  'SEO y posicionamiento web', 'Email marketing', 'Marketing de contenidos', 'Producción de video',
  'Fotografía de producto', 'Estrategia de marca digital',
  // ai (32-41)
  'Chatbots con IA', 'Automatización de procesos', 'Análisis de datos con IA', 'Integración de modelos de lenguaje',
  'Generación de contenido con IA', 'Automatización de marketing con IA', 'Sistemas de recomendación',
  'Reconocimiento de imágenes', 'Automatización de reportes', 'Asistente de voz personalizado',
  // consulting (42-49)
  'Consultoría estratégica', 'Consultoría tecnológica', 'Auditoría digital', 'Soporte técnico',
  'Capacitación de equipos', 'Experiencias 3D interactivas', 'Migración a la nube', 'Plan de crecimiento digital',
];

const SERVICE_ICONS = [
  // web
  FaLaptopCode, FaShoppingCart, FaMobileAlt, FaRocket, FaSyncAlt, FaServer, FaPlug, FaShieldAlt,
  FaTachometerAlt, FaCode, FaWindowMaximize, FaGlobe,
  // design
  FaPalette, FaDesktop, FaPen, FaBookOpen, FaFileAlt, FaImage, FaBox, FaMousePointer, FaRedo, FaNewspaper,
  // marketing
  FaBullhorn, FaHashtag, FaChartLine, FaUsers, FaSearch, FaEnvelope, FaChartBar, FaVideo, FaCamera, FaGlobeAmericas,
  // ai
  FaRobot, FaCogs, FaBrain, FaComments, FaMicrophone, FaNetworkWired, FaStar, FaEye, FaClipboardList, FaCloud,
  // consulting
  FaUserTie, FaDesktop, FaCheckCircle, FaHeadset, FaUsers, FaCubes, FaCloudUploadAlt, FaSeedling,
];

const SERVICE_IMAGE_TOPICS = [
  // web
  'coding,programming', 'ecommerce,shopping', 'smartphone,mobile', 'website,laptop',
  'server,maintenance', 'migration,data', 'api,network', 'security,shield',
  'speed,performance', 'plugin,software', 'progressive,web', 'corporate,office',
  // design
  'design,creative', 'ui,interface', 'logo,brand', 'brand,guidelines',
  'presentation,slides', 'illustration,art', 'packaging,box', 'prototype,wireframe',
  'rebrand,identity', 'editorial,print',
  // marketing
  'marketing,digital', 'social,media', 'google,advertising', 'advertising,social',
  'seo,search', 'email,campaign', 'content,blog', 'video,production',
  'photography,product', 'brand,strategy',
  // ai
  'chatbot,ai', 'automation,robot', 'data,analytics', 'language,model',
  'content,ai', 'marketing,automation', 'recommendation,algorithm', 'image,recognition',
  'report,data', 'voice,assistant',
  // consulting
  'consulting,strategy', 'technology,consulting', 'audit,digital', 'support,helpdesk',
  'training,team', '3d,interactive', 'cloud,server', 'growth,digital',
];

const PAGE_SIZE = 10;
const CATEGORY_IDS = ['all', 'web', 'design', 'marketing', 'ai', 'consulting'];

const filterButtonClass =
  'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors';
const filterButtonActive =
  'border-light-accent bg-light-accent text-white dark:border-dark-accent dark:bg-dark-accent';
const filterButtonInactive =
  'border-light-border text-light-text-secondary hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:text-dark-text-secondary dark:hover:border-dark-accent dark:hover:text-dark-accent';

export default function Portfolio() {
  const { t } = useTranslation('portfolio');
  usePageMeta('portfolio', pageMetadata.path);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const stats = t('hero.stats', { returnObjects: true }) || [];
  const services = t('services.items', { returnObjects: true }) || [];
  const categories = t('categories', { returnObjects: true }) || {};

  const indexedServices = services.map((service, index) => ({ ...service, index }));
  const query = search.trim().toLowerCase();
  const filteredServices = indexedServices.filter((service) => {
    const matchesCategory = category === 'all' || service.category === category;
    const matchesSearch =
      !query ||
      service.name.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageServices = filteredServices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    document.getElementById('services-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    setCategory(categoryId);
    setPage(1);
  };

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
                <CountUp value={stat.value} className="block text-3xl font-extrabold text-light-accent dark:text-dark-accent" />
                <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-light-border to-transparent dark:via-dark-border" />
      </section>

      <section id="services-grid" className="bg-light-surface py-16 dark:bg-dark-surface">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 space-y-5">
            <div className="relative mx-auto max-w-xl">
              <FaSearch
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary"
              />
              <label htmlFor="service-search" className="sr-only">{t('filters.searchLabel')}</label>
              <input
                id="service-search"
                type="search"
                value={search}
                onChange={handleSearchChange}
                placeholder={t('filters.searchPlaceholder')}
                className="w-full rounded-full border border-light-border bg-light-background py-2.5 pl-11 pr-4 text-sm text-light-text-primary placeholder:text-light-text-secondary focus:border-light-accent focus:outline-none dark:border-dark-border dark:bg-dark-background dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary dark:focus:border-dark-accent"
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {CATEGORY_IDS.map((categoryId) => (
                <button
                  key={categoryId}
                  type="button"
                  onClick={() => handleCategoryChange(categoryId)}
                  className={`${filterButtonClass} ${category === categoryId ? filterButtonActive : filterButtonInactive}`}
                  aria-pressed={category === categoryId}
                >
                  {categories[categoryId]}
                </button>
              ))}
            </div>
          </div>
          {pageServices.length === 0 ? (
            <p className="py-12 text-center text-light-text-secondary dark:text-dark-text-secondary">
              {t('filters.noResults')}
            </p>
          ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {pageServices.map((service, localIndex) => {
              const { index } = service;
              const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
              const productKey = SERVICE_KEYS[index] || service.name;
              return (
                <ScrollReveal key={service.name} delay={localIndex * 80}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-light-border bg-light-background transition-all duration-200 hover:-translate-y-1 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-background dark:hover:border-dark-accent">
                    <img
                      src={`https://loremflickr.com/480/240/${SERVICE_IMAGE_TOPICS[index % SERVICE_IMAGE_TOPICS.length]}/all?lock=${index}`}
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
          )}
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={handlePageChange}
            previousLabel={t('pagination.previous')}
            nextLabel={t('pagination.next')}
          />
        </div>
      </section>
    </div>
  );
}
