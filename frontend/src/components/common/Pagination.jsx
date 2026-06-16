const baseClass =
  'min-w-[2.5rem] rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const inactiveClass =
  'border-light-border text-light-text-primary hover:bg-light-surface-secondary dark:border-dark-border dark:text-dark-text-primary dark:hover:bg-dark-surface-secondary';

const activeClass =
  'border-light-accent bg-light-accent text-white dark:border-dark-accent dark:bg-dark-accent';

export default function Pagination({ page, totalPages, onChange, previousLabel, nextLabel }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        className={`${baseClass} ${inactiveClass}`}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        {previousLabel}
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={`${baseClass} ${p === page ? activeClass : inactiveClass}`}
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        className={`${baseClass} ${inactiveClass}`}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        {nextLabel}
      </button>
    </div>
  );
}
