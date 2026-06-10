import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useCoupons from '../../../hooks/useCoupons.jsx';

const inputClass =
  'w-full rounded-md border border-light-border bg-light-surface px-3 py-2 text-sm text-light-text-primary placeholder:text-light-text-secondary focus:border-light-accent focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary dark:focus:border-dark-accent';

const labelClass = 'mb-1 block text-sm font-medium text-light-text-primary dark:text-dark-text-primary';

const buttonClass =
  'rounded-md bg-light-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60 dark:bg-dark-accent';

const secondaryButtonClass =
  'rounded-md border border-light-border px-3 py-1.5 text-xs font-semibold text-light-text-primary transition-colors hover:bg-light-surface-secondary disabled:opacity-60 dark:border-dark-border dark:text-dark-text-primary dark:hover:bg-dark-surface-secondary';

const initialForm = { code: '', type: 'percentage', value: '', active: true };

function formatValue(coupon) {
  return coupon.type === 'percentage' ? `${coupon.value}%` : `$${Number(coupon.value).toFixed(2)}`;
}

export default function CouponManager({ token }) {
  const { t } = useTranslation('account');
  const { coupons, loading, loadCoupons, addCoupon, editCoupon, removeCoupon } = useCoupons(token);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setFormError(null);
    setFeedback(null);
    try {
      await addCoupon({ code: form.code.trim(), type: form.type, value: Number(form.value), active: form.active });
      setForm(initialForm);
      setFeedback({ type: 'success', text: t('coupons.created') });
    } catch (err) {
      setFormError(err?.response?.data?.detail || null);
    }
  };

  const handleToggleActive = async (coupon) => {
    setFeedback(null);
    try {
      await editCoupon(coupon._id, { active: !coupon.active });
      setFeedback({ type: 'success', text: t('coupons.updated') });
    } catch (err) {
      setFeedback({ type: 'error', text: err?.response?.data?.detail || null });
    }
  };

  const handleDelete = async (coupon) => {
    if (!window.confirm(t('coupons.confirmDelete'))) return;
    setFeedback(null);
    try {
      await removeCoupon(coupon._id);
      setFeedback({ type: 'success', text: t('coupons.deleted') });
    } catch (err) {
      setFeedback({ type: 'error', text: err?.response?.data?.detail || null });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold">{t('coupons.title')}</h2>
      <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('coupons.subtitle')}</p>

      <form onSubmit={handleCreate} className="mt-4 grid gap-3 sm:grid-cols-[1.5fr_1fr_1fr_auto_auto] sm:items-end">
        <div>
          <label htmlFor="coupon-code" className={labelClass}>{t('coupons.code')}</label>
          <input
            id="coupon-code"
            name="code"
            className={inputClass}
            value={form.code}
            onChange={handleChange}
            placeholder={t('coupons.codePlaceholder')}
            required
          />
        </div>
        <div>
          <label htmlFor="coupon-type" className={labelClass}>{t('coupons.type')}</label>
          <select id="coupon-type" name="type" className={inputClass} value={form.type} onChange={handleChange}>
            <option value="percentage">{t('coupons.typePercentage')}</option>
            <option value="fixed">{t('coupons.typeFixed')}</option>
          </select>
        </div>
        <div>
          <label htmlFor="coupon-value" className={labelClass}>{t('coupons.value')}</label>
          <input
            id="coupon-value"
            name="value"
            type="number"
            min="0"
            step="0.01"
            className={inputClass}
            value={form.value}
            onChange={handleChange}
            placeholder={form.type === 'percentage' ? t('coupons.valuePercentagePlaceholder') : t('coupons.valueFixedPlaceholder')}
            required
          />
        </div>
        <label className="flex items-center gap-2 pb-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
          <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
          {t('coupons.active')}
        </label>
        <button type="submit" className={buttonClass}>
          {t('coupons.create')}
        </button>
      </form>

      {formError && <p className="mt-2 text-sm font-medium text-light-error dark:text-dark-error">{formError}</p>}
      {feedback && (
        <p
          className={`mt-2 text-sm font-medium ${
            feedback.type === 'success'
              ? 'text-light-success dark:text-dark-success'
              : 'text-light-error dark:text-dark-error'
          }`}
        >
          {feedback.text}
        </p>
      )}

      {!loading && (
        coupons.length === 0 ? (
          <p className="mt-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('coupons.empty')}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-light-border text-light-text-secondary dark:border-dark-border dark:text-dark-text-secondary">
                  <th className="py-2 pr-4">{t('coupons.code')}</th>
                  <th className="py-2 pr-4">{t('coupons.type')}</th>
                  <th className="py-2 pr-4">{t('coupons.value')}</th>
                  <th className="py-2 pr-4">{t('coupons.status')}</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-b border-light-border last:border-0 dark:border-dark-border">
                    <td className="py-2 pr-4 font-mono font-medium">{coupon.code}</td>
                    <td className="py-2 pr-4">{coupon.type === 'percentage' ? t('coupons.typePercentage') : t('coupons.typeFixed')}</td>
                    <td className="py-2 pr-4">{formatValue(coupon)}</td>
                    <td className="py-2 pr-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          coupon.active
                            ? 'bg-light-success/15 text-light-success dark:bg-dark-success/15 dark:text-dark-success'
                            : 'bg-light-surface-secondary text-light-text-secondary dark:bg-dark-surface-secondary dark:text-dark-text-secondary'
                        }`}
                      >
                        {coupon.active ? t('coupons.active') : t('coupons.inactive')}
                      </span>
                    </td>
                    <td className="py-2">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => handleToggleActive(coupon)} className={secondaryButtonClass}>
                          {coupon.active ? t('coupons.deactivate') : t('coupons.activate')}
                        </button>
                        <button type="button" onClick={() => handleDelete(coupon)} className={secondaryButtonClass}>
                          {t('coupons.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
