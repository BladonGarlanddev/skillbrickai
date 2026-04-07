import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { ConnectedNodes } from '@/components/ConnectedNodes/ConnectedNodes';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { useSkills, useDomains } from '@/lib/hooks';
import styles from './HomePage.module.scss';

export default function HomePage() {
  const { data: skillsData } = useSkills({ limit: 20, sortBy: 'installs' });
  const { data: domains } = useDomains();

  const allSkills = skillsData?.skills ?? [];
  const featuredSkills = allSkills.slice(0, 4);
  const trendingSkills = allSkills.slice(0, 5);

  return (
    <div className={styles.page}>
      <Helmet>
        <title>SkillBrick AI - Discover & Share AI Skills</title>
        <meta name="description" content="SkillBrick AI is a community library where humans deposit accumulated knowledge so that any AI, anywhere, can draw from it. Browse, copy, and make your agents smarter." />
        <link rel="canonical" href="https://skillbrickai.com/" />
      </Helmet>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <ConnectedNodes />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Sparkles style={{ width: '0.75rem', height: '0.75rem' }} />
            <span>A library for AI</span>
          </div>

          <h1 className={styles.heroTitle}>
            Knowledge transfer,
            <br />
            at machine scale
          </h1>

          <p className={styles.heroDescription}>
            SkillBrick AI is a community library where humans deposit accumulated knowledge
            so that any AI, anywhere, can draw from it. Browse, copy, and make your agents smarter.
          </p>

          <div className={styles.heroCta}>
            <Link to="/browse">
              <Button size="lg">
                Browse Skills
                <ArrowRight style={{ width: '1rem', height: '1rem' }} />
              </Button>
            </Link>
            <Link to="/submit">
              <Button size="lg" variant="outline">
                Contribute a Skill
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <Sparkles style={{ width: '1.25rem', height: '1.25rem', color: 'rgba(10,10,10,0.4)' }} />
          <h2 className={styles.sectionTitle}>Featured Skills</h2>
        </div>

        <div className={styles.featuredGrid}>
          {featuredSkills.map(skill => (
            <Link
              key={skill.id}
              to={`/skill/${skill.id}`}
              className={styles.featuredCard}
            >
              <div className={styles.cardHeader}>
                <img
                  src={skill.author.avatar}
                  alt={skill.author.name}
                  className={styles.avatar}
                />
                <div className={styles.cardHeaderText}>
                  <h3 className={styles.cardTitle}>{skill.title}</h3>
                  <p className={styles.cardAuthor}>by {skill.author.name}</p>
                </div>
              </div>

              <p className={styles.cardDescription}>{skill.description}</p>

              <div className={styles.cardTags}>
                {skill.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Skills */}
      <section className={styles.trending}>
        <div className={styles.sectionHeader}>
          <TrendingUp style={{ width: '1.25rem', height: '1.25rem', color: 'rgba(10,10,10,0.4)' }} />
          <h2 className={styles.sectionTitle}>Trending</h2>
        </div>

        <div className={styles.trendingList}>
          {trendingSkills.map((skill, index) => (
            <Link
              key={skill.id}
              to={`/skill/${skill.id}`}
              className={styles.trendingItem}
            >
              <div className={styles.trendingNumber}>{index + 1}</div>
              <div className={styles.trendingContent}>
                <h3 className={styles.trendingTitle}>{skill.title}</h3>
                <p className={styles.trendingDesc}>{skill.description}</p>
              </div>
              <div className={styles.trendingUses}>
                {skill.downloads.toLocaleString()} uses
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by Domain */}
      <section className={styles.domains}>
        <h2 className={styles.sectionTitle}>Browse by Domain</h2>

        <div className={styles.domainGrid}>
          {(domains ?? []).map(domain => (
            <Link
              key={domain}
              to={`/browse?domain=${encodeURIComponent(domain)}`}
              className={styles.domainCard}
            >
              <div className={styles.domainName}>{domain}</div>
              <div className={styles.domainCount}>
                {allSkills.filter(s => s.domain === domain).length} skills
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <h2 className={styles.howItWorksTitle}>How It Works</h2>

        <div className={styles.stepsGrid}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>
              <span>1</span>
            </div>
            <h3 className={styles.stepTitle}>Browse the Library</h3>
            <p className={styles.stepDesc}>
              Explore skills across domains -- from writing to code review to research synthesis.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>
              <span>2</span>
            </div>
            <h3 className={styles.stepTitle}>Copy the Prompt</h3>
            <p className={styles.stepDesc}>
              Each skill is a carefully crafted prompt. Copy it with a single click.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>
              <span>3</span>
            </div>
            <h3 className={styles.stepTitle}>Paste Into Your Agent</h3>
            <p className={styles.stepDesc}>
              Use it with Claude, ChatGPT, or any AI. Make your agent an expert instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.bottomCta}>
        <h2 className={styles.bottomCtaTitle}>Ready to supercharge your AI?</h2>
        <p className={styles.bottomCtaDesc}>
          Join a growing community of builders sharing the skills that make AI agents truly useful.
        </p>
        <div className={styles.bottomCtaActions}>
          <Link to="/browse">
            <Button size="lg">
              Get Started
              <ArrowRight style={{ width: '1rem', height: '1rem' }} />
            </Button>
          </Link>
          <Link to="/submit">
            <Button size="lg" variant="outline">
              Share Your Expertise
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>SkillBrick AI</span>
            <p className={styles.footerTagline}>Knowledge transfer, at machine scale.</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4 className={styles.footerHeading}>Product</h4>
              <Link to="/browse">Browse Skills</Link>
              <Link to="/submit">Contribute</Link>
              <Link to="/community">Community</Link>
            </div>
            <div className={styles.footerColumn}>
              <h4 className={styles.footerHeading}>Company</h4>
              <Link to="/about">About</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/privacy">Privacy</Link>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>&copy; {new Date().getFullYear()} SkillBrick AI. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
