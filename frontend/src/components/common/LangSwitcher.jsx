import { useTranslation } from 'react-i18next';

const LANGUAGES = ['es', 'en'];

export default function LangSwitcher() {
  const { i18n, t } = useTranslation('common');

  const nextLang = LANGUAGES.find((lang) => lang !== i18n.language) || LANGUAGES[0];

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(nextLang)}
      aria-label={t('lang.toggle')}
      title={t('lang.toggle')}
      className="flex h-9 min-w-9 items-center justify-center rounded-full border border-light-border bg-light-surface px-3 text-sm font-semibold uppercase text-light-text-primary transition-colors hover:bg-light-surface-secondary dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:hover:bg-dark-surface-secondary"
    >
      {i18n.language}
    </button>
  );
}
