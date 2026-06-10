import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaRobot, FaRedo } from 'react-icons/fa';

export default function GuideBot() {
  const { t } = useTranslation('experience');
  const nodes = useMemo(() => t('bot.nodes', { returnObjects: true }) || {}, [t]);
  const [history, setHistory] = useState(['intro']);

  const currentId = history[history.length - 1];
  const current = nodes[currentId];

  const handleOption = (option) => {
    setHistory((prev) => [...prev, option.next]);
  };

  const handleRestart = () => setHistory(['intro']);

  if (!current) return null;

  return (
    <div className="flex h-full flex-col rounded-xl border border-light-border bg-light-surface p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-light-accent/10 dark:border-dark-border dark:bg-dark-surface dark:hover:shadow-dark-accent/10">
      <div className="flex items-center gap-3 border-b border-light-border pb-4 dark:border-dark-border">
        <div
          aria-hidden="true"
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-light-accent text-white dark:bg-dark-accent"
        >
          <FaRobot />
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-light-surface bg-light-success dark:border-dark-surface dark:bg-dark-success"
          />
        </div>
        <div>
          <p className="font-semibold text-light-text-primary dark:text-dark-text-primary">{t('bot.name')}</p>
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{t('bot.greeting')}</p>
        </div>
      </div>

      <div role="log" aria-live="polite" className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
        {history.map((nodeId, index) => {
          const node = nodes[nodeId];
          if (!node) return null;
          return (
            <p
              key={`${nodeId}-${index}`}
              className="max-w-[90%] rounded-lg rounded-tl-none border border-light-border bg-light-surface-secondary px-4 py-3 text-sm leading-relaxed text-light-text-primary dark:border-dark-border dark:bg-dark-surface-secondary dark:text-dark-text-primary"
            >
              {node.text}
            </p>
          );
        })}
      </div>

      <div className="mt-4 space-y-2">
        {(current.options || []).map((option) =>
          option.link ? (
            <Link
              key={option.label}
              to={option.link}
              className="block rounded-md border border-light-accent px-4 py-2 text-center text-sm font-medium text-light-accent transition-all duration-200 hover:-translate-y-0.5 hover:bg-light-accent hover:text-white hover:shadow-md dark:border-dark-accent dark:text-dark-accent dark:hover:bg-dark-accent dark:hover:text-white"
            >
              {option.label}
            </Link>
          ) : (
            <button
              key={option.label}
              type="button"
              onClick={() => handleOption(option)}
              className="block w-full rounded-md border border-light-border px-4 py-2 text-left text-sm font-medium text-light-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-light-accent hover:bg-light-surface-secondary hover:shadow-sm dark:border-dark-border dark:text-dark-text-primary dark:hover:border-dark-accent dark:hover:bg-dark-surface-secondary"
            >
              {option.label}
            </button>
          ),
        )}

        {history.length > 1 && (
          <button
            type="button"
            onClick={handleRestart}
            className="flex items-center gap-2 pt-1 text-xs font-medium text-light-text-secondary transition-colors hover:text-light-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary"
          >
            <FaRedo aria-hidden="true" /> {t('bot.restart')}
          </button>
        )}
      </div>
    </div>
  );
}
