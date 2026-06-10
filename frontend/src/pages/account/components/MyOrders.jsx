import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Pagination from './Pagination.jsx';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered'];

const STATUS_BADGE_STYLES = {
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  confirmed: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
  shipped: 'bg-purple-500/15 text-purple-700 dark:text-purple-300',
  delivered: 'bg-light-success/15 text-light-success dark:bg-dark-success/15 dark:text-dark-success',
};

const selectClass =
  'rounded-md border border-light-border bg-light-surface px-2 py-1 text-sm text-light-text-primary focus:border-light-accent focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:focus:border-dark-accent';

export default function MyOrders({ orders, loading, loadOrders, page, totalPages, status, filterByStatus, goToPage }) {
  const { t } = useTranslation('account');
  const { t: tCommon } = useTranslation('common');

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold">{t('orders.title')}</h2>
        <label className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {t('orders.filterByStatus')}
          <select className={selectClass} value={status} onChange={(event) => filterByStatus(event.target.value)}>
            <option value="">{t('orders.allStatuses')}</option>
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {tCommon(`status.${value}`, { defaultValue: value })}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? null : orders.length === 0 ? (
        <p className="mt-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('orders.empty')}</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-light-border text-light-text-secondary dark:border-dark-border dark:text-dark-text-secondary">
                <th className="py-2 pr-4">{t('orders.service')}</th>
                <th className="py-2 pr-4">{t('orders.quantity')}</th>
                <th className="py-2 pr-4">{t('orders.total')}</th>
                <th className="py-2">{t('orders.status')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-light-border last:border-0 dark:border-dark-border">
                  <td className="py-2 pr-4 font-medium">{order.product}</td>
                  <td className="py-2 pr-4">{order.quantity}</td>
                  <td className="py-2 pr-4">${Number(order.price || 0).toFixed(2)}</td>
                  <td className="py-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        STATUS_BADGE_STYLES[order.status] || 'bg-light-surface-secondary dark:bg-dark-surface-secondary'
                      }`}
                    >
                      {tCommon(`status.${order.status}`, { defaultValue: order.status })}
                    </span>
                  </td>
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
