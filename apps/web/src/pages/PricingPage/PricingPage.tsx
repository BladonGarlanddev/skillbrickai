import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Sparkles, ExternalLink } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/api';
import styles from './PricingPage.module.scss';

interface SubscriptionInfo {
  id: string;
  planName: string;
  status: string;
  currentPeriodEnd: string;
}

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$5',
    description: 'For individuals getting started with shared AI skills.',
    features: [
      '50 skill downloads per month',
      'Basic search and browse',
      'Community access',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$15',
    popular: true,
    description: 'For power users who rely on the skill library daily.',
    features: [
      '200 skill downloads per month',
      'Priority search results',
      'Collections support',
      'Early access to new skills',
    ],
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: '$30',
    description: 'For teams and heavy users who want zero friction.',
    features: [
      'Unlimited skill downloads',
      'Priority support',
      'API rate limit increase',
      'Custom collections',
      'Analytics dashboard',
    ],
  },
];

export default function PricingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(
    null,
  );
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      api
        .get('/billing/subscription')
        .then((res) => setSubscription(res.data.subscription))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  async function handleSubscribe(planId: string) {
    if (!isAuthenticated) {
      window.location.href = '/auth';
      return;
    }

    setLoadingPlan(planId);
    try {
      const res = await api.post('/billing/checkout', { planId });
      window.location.href = res.data.checkoutUrl;
    } catch {
      setLoadingPlan(null);
    }
  }

  async function handleManage() {
    setPortalLoading(true);
    try {
      const res = await api.post('/billing/portal');
      window.location.href = res.data.portalUrl;
    } catch {
      setPortalLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Pricing | SkillBrick AI</title>
        <meta
          name="description"
          content="Simple subscription plans for SkillBrick AI. Get monthly download credits to access the community skill library."
        />
        <link rel="canonical" href="https://skillbrickai.com/pricing" />
      </Helmet>

      <div className={styles.header}>
        <h1 className={styles.title}>Pricing</h1>
        <p className={styles.subtitle}>
          Start free with 30 credits. Earn more by contributing skills, or
          subscribe for monthly credits.
        </p>
      </div>

      <div className={styles.freeTier}>
        <Sparkles size={16} />
        <span>
          Every account starts with 30 free credits, and you earn 10 more each
          time you publish a skill.
        </span>
      </div>

      {subscription && (
        <div className={styles.currentPlan}>
          <div className={styles.currentPlanInfo}>
            <h3>
              Current plan:{' '}
              {subscription.planName.charAt(0).toUpperCase() +
                subscription.planName.slice(1)}
            </h3>
            <p>
              {subscription.status === 'ACTIVE'
                ? `Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                : `Status: ${subscription.status}`}
            </p>
          </div>
          <button
            className={styles.manageButton}
            onClick={handleManage}
            disabled={portalLoading}
          >
            <ExternalLink size={14} />
            {portalLoading ? 'Loading...' : 'Manage subscription'}
          </button>
        </div>
      )}

      <div className={styles.plans}>
        {plans.map((plan) => {
          const isCurrentPlan =
            subscription?.planName === plan.id &&
            subscription?.status === 'ACTIVE';

          return (
            <div
              key={plan.id}
              className={`${styles.plan} ${plan.popular ? styles.planPopular : ''}`}
            >
              {plan.popular && (
                <span className={styles.popularBadge}>Most Popular</span>
              )}
              <h2 className={styles.planName}>{plan.name}</h2>
              <div className={styles.planPrice}>
                <span className={styles.priceAmount}>{plan.price}</span>
                <span className={styles.priceInterval}>/month</span>
              </div>
              <p className={styles.planDescription}>{plan.description}</p>
              <ul className={styles.planFeatures}>
                {plan.features.map((feature) => (
                  <li key={feature} className={styles.planFeature}>
                    <CheckCircle size={16} className={styles.featureCheck} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`${styles.subscribeButton} ${
                  !plan.popular ? styles.subscribeButtonOutline : ''
                }`}
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrentPlan || loadingPlan === plan.id}
              >
                {isCurrentPlan
                  ? 'Current plan'
                  : loadingPlan === plan.id
                    ? 'Loading...'
                    : 'Subscribe'}
              </button>
            </div>
          );
        })}
      </div>

      <div className={styles.faq}>
        <h2 className={styles.faqTitle}>Common Questions</h2>

        <div className={styles.faqItem}>
          <h3>What are credits?</h3>
          <p>
            Each time you download (install) a skill from the library, it costs
            1 credit. Credits reset monthly with your subscription. Free
            credits from publishing skills never expire.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>Can I try it for free?</h3>
          <p>
            Yes. Every new account gets 30 free credits. You can also earn 10
            credits each time you publish a skill to the platform. No
            subscription required.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>Can I change plans or cancel?</h3>
          <p>
            Yes. Upgrade, downgrade, or cancel anytime from your subscription
            management portal. Changes take effect at the next billing cycle.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>What payment methods do you accept?</h3>
          <p>
            We accept all major credit cards, PayPal, and other payment methods
            through our payment partner LemonSqueezy.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>Is searching and browsing free?</h3>
          <p>
            Yes. Searching, browsing, and viewing skill descriptions is always
            free. Credits are only used when you install (download) a skill's
            full content.
          </p>
        </div>
      </div>
    </div>
  );
}
