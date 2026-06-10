import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Pagination from './Pagination.jsx';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const FILTER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered'];

const selectClass =
  'rounded-md border border-light-border bg-light-surface px-2 py-1 text-sm text-light-text-primary focus:border-light-accent focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:focus:border-dark-accent';

const inputClass =
  'w-32 rounded-md border border-light-border bg-light-surface px-2 py-1 text-sm text-light-text-primary placeholder:text-light-text-secondary focus:border-light-accent focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary dark:focus:border-dark-accent';

const searchInputClass =
  'w-full max-w-xs rounded-md border border-light-border bg-light-surface px-3 py-1.5 text-sm text-light-text-primary placeholder:text-light-text-secondary focus:border-light-accent focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary dark:focus:border-dark-accent';

function exportToCsv(orders) {
  const header = ['Cliente', 'Correo', 'Servicio', 'Cantidad', 'Total', 'Estado', 'Seguimiento'];
  const rows = orders.map((order) => [
    order.name,
    order.email,
    order.product,
    order.quantity,
    order.price,
    order.status,
    order.trackingNumber || '',
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'pedidos.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminPanel({
  orders,
  loading,
  loadOrders,
  changeOrderStatus,
  page,
  totalPages,
  total,
  status,
  q,
  filterByStatus,
  search,
  goToPage,
}) {
  const { t } = useTranslation('account');
  const { t: tCommon } = useTranslation('common');
  const [drafts, setDrafts] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    const timeout = setTimeout(() => search(searchInput), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const getDraft = (order) =>
    drafts[order._id] || { status: order.status, trackingNumber: order.trackingNumber || '' };

  const setDraft = (order, patch) => {
    setDrafts((prev) => ({ ...prev, [order._id]: { ...getDraft(order), ...patch } }));
  };

  const handleUpdate = async (order) => {
    const draft = getDraft(order);
    setFeedback(null);
    try {
      await changeOrderStatus(order._id, draft.status, draft.trackingNumber);
      setFeedback({ type: 'success', text: t('admin.updated') });
    } catch {
      setFeedback({ type: 'error', text: t('admin.updated') });
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">{t('admin.title')}</h2>
          <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('admin.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => exportToCsv(orders)}
          disabled={orders.length === 0}
          className="shrink-0 rounded-md border border-light-border px-4 py-2 text-sm font-semibold text-light-text-primary transition-colors hover:bg-light-surface-secondary disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-border dark:text-dark-text-primary dark:hover:bg-dark-surface-secondary"
        >
          {t('admin.export')}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <input
          type="search"
          className={searchInputClass}
          placeholder={t('admin.searchPlaceholder')}
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        <label className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {t('orders.filterByStatus')}
          <select className={selectClass} value={status} onChange={(event) => filterByStatus(event.target.value)}>
            <option value="">{t('orders.allStatuses')}</option>
            {FILTER_STATUSES.map((value) => (
              <option key={value} value={value}>
                {tCommon(`status.${value}`, { defaultValue: value })}
              </option>
            ))}
          </select>
        </label>
        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {t('admin.totalResults', { count: total })}
        </span>
      </div>

      {feedback && (
        <p
          className={`mt-3 text-sm font-medium ${
            feedback.type === 'success'
              ? 'text-light-success dark:text-dark-success'
              : 'text-light-error dark:text-dark-error'
          }`}
        >
          {feedback.text}
        </p>
      )}

      {!loading && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-light-border text-light-text-secondary dark:border-dark-border dark:text-dark-text-secondary">
                <th className="py-2 pr-4">{t('admin.customer')}</th>
                <th className="py-2 pr-4">{t('admin.service')}</th>
                <th className="py-2 pr-4">{t('admin.total')}</th>
                <th className="py-2 pr-4">{t('admin.status')}</th>
                <th className="py-2 pr-4">{t('admin.tracking')}</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const draft = getDraft(order);
                return (
                  <tr key={order._id} className="border-b border-light-border last:border-0 dark:border-dark-border">
                    <td className="py-2 pr-4">
                      <p className="font-medium">{order.name}</p>
                      <p className="text-light-text-secondary dark:text-dark-text-secondary">{order.email}</p>
                    </td>
                    <td className="py-2 pr-4">{order.product}</td>
                    <td className="py-2 pr-4">${Number(order.price || 0).toFixed(2)}</td>
                    <td className="py-2 pr-4">
                      <select
                        className={selectClass}
                        value={draft.status}
                        onChange={(event) => setDraft(order, { status: event.target.value })}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {tCommon(`status.${status}`, { defaultValue: status })}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 pr-4">
                      <input
                        className={inputClass}
                        value={draft.trackingNumber}
                        onChange={(event) => setDraft(order, { trackingNumber: event.target.value })}
                      />
                    </td>
                    <td className="py-2">
                      <button
                        type="button"
                        onClick={() => handleUpdate(order)}
                        className="rounded-md bg-light-accent px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:opacity-90 dark:bg-dark-accent"
                      >
                        {t('admin.update')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
    </div>
  );
}
