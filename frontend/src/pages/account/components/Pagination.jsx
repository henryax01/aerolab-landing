import { useTranslation } from 'react-i18next';

const buttonClass =
  'rounded-md border border-light-border px-3 py-1.5 text-sm font-semibold text-light-text-primary transition-colors hover:bg-light-surface-secondary disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-border dark:text-dark-text-primary dark:hover:bg-dark-surface-secondary';

export default function Pagination({ page, totalPages, onChange }) {
  const { t } = useTranslation('account');

  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-center gap-3 text-sm">
      <button type="button" className={buttonClass} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        {t('pagination.previous')}
      </button>
      <span className="text-light-text-secondary dark:text-dark-text-secondary">
        {t('pagination.pageOf', { page, totalPages })}
      </span>
      <button type="button" className={buttonClass} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        {t('pagination.next')}
      </button>
    </div>
  );
}
