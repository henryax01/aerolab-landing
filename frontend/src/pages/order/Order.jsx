import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
  FaCheck, FaCheckCircle, FaLock, FaShieldAlt, FaHandshake, FaStar,
} from 'react-icons/fa';
import useOrders from '../../hooks/useOrders.jsx';
import useCoupon from '../../hooks/useCoupon.jsx';
import usePageMeta from '../../hooks/usePageMeta.jsx';
import { getStripePublicKey } from '../../utils/ordersData.jsx';
import PaymentForm from './PaymentForm.jsx';
import ScrollReveal from '../../components/common/ScrollReveal.jsx';

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

// ── Products ──────────────────────────────────────────────────────────────────
const PRODUCTS = [
  // web
  { name: 'Desarrollo web',                     price: 1200, category: 'web',       priceRange: '$1,200 – $3,500'   },
  { name: 'Tienda online',                       price: 1800, category: 'web',       priceRange: '$1,800 – $4,500'   },
  { name: 'Aplicación móvil',                    price: 2500, category: 'web',       priceRange: '$2,500 – $6,000'   },
  { name: 'Landing page',                        price: 400,  category: 'web',       priceRange: '$400 – $900'       },
  { name: 'Mantenimiento web',                   price: 150,  category: 'web',       priceRange: '$150 – $400/mo'    },
  { name: 'Migración de sitio web',              price: 500,  category: 'web',       priceRange: '$500 – $1,500'     },
  { name: 'Integración de APIs',                 price: 600,  category: 'web',       priceRange: '$600 – $2,000'     },
  { name: 'Auditoría de seguridad web',          price: 500,  category: 'web',       priceRange: '$500 – $1,500'     },
  { name: 'Optimización de rendimiento web',     price: 300,  category: 'web',       priceRange: '$300 – $900'       },
  { name: 'Desarrollo de plugins',               price: 400,  category: 'web',       priceRange: '$400 – $1,200'     },
  { name: 'Progressive Web App',                 price: 800,  category: 'web',       priceRange: '$800 – $2,200'     },
  { name: 'Portal web corporativo',              price: 2000, category: 'web',       priceRange: '$2,000 – $5,000'   },
  // design
  { name: 'Diseño gráfico',                      price: 300,  category: 'design',    priceRange: '$300 – $900'       },
  { name: 'Diseño UI/UX',                        price: 800,  category: 'design',    priceRange: '$800 – $2,500'     },
  { name: 'Diseño de logotipo',                  price: 200,  category: 'design',    priceRange: '$200 – $600'       },
  { name: 'Manual de marca',                     price: 500,  category: 'design',    priceRange: '$500 – $1,500'     },
  { name: 'Diseño de presentaciones',            price: 200,  category: 'design',    priceRange: '$200 – $600'       },
  { name: 'Ilustración digital',                 price: 300,  category: 'design',    priceRange: '$300 – $900'       },
  { name: 'Diseño de empaques',                  price: 400,  category: 'design',    priceRange: '$400 – $1,200'     },
  { name: 'Prototipado interactivo',             price: 500,  category: 'design',    priceRange: '$500 – $1,500'     },
  { name: 'Rebranding',                          price: 1000, category: 'design',    priceRange: '$1,000 – $3,000'   },
  { name: 'Diseño editorial',                    price: 400,  category: 'design',    priceRange: '$400 – $1,200'     },
  // marketing
  { name: 'Marketing digital',                   price: 600,  category: 'marketing', priceRange: '$600 – $2,000/mo'  },
  { name: 'Gestión de redes sociales',           price: 400,  category: 'marketing', priceRange: '$400 – $1,200/mo'  },
  { name: 'Publicidad en Google Ads',            price: 300,  category: 'marketing', priceRange: '$300 – $900/mo'    },
  { name: 'Publicidad en redes sociales',        price: 300,  category: 'marketing', priceRange: '$300 – $900/mo'    },
  { name: 'SEO y posicionamiento web',           price: 400,  category: 'marketing', priceRange: '$400 – $1,200/mo'  },
  { name: 'Email marketing',                     price: 200,  category: 'marketing', priceRange: '$200 – $600/mo'    },
  { name: 'Marketing de contenidos',             price: 400,  category: 'marketing', priceRange: '$400 – $1,200/mo'  },
  { name: 'Producción de video',                 price: 800,  category: 'marketing', priceRange: '$800 – $3,000'     },
  { name: 'Fotografía de producto',              price: 300,  category: 'marketing', priceRange: '$300 – $900'       },
  { name: 'Estrategia de marca digital',         price: 600,  category: 'marketing', priceRange: '$600 – $2,000'     },
  // ai
  { name: 'Chatbots con IA',                     price: 800,  category: 'ai',        priceRange: '$800 – $2,500'     },
  { name: 'Automatización de procesos',          price: 700,  category: 'ai',        priceRange: '$700 – $2,200'     },
  { name: 'Análisis de datos con IA',            price: 900,  category: 'ai',        priceRange: '$900 – $2,800'     },
  { name: 'Integración de modelos de lenguaje',  price: 1000, category: 'ai',        priceRange: '$1,000 – $3,000'   },
  { name: 'Generación de contenido con IA',      price: 500,  category: 'ai',        priceRange: '$500 – $1,500'     },
  { name: 'Automatización de marketing con IA',  price: 700,  category: 'ai',        priceRange: '$700 – $2,000'     },
  { name: 'Sistemas de recomendación',           price: 1200, category: 'ai',        priceRange: '$1,200 – $3,500'   },
  { name: 'Reconocimiento de imágenes',          price: 1000, category: 'ai',        priceRange: '$1,000 – $3,000'   },
  { name: 'Automatización de reportes',          price: 600,  category: 'ai',        priceRange: '$600 – $1,800'     },
  { name: 'Asistente de voz personalizado',      price: 1500, category: 'ai',        priceRange: '$1,500 – $4,000'   },
  // consulting
  { name: 'Consultoría estratégica',             price: 500,  category: 'consulting', priceRange: '$500 – $1,500/mo' },
  { name: 'Consultoría tecnológica',             price: 400,  category: 'consulting', priceRange: '$400 – $1,200/mo' },
  { name: 'Auditoría digital',                   price: 800,  category: 'consulting', priceRange: '$800 – $2,500'    },
  { name: 'Soporte técnico',                     price: 200,  category: 'consulting', priceRange: '$200 – $600/mo'   },
  { name: 'Capacitación de equipos',             price: 300,  category: 'consulting', priceRange: '$300 – $900'      },
  { name: 'Experiencias 3D interactivas',        price: 1500, category: 'consulting', priceRange: '$1,500 – $4,000'  },
  { name: 'Migración a la nube',                 price: 800,  category: 'consulting', priceRange: '$800 – $2,500'    },
  { name: 'Plan de crecimiento digital',         price: 500,  category: 'consulting', priceRange: '$500 – $1,500'    },
];

