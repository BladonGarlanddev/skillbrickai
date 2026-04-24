import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, Sparkles, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/api';
import styles from './DonatePage.module.scss';

const PRESET_AMOUNTS = [5, 10, 25, 50];

interface PastDonation {
  id: string;
  amount: number;
  currency: string;
  createdAt: string;
}

export default function DonatePage() {
  const { isAuthenticated } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState<number>(10);
  const [custom, setCustom] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pastDonations, setPastDonations] = useState<PastDonation[]>([]);

  const status = searchParams.get('status');

  useEffect(() => {
    if (isAuthenticated) {
      api
        .get('/donations/me')
        .then((res) => setPastDonations(res.data.donations))
        .catch(() => {});
    }
  }, [isAuthenticated, status]);

  function resolveAmountCents(): number | null {
    if (custom.trim()) {
      const dollars = Number(custom);
      if (!Number.isFinite(dollars) || dollars <= 0) return null;
      return Math.round(dollars * 100);
    }
    return selected * 100;
  }

  async function handleDonate() {
    setError(null);

    if (!isAuthenticated) {
      window.location.href = '/auth';
      return;
    }

    const amountCents = resolveAmountCents();
    if (amountCents === null || amountCents < 100 || amountCents > 100_000) {
      setError('Please enter an amount between $1 and $1000.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/donations/checkout', { amount: amountCents });
      window.location.href = res.data.checkoutUrl;
    } catch (err: any) {
      setLoading(false);
      setError(
        err?.response?.data?.message ?? 'Failed to start checkout. Try again.',
      );
    }
  }

  const isPatron = pastDonations.length > 0;

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Donate | SkillBrick AI</title>
        <meta
          name="description"
          content="Support SkillBrick AI with a one-time donation. Donors receive the Patron badge on their profile."
        />
        <link rel="canonical" href="https://skillbrickai.com/donate" />
      </Helmet>

      <div className={styles.header}>
        <div className={styles.iconCircle}>
          <Heart size={28} />
        </div>
        <h1 className={styles.title}>Support SkillBrick AI</h1>
        <p className={styles.subtitle}>
          SkillBrick is a community library of reusable AI skills. Donations
          help keep it running, pay for hosting, and fund new features. In
          return, every donor gets the Patron badge on their profile.
        </p>
      </div>

      {status === 'success' && (
        <div className={styles.banner} data-variant="success">
          <CheckCircle size={18} />
          <span>
            Thank you! Your donation was received and your Patron badge has
            been granted.
          </span>
        </div>
      )}
      {status === 'cancelled' && (
        <div className={styles.banner} data-variant="info">
          <span>Checkout cancelled. No charge was made.</span>
        </div>
      )}

      {isPatron && (
        <div className={styles.patronCard}>
          <Sparkles size={16} />
          <span>You&apos;re a Patron — thank you for your support.</span>
        </div>
      )}

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Choose an amount</h2>

        <div className={styles.presets}>
          {PRESET_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              className={`${styles.preset} ${
                !custom && selected === amount ? styles.presetActive : ''
              }`}
              onClick={() => {
                setSelected(amount);
                setCustom('');
              }}
            >
              ${amount}
            </button>
          ))}
        </div>

        <div className={styles.customRow}>
          <label htmlFor="custom-amount" className={styles.customLabel}>
            Or custom amount (USD)
          </label>
          <div className={styles.customInputWrap}>
            <span className={styles.currency}>$</span>
            <input
              id="custom-amount"
              type="number"
              min="1"
              max="1000"
              step="1"
              inputMode="decimal"
              placeholder="0"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              className={styles.customInput}
            />
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button
          type="button"
          onClick={handleDonate}
          disabled={loading}
          className={styles.donateButton}
        >
          {loading ? 'Redirecting to Stripe…' : 'Donate'}
        </button>

        <p className={styles.note}>
          Secure payment processed by Stripe. One-time donation. You must be
          signed in so we can grant your Patron badge.
        </p>
      </div>

      {pastDonations.length > 0 && (
        <div className={styles.history}>
          <h2 className={styles.historyTitle}>Your donations</h2>
          <ul className={styles.historyList}>
            {pastDonations.map((d) => (
              <li key={d.id} className={styles.historyItem}>
                <span>${(d.amount / 100).toFixed(2)}</span>
                <span className={styles.historyDate}>
                  {new Date(d.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
