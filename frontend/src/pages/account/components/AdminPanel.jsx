import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaExclamationCircle, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';
import Pagination from './Pagination.jsx';

const STATUSES        = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
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
    .map((row) => row.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'pedidos.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(onClose, 3500);
    return () => clearTimeout(id);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all ${
        isSuccess
          ? 'border-light-success/30 bg-light-success/10 text-light-success dark:border-dark-success/30 dark:bg-dark-success/10 dark:text-dark-success'
          : 'border-light-error/30 bg-light-error/10 text-light-error dark:border-dark-error/30 dark:bg-dark-error/10 dark:text-dark-error'
      }`}
    >
      {isSuccess
        ? <FaCheckCircle aria-hidden="true" className="mt-0.5 shrink-0 text-base" />
        : <FaExclamationCircle aria-hidden="true" className="mt-0.5 shrink-0 text-base" />
      }
      <p className="flex-1 text-sm font-medium">{toast.text}</p>
      <button type="button" onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100">
        <FaTimes aria-hidden="true" className="text-xs" />
      </button>
    </div>
  );
}

function TrackingCell({ value }) {
  if (!value) return <span className="text-light-text-secondary dark:text-dark-text-secondary">—</span>;
  const isUrl = value.startsWith('http://') || value.startsWith('https://');
  if (isUrl) {
    return (
      <a href={value} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-medium text-light-accent underline-offset-2 hover:underline dark:text-dark-accent">
        Ver <FaExternalLinkAlt aria-hidden="true" className="text-[10px]" />
      </a>
    );
  }
  return <span className="rounded-full bg-light-surface-secondary px-2 py-0.5 font-mono text-xs dark:bg-dark-surface-secondary">{value}</span>;
}

export default function AdminPanel({
  orders, loading, loadOrders, changeOrderStatus,
  page, totalPages, total, status, q,
  filterByStatus, search, goToPage,
}) {
  const { t } = useTranslation('account');
  const { t: tCommon } = useTranslation('common');
  const [drafts, setDrafts] = useState({});
  const [toast, setToast] = useState(null);
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  useEffect(() => {
    const id = setTimeout(() => search(searchInput), 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const closeToast = useCallback(() => setToast(null), []);

  const getDraft = (order) =>
    drafts[order._id] || { status: order.status, trackingNumber: order.trackingNumber || '' };

  const setDraft = (order, patch) =>
    setDrafts((prev) => ({ ...prev, [order._id]: { ...getDraft(order), ...patch } }));

  const handleUpdate = async (order) => {
    const draft = getDraft(order);
    try {
      await changeOrderStatus(order._id, draft.status, draft.trackingNumber);
      setToast({ type: 'success', text: t('admin.updated') });
    } catch {
      setToast({ type: 'error', text: t('admin.updated') });
    }
  };

  return (
    <div>
      <Toast toast={toast} onClose={closeToast} />

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
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {t('orders.filterByStatus')}
          <select className={selectClass} value={status} onChange={(e) => filterByStatus(e.target.value)}>
            <option value="">{t('orders.allStatuses')}</option>
            {FILTER_STATUSES.map((s) => (
              <option key={s} value={s}>{tCommon(`status.${s}`, { defaultValue: s })}</option>
            ))}
          </select>
        </label>
        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {t('admin.totalResults', { count: total })}
        </span>
      </div>

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
                        onChange={(e) => setDraft(order, { status: e.target.value })}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{tCommon(`status.${s}`, { defaultValue: s })}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 pr-4">
                      <input
                        className={inputClass}
                        value={draft.trackingNumber}
                        onChange={(e) => setDraft(order, { trackingNumber: e.target.value })}
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