const CATEGORY_ORDER = ['web', 'design', 'marketing', 'ai', 'consulting'];

const EMPTY_FORM = { name: '', email: '', quantity: 1, address: '', notes: '' };

// ── Styles ────────────────────────────────────────────────────────────────────
const inputBase =
  'w-full rounded-md border bg-light-surface px-3 py-2.5 text-light-text-primary placeholder:text-light-text-secondary focus:outline-none dark:bg-dark-surface dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary';
const inputOk  = `${inputBase} border-light-border focus:border-light-accent dark:border-dark-border dark:focus:border-dark-accent`;
const inputErr = `${inputBase} border-light-error focus:border-light-error dark:border-dark-error dark:focus:border-dark-error`;
const labelClass = 'mb-1 block text-sm font-medium text-light-text-primary dark:text-dark-text-primary';
const errClass   = 'mt-1 text-xs text-light-error dark:text-dark-error';

// ── StepBar ───────────────────────────────────────────────────────────────────
function StepBar({ current, labels }) {
  return (
    <div className="mx-auto flex max-w-xs items-center justify-between px-4">
      {labels.map((label, i) => {
        const n = i + 1;
        const done   = current > n;
        const active = current === n;
        return (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                done   ? 'bg-light-accent text-white dark:bg-dark-accent'
                : active ? 'border-2 border-light-accent text-light-accent dark:border-dark-accent dark:text-dark-accent'
                         : 'border-2 border-light-border text-light-text-secondary dark:border-dark-border dark:text-dark-text-secondary'
              }`}>
                {done ? <FaCheck className="text-xs" aria-hidden="true" /> : n}
              </div>
              <span className={`text-xs whitespace-nowrap ${active ? 'font-semibold text-light-text-primary dark:text-dark-text-primary' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div className={`mx-2 mb-5 h-px flex-1 transition-colors ${done ? 'bg-light-accent dark:bg-dark-accent' : 'bg-light-border dark:bg-dark-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Order() {
  const { t } = useTranslation('order');
  usePageMeta('order', pageMetadata.path);
  const [searchParams] = useSearchParams();

  const requestedProduct = searchParams.get('product');
  const initialProduct   = PRODUCTS.find((p) => p.name === requestedProduct) || PRODUCTS[0];

  const [form, setForm]           = useState({ ...EMPTY_FORM, product: initialProduct.name });
  const [touched, setTouched]     = useState({});
  const [fieldErrors, setFErrors] = useState({});
  const [orderId, setOrderId]     = useState(null);
  const [stripePromise, setStripe]= useState(null);
  const [feedback, setFeedback]   = useState(null);
  const [paymentDone, setPayDone] = useState(false);
  const [couponCode, setCoupon]   = useState('');

  const { error: orderError, placeOrder, startPayment, finishPayment } = useOrders(null);
  const { coupon: appliedCoupon, loading: couponLoading, error: couponError, applyCoupon, removeCoupon } = useCoupon();

  const step       = paymentDone ? 3 : orderId ? 2 : 1;
  const stepLabels = useMemo(() => t('hero.steps', { returnObjects: true }) || ['Detalles','Pago','Listo'], [t]);

  useEffect(() => {
    getStripePublicKey()
      .then((res) => setStripe(loadStripe(res.publicKey)))
      .catch(() => setStripe(null));
  }, []);

  const selectedProduct = useMemo(
    () => PRODUCTS.find((p) => p.name === form.product) || PRODUCTS[0],
    [form.product],
  );

  const productsByCategory = useMemo(() => {
    const groups = {};
    CATEGORY_ORDER.forEach((cat) => { groups[cat] = []; });
    PRODUCTS.forEach((p) => { if (groups[p.category]) groups[p.category].push(p); });
    return groups;
  }, []);

  const related = useMemo(
    () => PRODUCTS.filter((p) => p.category === selectedProduct.category && p.name !== selectedProduct.name).slice(0, 3),
    [selectedProduct],
  );

  const subtotal = selectedProduct.price * Number(form.quantity || 1);
  const discount = appliedCoupon?.discount || 0;
  const total    = appliedCoupon?.total ?? subtotal;

  useEffect(() => {
    if (appliedCoupon) removeCoupon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (name, value) => {
    if (name === 'name'     && !String(value).trim())                        return t('form.errors.required');
    if (name === 'email'    && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))   return t('form.errors.email');
    if (name === 'quantity' && (Number(value) < 1 || !value))               return t('form.errors.quantity');
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (touched[name]) setFErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setFErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try { await applyCoupon(couponCode.trim(), subtotal); } catch { /* handled by hook */ }
  };

  const handleRemoveCoupon = () => { removeCoupon(); setCoupon(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    const errs = {};
    ['name', 'email', 'quantity'].forEach((k) => {
      const err = validate(k, form[k]);
      if (err) errs[k] = err;
    });
    if (Object.keys(errs).length) {
      setFErrors(errs);
      setTouched({ name: true, email: true, quantity: true });
      return;
    }
    try {
      const res = await placeOrder({
        name: form.name, email: form.email,
        product: form.product, quantity: Number(form.quantity),
        address: form.address, notes: form.notes,
        price: subtotal,
        couponCode: appliedCoupon?.code || undefined,
      });
      setOrderId(res.orderId);
      setFeedback({ type: 'success', text: t('messages.created') });
    } catch {
      setFeedback({ type: 'error', text: t('messages.error') });
    }
  };

  const handleNewOrder = () => {
    setPayDone(false); setOrderId(null); setFeedback(null);
    setForm({ ...EMPTY_FORM, product: PRODUCTS[0].name });
    setCoupon(''); setTouched({}); setFErrors({});
  };

  const paymentHandlers = {
    getClientSecret: async () => startPayment(orderId, total),
    onConfirmed: async (piId) => { await finishPayment(orderId, piId); setPayDone(true); },
  };

  const trustItems = [
    { icon: FaLock,      label: t('trust.secure')       },
    { icon: FaShieldAlt, label: t('trust.ssl')          },
    { icon: FaHandshake, label: t('trust.noCommitment') },
    { icon: FaStar,      label: t('trust.satisfaction') },
  ];

  return (
    <div className="bg-light-background text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">

      {/* ── Hero ── */}
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

      {/* 1 — Step bar */}
      <div className="pt-10 pb-4">
        <StepBar current={step} labels={stepLabels} />
      </div>

      {/* ── Main grid ── */}
      <section className="mx-auto grid max-w-5xl gap-8 px-4 pb-12 pt-4 lg:grid-cols-[2fr_1fr]">

        {/* Left panel */}
        <div className="rounded-xl border border-light-border bg-light-surface p-6 dark:border-dark-border dark:bg-dark-surface">

          {/* 4 — Success state */}
          {paymentDone ? (
            <div className="flex flex-col items-center justify-center gap-5 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-light-accent/10 dark:bg-dark-accent/10">
                <FaCheckCircle aria-hidden="true" className="text-4xl text-light-accent dark:text-dark-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-black">{t('payment.successTitle')}</h2>
                <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">{t('payment.successSubtitle')}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/account"
                  className="rounded-md bg-light-accent px-5 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 dark:bg-dark-accent">
                  {t('payment.viewOrders')}
                </Link>
                <button onClick={handleNewOrder}
                  className="rounded-md border border-light-border px-5 py-2 text-sm font-semibold text-light-text-primary transition-colors hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:text-dark-text-primary dark:hover:border-dark-accent dark:hover:text-dark-accent">
                  {t('payment.newOrder')}
                </button>
              </div>
            </div>

          ) : orderId ? (
            /* Payment step */
            stripePromise ? (
              <Elements stripe={stripePromise}>
                <h2 className="mb-1 text-xl font-bold">{t('payment.title')}</h2>
                <p className="mb-5 text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('payment.subtitle')}</p>
                <PaymentForm amount={total} onPay={paymentHandlers} onCancel={() => setOrderId(null)} />
              </Elements>
            ) : (
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('payment.processing')}</p>
            )

          ) : (
            /* Order form */
            <form onSubmit={handleSubmit} noValidate>
              <h2 className="text-xl font-bold">{t('form.title')}</h2>
              <div className="mt-4 space-y-4">

                {/* Name + Email */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>{t('form.name')}</label>
                    <input name="name" value={form.name}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder={t('form.namePlaceholder')} required
                      className={fieldErrors.name && touched.name ? inputErr : inputOk} />
                    {fieldErrors.name && touched.name && <p className={errClass}>{fieldErrors.name}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>{t('form.email')}</label>
                    <input type="email" name="email" value={form.email}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder={t('form.emailPlaceholder')} required
                      className={fieldErrors.email && touched.email ? inputErr : inputOk} />
                    {fieldErrors.email && touched.email && <p className={errClass}>{fieldErrors.email}</p>}
                  </div>
                </div>

                {/* 2 — Product select with optgroups */}
                <div>
                  <label className={labelClass}>{t('form.product')}</label>
                  <select name="product" value={form.product} onChange={handleChange} className={inputOk}>
                    {CATEGORY_ORDER.map((cat) => (
                      <optgroup key={cat} label={t(`categories.${cat}`)}>
                        {productsByCategory[cat].map((p) => (
                          <option key={p.name} value={p.name}>
                            {t(`form.products.${p.name}`, { defaultValue: p.name })}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Quantity + Address */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>{t('form.quantity')}</label>
                    <input type="number" min="1" name="quantity" value={form.quantity}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder={t('form.quantityPlaceholder')} required
                      className={fieldErrors.quantity && touched.quantity ? inputErr : inputOk} />
                    {fieldErrors.quantity && touched.quantity && <p className={errClass}>{fieldErrors.quantity}</p>}
                  </div>
                  {/* 7 — Address renamed */}
                  <div>
                    <label className={labelClass}>{t('form.address')}</label>
                    <input name="address" value={form.address}
                      onChange={handleChange}
                      placeholder={t('form.addressPlaceholder')}
                      className={inputOk} />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className={labelClass}>{t('form.notes')}</label>
                  <textarea name="notes" rows="3" value={form.notes}
                    onChange={handleChange}
                    placeholder={t('form.notesPlaceholder')}
                    className={inputOk} />
                </div>

                {/* Coupon */}
                <div>
                  <label className={labelClass}>{t('form.couponCode')}</label>
                  <div className="flex gap-2">
                    <input value={couponCode}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder={t('form.couponPlaceholder')}
                      disabled={Boolean(appliedCoupon)}
                      className={inputOk} />
                    {appliedCoupon ? (
                      <button type="button" onClick={handleRemoveCoupon}
                        className="shrink-0 rounded-md border border-light-border px-4 py-2 text-sm font-semibold text-light-text-primary transition-colors hover:bg-light-surface-secondary dark:border-dark-border dark:text-dark-text-primary dark:hover:bg-dark-surface-secondary">
                        {t('form.removeCoupon')}
                      </button>
                    ) : (
                      <button type="button" onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="shrink-0 rounded-md border border-light-border px-4 py-2 text-sm font-semibold text-light-text-primary transition-colors hover:bg-light-surface-secondary disabled:opacity-60 dark:border-dark-border dark:text-dark-text-primary dark:hover:bg-dark-surface-secondary">
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
                  <p className={`text-sm font-medium ${feedback?.type === 'success' ? 'text-light-success dark:text-dark-success' : 'text-light-error dark:text-dark-error'}`}>
                    {feedback?.text || orderError}
                  </p>
                )}

                <button type="submit"
                  className="w-full rounded-md bg-light-accent px-5 py-2.5 font-semibold text-white transition-colors hover:opacity-90 dark:bg-dark-accent">
                  {t('form.submit')}
                </button>

                {/* 8 — Trust badges */}
                <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 pt-1">
                  {trustItems.map(({ icon: Icon, label }) => (
                    <span key={label} className="flex items-center gap-1.5 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      <Icon aria-hidden="true" className="text-light-accent dark:text-dark-accent" />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* 3 + 9 — Sticky sidebar */}
        <aside className="h-fit rounded-xl border border-light-border bg-light-surface p-6 lg:sticky lg:top-8 dark:border-dark-border dark:bg-dark-surface">

          {/* 3 — Service card */}
          <div className="mb-5 rounded-lg border border-light-border bg-light-background p-4 dark:border-dark-border dark:bg-dark-background">
            <span className="inline-block rounded-full bg-light-accent/10 px-2.5 py-0.5 text-xs font-semibold text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent">
              {t(`categories.${selectedProduct.category}`)}
            </span>
            <p className="mt-2 font-semibold text-sm text-light-text-primary dark:text-dark-text-primary">
              {t(`form.products.${selectedProduct.name}`, { defaultValue: selectedProduct.name })}
            </p>
            <div className="mt-3 space-y-1 text-xs text-light-text-secondary dark:text-dark-text-secondary">
              <p>{t('summary.priceRange')}: <span className="font-medium text-light-text-primary dark:text-dark-text-primary">{selectedProduct.priceRange}</span></p>
              {/* 9 — Estimated delivery */}
              <p>{t('summary.estimatedDelivery')}: <span className="font-medium text-light-text-primary dark:text-dark-text-primary">{t(`delivery.${selectedProduct.category}`)}</span></p>
            </div>
          </div>

          <h2 className="text-lg font-bold">{t('summary.title')}</h2>
          <dl className="mt-4 space-y-2 text-sm">
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
            <div className="flex justify-between border-t border-light-border pt-3 text-base font-bold dark:border-dark-border">
              <dt>{t('summary.total')}</dt>
              <dd className="text-light-accent dark:text-dark-accent">${total.toFixed(2)}</dd>
            </div>
          </dl>
        </aside>
      </section>

      {/* 10 — Related services */}
      {related.length > 0 && (
        <section className="border-t border-light-border bg-light-surface py-12 dark:border-dark-border dark:bg-dark-surface">
          <div className="mx-auto max-w-5xl px-4">
            <ScrollReveal>
              <h2 className="mb-6 text-xl font-bold">{t('related.title')}</h2>
            </ScrollReveal>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((svc, i) => (
                <ScrollReveal key={svc.name} delay={i * 60}>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, product: svc.name }))}
                    className="group w-full rounded-xl border border-light-border bg-light-background p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-light-accent hover:shadow-md dark:border-dark-border dark:bg-dark-background dark:hover:border-dark-accent"
                  >
                    <span className="text-xs font-semibold text-light-accent dark:text-dark-accent">
                      {t(`categories.${svc.category}`)}
                    </span>
                    <p className="mt-1 font-semibold text-sm text-light-text-primary dark:text-dark-text-primary">
                      {t(`form.products.${svc.name}`, { defaultValue: svc.name })}
                    </p>
                    <p className="mt-1 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      {t('related.from')} ${svc.price.toLocaleString()}
                    </p>
                  </button>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
