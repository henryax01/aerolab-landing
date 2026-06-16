import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import usePageMeta from '../../hooks/usePageMeta.jsx';

export const pageMetadata = {
  path: '*',
  label: 'Página no encontrada',
  category: 'general',
  minRoleLevel: 0,
  maxRoleLevel: Infinity,
  order: 99,
  locations: [],
  description: 'Página no encontrada',
  icon: 'FaQuestionCircle',
  isSearchable: false,
};

export default function NotFound() {
  const { t } = useTranslation('notfound');
  usePageMeta('notfound', '/404');

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-light-background px-4 text-center text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">
      <div>
        <p className="text-7xl font-black text-light-accent dark:text-dark-accent">{t('code')}</p>
        <h1 className="mt-4 text-3xl font-black tracking-tight">{t('title')}</h1>
        <p className="mx-auto mt-3 max-w-md text-light-text-secondary dark:text-dark-text-secondary">
          {t('text')}
        </p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-lg bg-light-accent px-8 py-3 font-semibold text-white shadow-lg shadow-light-accent/20 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl dark:bg-dark-accent dark:shadow-dark-accent/20"
        >
          {t('cta')}
        </Link>
      </div>
    </div>
  );
}
