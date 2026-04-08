import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FileCode, CheckCircle, ArrowRight, Sparkles, RefreshCw, Users } from 'lucide-react';
import styles from './ServicesPage.module.scss';

const services = [
  {
    slug: 'claude-md-writing',
    name: 'CLAUDE.md Writing Service',
    tagline: 'Expert-crafted project instructions for Claude Code',
    price: '$10',
    pricingType: '/month',
    icon: FileCode,
    description:
      'We write and maintain custom CLAUDE.md files for your repositories so Claude Code understands your codebase from day one — and keeps up as it evolves.',
    features: [
      'Unlimited CLAUDE.md files across your repos',
      'Full codebase analysis (architecture, conventions, stack)',
      'Monorepo support with scoped CLAUDE.md files',
      'Ongoing updates as your codebase evolves',
      'Revision requests anytime',
    ],
    highlights: [
      {
        icon: Sparkles,
        title: 'Expert Analysis',
        text: 'We review your code, git history, and CI config to capture conventions you might not think to document.',
      },
      {
        icon: RefreshCw,
        title: 'Always Up to Date',
        text: 'Your CLAUDE.md files stay current as your codebase changes. Request updates anytime — no extra cost.',
      },
      {
        icon: Users,
        title: 'Team Ready',
        text: 'Especially valuable for large codebases, monorepos, or teams onboarding multiple developers onto Claude Code.',
      },
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <Helmet>
        <title>Paid Services | SkillBrick AI</title>
        <meta
          name="description"
          content="Professional AI development services from SkillBrick AI. Get expert-crafted CLAUDE.md files, custom skills, and more."
        />
        <link rel="canonical" href="https://skillbrickai.com/services" />
        <meta property="og:title" content="Paid Services | SkillBrick AI" />
        <meta
          property="og:description"
          content="Professional AI development services — expert-crafted CLAUDE.md files, custom skills, and more."
        />
        <meta property="og:url" content="https://skillbrickai.com/services" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'SkillBrick AI Professional Services',
            description:
              'Professional AI development services from SkillBrick AI.',
            url: 'https://skillbrickai.com/services',
            itemListElement: services.map((s, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Service',
                name: s.name,
                description: s.description,
                url: `https://skillbrickai.com/services/${s.slug}`,
                offers: {
                  '@type': 'Offer',
                  price: '10.00',
                  priceCurrency: 'USD',
                  priceSpecification: {
                    '@type': 'UnitPriceSpecification',
                    price: '10.00',
                    priceCurrency: 'USD',
                    billingDuration: 'P1M',
                  },
                },
              },
            })),
            isPartOf: {
              '@type': 'WebSite',
              name: 'SkillBrick AI',
              url: 'https://skillbrickai.com/',
            },
          })}
        </script>
      </Helmet>

      <div className={styles.header}>
        <h1 className={styles.title}>Professional Services</h1>
        <p className={styles.subtitle}>
          Expert services to get the most out of AI-assisted development.
          Separate from credits — simple monthly pricing.
        </p>
      </div>

      <div className={styles.freeNotice}>
        <Sparkles size={16} />
        <span>
          Want to write your own CLAUDE.md for free? Use the{' '}
          <Link to="/browse?search=claude.md+writer" className={styles.link}>
            CLAUDE.md Writer skill
          </Link>{' '}
          from our library.
        </span>
      </div>

      {services.map((service) => (
        <div key={service.slug} className={styles.serviceCard}>
          <div className={styles.serviceHeader}>
            <div className={styles.serviceIcon}>
              <service.icon size={24} />
            </div>
            <div>
              <h2 className={styles.serviceName}>{service.name}</h2>
              <p className={styles.serviceTagline}>{service.tagline}</p>
            </div>
          </div>

          <p className={styles.serviceDescription}>{service.description}</p>

          <div className={styles.highlights}>
            {service.highlights.map((h) => (
              <div key={h.title} className={styles.highlight}>
                <div className={styles.highlightIcon}>
                  <h.icon size={18} />
                </div>
                <h3 className={styles.highlightTitle}>{h.title}</h3>
                <p className={styles.highlightText}>{h.text}</p>
              </div>
            ))}
          </div>

          <div className={styles.features}>
            <h3 className={styles.featuresTitle}>What's included</h3>
            <ul className={styles.featureList}>
              {service.features.map((f) => (
                <li key={f} className={styles.featureItem}>
                  <CheckCircle size={16} className={styles.featureCheck} />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.pricing}>
            <div className={styles.priceBlock}>
              <span className={styles.priceAmount}>{service.price}</span>
              <span className={styles.priceType}>{service.pricingType}</span>
            </div>
            <a
              href={`mailto:services@skillbrickai.com?subject=${encodeURIComponent(service.name)}&body=${encodeURIComponent('Hi, I\'d like to request the ' + service.name + '.\n\nRepository URL: \nNotes: ')}`}
              className={styles.ctaButton}
            >
              Get Started
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      ))}

      <div className={styles.faq}>
        <h2 className={styles.faqTitle}>Common Questions</h2>

        <div className={styles.faqItem}>
          <h3>How is this different from the free CLAUDE.md Writer skill?</h3>
          <p>
            The free skill guides you through writing your own CLAUDE.md. With
            this service, our team does the work — we analyze your actual
            codebase, review git history and CI config, and deliver a
            production-ready file.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>Does this use my download credits?</h3>
          <p>
            No. Services are standalone paid offerings, completely separate from
            the credit system. Your credit balance is unaffected.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>What do you need from me?</h3>
          <p>
            Access to your repository (GitHub, GitLab, or Bitbucket). We'll
            review the code, folder structure, configs, and recent git history.
            We may ask a few clarifying questions about team conventions.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>Can I request changes or updates?</h3>
          <p>
            Yes — anytime. As your codebase evolves, request updates to your
            CLAUDE.md files at no extra cost. That's the whole point of the
            subscription.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3>Can I cancel anytime?</h3>
          <p>
            Yes. Cancel whenever you want — no lock-in. Your existing CLAUDE.md
            files are yours to keep.
          </p>
        </div>
      </div>
    </div>
  );
}
