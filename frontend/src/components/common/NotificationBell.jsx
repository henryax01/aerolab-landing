import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaBell } from 'react-icons/fa';
import useNotifications from '../../hooks/useNotifications.jsx';

export default function NotificationBell({ token, className = '', onNavigate }) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { notifications, unread, markAsRead, markAllAsRead } = useNotifications(token);
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

  if (!token) return null;

  async function handleSelect(notification) {
    if (!notification.read) {
      await markAsRead(notification._id);
    }
    setOpen(false);
    navigate('/account');
    onNavigate?.();
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  const toggleLabel =
    unread > 0 ? t('notifications.toggleLabel', { count: unread }) : t('notifications.toggleLabelEmpty');

  return (
    <div ref={containerRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
      <button
        type="button"
        aria-label={toggleLabel}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-9 w-9 items-center justify-center rounded-md border border-light-border text-light-text-primary transition-colors hover:bg-light-surface-secondary dark:border-dark-border dark:text-dark-text-primary dark:hover:bg-dark-surface-secondary"
      >
        <FaBell aria-hidden="true" />
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-light-error px-1 text-[10px] font-semibold text-white dark:bg-dark-error"
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="region"
          aria-label={t('notifications.title')}
          className="absolute right-0 z-50 mt-2 max-h-96 w-80 overflow-y-auto rounded-md border border-light-border bg-light-surface shadow-lg dark:border-dark-border dark:bg-dark-surface"
        >
          <div className="flex items-center justify-between border-b border-light-border px-4 py-2 dark:border-dark-border">
            <span className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
              {t('notifications.title')}
            </span>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead()}
                className="text-xs font-medium text-light-accent hover:underline dark:text-dark-accent"
              >
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-3 text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {t('notifications.empty')}
            </p>
          ) : (
            <ul className="divide-y divide-light-border dark:divide-dark-border">
              {notifications.map((notification) => (
                <li key={notification._id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(notification)}
                    className={`flex w-full items-start gap-2 px-4 py-3 text-left transition-colors hover:bg-light-surface-secondary dark:hover:bg-dark-surface-secondary ${
                      notification.read ? '' : 'bg-light-accent/5 dark:bg-dark-accent/10'
                    }`}
                  >
                    {!notification.read && (
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-light-accent dark:bg-dark-accent"
                      />
                    )}
                    <span className="block text-sm text-light-text-primary dark:text-dark-text-primary">
                      {t('notifications.orderStatusMessage', {
                        product: notification.product,
                        status: t(`status.${notification.status}`, { defaultValue: notification.status }),
                      })}
                    </span>
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
