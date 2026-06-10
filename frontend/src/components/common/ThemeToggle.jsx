import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function ThemeToggle({ theme, onToggle }) {
  const { t } = useTranslation('common');

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={t('theme.toggle')}
      title={theme === 'dark' ? t('theme.light') : t('theme.dark')}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-light-border bg-light-surface text-light-text-primary transition-colors hover:bg-light-surface-secondary dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:hover:bg-dark-surface-secondary"
    >
      {theme === 'dark' ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
    </button>
  );
}
