import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaExternalLinkAlt } from 'react-icons/fa';
import Pagination from './Pagination.jsx';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered'];

const STATUS_BADGE_STYLES = {
  pending:   'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  confirmed: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
  shipped:   'bg-purple-500/15 text-purple-700 dark:text-purple-300',
  delivered: 'bg-light-success/15 text-light-success dark:bg-dark-success/15 dark:text-dark-success',
};

const selectClass =
  'rounded-md border border-light-border bg-light-surface px-2 py-1 text-sm text-light-text-primary focus:border-light-accent focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:focus:border-dark-accent';

function StatusStepper({ status }) {
  const current = Math.max(0, STATUSES.indexOf(status));
  return (
    <div className="mt-1.5 flex items-center gap-0.5" aria-hidden="true">
      {STATUSES.map((_, i) => (
        <span key={i} className="flex items-center gap-0.5">
          <span
            className={`inline-block h-2 w-2 rounded-full transition-colors ${
              i <= current
                ? 'bg-light-accent dark:bg-dark-accent'
                : 'bg-light-border dark:bg-dark-border'
            }`}
          />
          {i < STATUSES.length - 1 && (
            <span
              className={`inline-block h-px w-3 ${
                i < current
                  ? 'bg-light-accent dark:bg-dark-accent'
                  : 'bg-light-border dark:bg-dark-border'
              }`}
            />
          )}
        </span>
      ))}
    </div>
  );
}

function SkeletonRow({ cols }) {
  return (
    <tr className="border-b border-light-border dark:border-dark-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3 pr-4">
          <div className="h-4 w-24 animate-pulse rounded bg-light-border dark:bg-dark-border" />
        </td>
      ))}
    </tr>
  );
}

function TrackingCell({ value }) {
  if (!value) return <span className="text-light-text-secondary dark:text-dark-text-secondary">—</span>;

  const isUrl = value.startsWith('http://') || value.startsWith('https://');
  if (isUrl) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-medium text-light-accent underline-offset-2 hover:underline dark:text-dark-accent"
      >
        Ver envío
        <FaExternalLinkAlt aria-hidden="true" className="text-[10px]" />
      </a>
    );
  }
  return (
    <span className="rounded-full bg-light-surface-secondary px-2 py-0.5 font-mono text-xs dark:bg-dark-surface-secondary">
      {value}
    </span>
  );
}

export default function MyOrders({ orders, loading, loadOrders, page, totalPages, status, filterByStatus, goToPage }) {
  const { t } = useTranslation('account');
  const { t: tCommon } = useTranslation('common');

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const hasTracking = orders.some((o) => o.trackingNumber);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold">{t('orders.title')}</h2>
        <label className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {t('orders.filterByStatus')}
          <select className={selectClass} value={status} onChange={(e) => filterByStatus(e.target.value)}>
            <option value="">{t('orders.allStatuses')}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {tCommon(`status.${s}`, { defaultValue: s })}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <tbody>
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonRow key={i} cols={4} />
              ))}
            </tbody>
          </table>
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-4 py-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-light-surface-secondary dark:bg-dark-surface-secondary">
            <FaBoxOpen aria-hidden="true" className="text-3xl text-light-text-secondary dark:text-dark-text-secondary" />
          </div>
          <div>
            <p className="font-semibold">{t('orders.emptyTitle')}</p>
            <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('orders.empty')}</p>
          </div>
          <Link
            to="/order"
            className="rounded-md bg-light-accent px-5 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 dark:bg-dark-accent"
          >
            {t('orders.emptyCta')}
          </Link>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-light-border text-light-text-secondary dark:border-dark-border dark:text-dark-text-secondary">
                <th className="py-2 pr-4">{t('orders.service')}</th>
                <th className="py-2 pr-4">{t('orders.quantity')}</th>
                <th className="py-2 pr-4">{t('orders.total')}</th>
                <th className="py-2 pr-4">{t('orders.status')}</th>
                {hasTracking && <th className="py-2">{t('orders.tracking')}</th>}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-light-border last:border-0 dark:border-dark-border">
                  <td className="py-2 pr-4 font-medium">{order.product}</td>
                  <td className="py-2 pr-4">{order.quantity}</td>
                  <td className="py-2 pr-4">${Number(order.price || 0).toFixed(2)}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        STATUS_BADGE_STYLES[order.status] || 'bg-light-surface-secondary dark:bg-dark-surface-secondary'
                      }`}
                    >
                      {tCommon(`status.${order.status}`, { defaultValue: order.status })}
                    </span>
                    <StatusStepper status={order.status} />
                  </td>
                  {hasTracking && (
                    <td className="py-2">
                      <TrackingCell value={order.trackingNumber} />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
    </div>
  );
}
