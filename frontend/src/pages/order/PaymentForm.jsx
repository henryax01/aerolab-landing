import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#111827',
      '::placeholder': { color: '#6b7280' },
    },
    invalid: { color: '#dc2626' },
  },
};

export default function PaymentForm({ amount, onPay, onCancel }) {
  const { t } = useTranslation('order');
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [cardError, setCardError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setCardError(null);

    try {
      const { clientSecret } = await onPay.getClientSecret();

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (error) {
        setCardError(error.message);
        return;
      }

      await onPay.onConfirmed(paymentIntent.id);
    } catch (err) {
      setCardError(err?.response?.data?.detail || t('payment.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
          {t('payment.cardLabel')}
        </label>
        <div className="rounded-md border border-light-border bg-light-surface p-3 dark:border-dark-border dark:bg-dark-surface">
          <CardElement options={cardElementOptions} />
        </div>
        {cardError && <p className="mt-2 text-sm text-light-error dark:text-dark-error">{cardError}</p>}
      </div>

      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
        {t('summary.total')}: <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">${amount.toFixed(2)}</span>
      </p>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!stripe || submitting}
          className="rounded-md bg-light-accent px-5 py-2.5 font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60 dark:bg-dark-accent"
        >
          {submitting ? t('payment.processing') : t('payment.pay')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-light-border px-5 py-2.5 font-semibold text-light-text-primary transition-colors hover:bg-light-surface-secondary dark:border-dark-border dark:text-dark-text-primary dark:hover:bg-dark-surface-secondary"
        >
          {t('payment.cancel')}
        </button>
      </div>
    </form>
  );
}
