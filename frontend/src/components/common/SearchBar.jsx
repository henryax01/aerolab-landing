import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaTimes } from 'react-icons/fa';
import useGlobalSearch from '../../hooks/useGlobalSearch.jsx';

export default function SearchBar({ roleLevel, className = '', onNavigate }) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { query, setQuery, results } = useGlobalSearch(roleLevel);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(path) {
    navigate(path);
    setQuery('');
    setOpen(false);
    onNavigate?.();
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      setOpen(false);
      event.currentTarget.blur();
    }
  }

  const showResults = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex items-center gap-2 rounded-md border border-light-border bg-light-background px-3 py-1.5 dark:border-dark-border dark:bg-dark-background">
        <FaSearch aria-hidden="true" className="shrink-0 text-light-text-secondary dark:text-dark-text-secondary" />
        <input
          type="search"
          aria-label={t('search.label')}
          placeholder={t('search.placeholder')}
          className="w-full bg-transparent text-sm text-light-text-primary placeholder:text-light-text-secondary focus:outline-none dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            type="button"
            aria-label={t('search.clear')}
            onClick={() => setQuery('')}
            className="shrink-0 text-light-text-secondary hover:text-light-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary"
          >
            <FaTimes aria-hidden="true" />
          </button>
        )}
      </div>

      {showResults && (
        <div
          role="region"
          aria-live="polite"
          aria-label={t('search.resultsLabel')}
          className="absolute left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-md border border-light-border bg-light-surface shadow-lg dark:border-dark-border dark:bg-dark-surface"
        >
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {t('search.noResults', { query: query.trim() })}
            </p>
          ) : (
            <ul className="divide-y divide-light-border dark:divide-dark-border">
              {results.map((result) => (
                <li key={result.key}>
                  <button
                    type="button"
                    onClick={() => handleSelect(result.path)}
                    className="block w-full px-4 py-3 text-left transition-colors hover:bg-light-surface-secondary dark:hover:bg-dark-surface-secondary"
                  >
                    <span className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      {result.label}
                    </span>
                    {result.description && (
                      <span className="mt-0.5 block truncate text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        {result.description}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
