import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import useOrders from '../../hooks/useOrders.jsx';
import useCoupon from '../../hooks/useCoupon.jsx';
import usePageMeta from '../../hooks/usePageMeta.jsx';
import { getStripePublicKey } from '../../utils/ordersData.jsx';
import PaymentForm from './PaymentForm.jsx';

export const pageMetadata = {
  path: '/order',
  label: 'Pedidos',
  category: 'servicios',
  minRoleLevel: 0,
  maxRoleLevel: Infinity,
  order: 4,
  locations: ['header'],
  description: 'Formulario para solicitar un servicio',
  icon: 'FaShoppingCart',
  isSearchable: true,
};

const PRODUCTS = [
  { name: 'Desarrollo web', price: 1200 },
  { name: 'Diseño gráfico', price: 450 },
  { name: 'Marketing digital', price: 650 },
  { name: 'Consultoría', price: 320 },
];

const inputClass =
  'w-full rounded-md border border-light-border bg-light-surface px-3 py-2 text-light-text-primary placeholder:text-light-text-secondary focus:border-light-accent focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary dark:focus:border-dark-accent';

const labelClass = 'mb-1 block text-sm font-medium text-light-text-primary dark:text-dark-text-primary';

export default function Order() {
  const { t } = useTranslation('order');
  usePageMeta('order', pageMetadata.path);
  const [searchParams] = useSearchParams();
  const requestedProduct = searchParams.get('product');

  const initialProduct = PRODUCTS.find((p) => p.name === requestedProduct) || PRODUCTS[0];

  const [form, setForm] = useState({
    name: '',
    email: '',
    product: initialProduct.name,
    quantity: 1,
    address: '',
    notes: '',
  });
  const [orderId, setOrderId] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  const { error: orderError, placeOrder, startPayment, finishPayment } = useOrders(null);
  const { coupon: appliedCoupon, loading: couponLoading, error: couponError, applyCoupon, removeCoupon } = useCoupon();

  useEffect(() => {
    getStripePublicKey()
      .then((res) => setStripePromise(loadStripe(res.publicKey)))
      .catch(() => setStripePromise(null));
  }, []);

  const selectedProduct = useMemo(
    () => PRODUCTS.find((p) => p.name === form.product) || PRODUCTS[0],
    [form.product],
  );
  const subtotal = selectedProduct.price * Number(form.quantity || 1);
  const discount = appliedCoupon?.discount || 0;
  const total = appliedCoupon?.total ?? subtotal;

  useEffect(() => {
    if (appliedCoupon) removeCoupon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async (event) => {
    event.preventDefault();
    if (!couponCode.trim()) return;
    try {
      await applyCoupon(couponCode.trim(), subtotal);
    } catch {
      // el error se refleja desde el hook de cupones
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);
    try {
      const res = await placeOrder({
        name: form.name,
        email: form.email,
        product: form.product,
        quantity: Number(form.quantity),
        address: form.address,
        notes: form.notes,
        price: subtotal,
        couponCode: appliedCoupon?.code || undefined,
      });
      setOrderId(res.orderId);
      setFeedback({ type: 'success', text: t('messages.created') });
    } catch {
      setFeedback({ type: 'error', text: t('messages.error') });
    }
  };

  const paymentHandlers = {
    getClientSecret: async () => startPayment(orderId, total),
    onConfirmed: async (paymentIntentId) => {
      await finishPayment(orderId, paymentIntentId);
      setPaymentDone(true);
    },
  };

  return (
    <div className="bg-light-background text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">
      <section className="relative overflow-hidden bg-gradient-to-b from-light-surface to-light-background py-20 text-center dark:from-dark-surface dark:to-dark-background">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-light-accent/40 to-transparent dark:via-dark-accent/40" />
        <div className="mx-auto max-w-3xl px-4">
          <span className="inline-block rounded-full border border-light-accent/20 bg-light-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-light-accent dark:border-dark-accent/20 dark:bg-dark-accent/10 dark:text-dark-accent">
            {t('hero.badge')}
          </span>
          <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl">{t('hero.title')}</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-light-text-secondary dark:text-dark-text-secondary">
            {t('hero.subtitle')}
          </p>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-light-border to-transparent dark:via-dark-border" />
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 pb-20 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border border-light-border bg-light-surface p-6 dark:border-dark-border dark:bg-dark-surface">
          {paymentDone ? (
            <p className="rounded-md bg-light-success/10 p-4 font-semibold text-light-success dark:bg-dark-success/10 dark:text-dark-success">
              {t('payment.success')}
            </p>
          ) : orderId ? (
            stripePromise ? (
              <Elements stripe={stripePromise}>
                <h2 className="mb-4 text-xl font-bold">{t('payment.title')}</h2>
                <p className="mb-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('payment.subtitle')}</p>
                <PaymentForm amount={total} onPay={paymentHandlers} onCancel={() => setOrderId(null)} />
              </Elements>
            ) : (
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('payment.processing')}</p>
            )
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold">{t('form.title')}</h2>

              <div>
                <label className={labelClass}>{t('form.name')}</label>
                <input className={inputClass} name="name" value={form.name} onChange={handleChange} required />
              </div>

              <div>
                <label className={labelClass}>{t('form.email')}</label>
                <input className={inputClass} type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>

              <div>
                <label className={labelClass}>{t('form.product')}</label>
                <select className={inputClass} name="product" value={form.product} onChange={handleChange}>
                  {PRODUCTS.map((product) => (
                    <option key={product.name} value={product.name}>
                      {t(`form.products.${product.name}`, { defaultValue: product.name })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>{t('form.quantity')}</label>
                <input
                  className={inputClass}
                  type="number"
                  min="1"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>{t('form.address')}</label>
                <input className={inputClass} name="address" value={form.address} onChange={handleChange} required />
              </div>

              <div>
                <label className={labelClass}>{t('form.notes')}</label>
                <textarea className={inputClass} name="notes" rows="3" value={form.notes} onChange={handleChange} />
              </div>

              <div>
                <label className={labelClass}>{t('form.couponCode')}</label>
                <div className="flex gap-2">
                  <input
                    className={inputClass}
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    placeholder={t('form.couponPlaceholder')}
                    disabled={Boolean(appliedCoupon)}
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="shrink-0 rounded-md border border-light-border px-4 py-2 text-sm font-semibold text-light-text-primary transition-colors hover:bg-light-surface-secondary dark:border-dark-border dark:text-dark-text-primary dark:hover:bg-dark-surface-secondary"
                    >
                      {t('form.removeCoupon')}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="shrink-0 rounded-md border border-light-border px-4 py-2 text-sm font-semibold text-light-text-primary transition-colors hover:bg-light-surface-secondary disabled:opacity-60 dark:border-dark-border dark:text-dark-text-primary dark:hover:bg-dark-surface-secondary"
                    >
                      {t('form.applyCoupon')}
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="mt-1 text-sm font-medium text-light-success dark:text-dark-success">
                    {t('form.couponApplied', { code: appliedCoupon.code })}
                  </p>
                )}
                {couponError && <p className="mt-1 text-sm font-medium text-light-error dark:text-dark-error">{couponError}</p>}
              </div>

              {(feedback || orderError) && (
                <p
                  className={`text-sm font-medium ${
                    feedback?.type === 'success'
                      ? 'text-light-success dark:text-dark-success'
                      : 'text-light-error dark:text-dark-error'
                  }`}
                >
                  {feedback?.text || orderError}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-md bg-light-accent px-5 py-2.5 font-semibold text-white transition-colors hover:opacity-90 dark:bg-dark-accent"
              >
                {t('form.submit')}
              </button>
            </form>
          )}
        </div>

        <aside className="h-fit rounded-lg border border-light-border bg-light-surface p-6 dark:border-dark-border dark:bg-dark-surface">
          <h2 className="text-lg font-bold">{t('summary.title')}</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-light-text-secondary dark:text-dark-text-secondary">{t('summary.service')}</dt>
              <dd className="font-medium">{t(`form.products.${selectedProduct.name}`, { defaultValue: selectedProduct.name })}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-light-text-secondary dark:text-dark-text-secondary">{t('summary.quantity')}</dt>
              <dd className="font-medium">{form.quantity}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-light-text-secondary dark:text-dark-text-secondary">{t('summary.unitPrice')}</dt>
              <dd className="font-medium">${selectedProduct.price.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-light-text-secondary dark:text-dark-text-secondary">{t('summary.subtotal')}</dt>
              <dd className="font-medium">${subtotal.toFixed(2)}</dd>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-light-success dark:text-dark-success">
                <dt>{t('summary.discount')}</dt>
                <dd className="font-medium">-${discount.toFixed(2)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-light-border pt-2 text-base font-bold dark:border-dark-border">
              <dt>{t('summary.total')}</dt>
              <dd>${total.toFixed(2)}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </div>
  );
}
