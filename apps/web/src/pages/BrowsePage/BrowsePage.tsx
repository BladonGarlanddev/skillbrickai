import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input/Input';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { useSkills, useDomains } from '@/lib/hooks';
import styles from './BrowsePage.module.scss';

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedDomain, setSelectedDomain] = useState(searchParams.get('domain') || 'all');
  const [sortBy, setSortBy] = useState<'trending' | 'newest'>('trending');

  const { data: domainsData } = useDomains();
  const domains = domainsData ?? [];

  const { data: skillsData } = useSkills({
    search: searchQuery || undefined,
    domain: selectedDomain !== 'all' ? selectedDomain : undefined,
    sortBy: sortBy === 'trending' ? 'installs' : 'newest',
    limit: 50,
  });

  const filteredSkills = skillsData?.skills ?? [];

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
    if (domain === 'all') {
      searchParams.delete('domain');
    } else {
      searchParams.set('domain', domain);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Browse AI Skills & Prompts | SkillBrick AI</title>
        <meta name="description" content="Discover AI skills and prompts across domains — coding, writing, research, education, and more. Search community-tested system prompts to make your AI agent smarter." />
        <link rel="canonical" href="https://skillbrickai.com/browse" />
        <meta property="og:title" content="Browse AI Skills & Prompts | SkillBrick AI" />
        <meta property="og:description" content="Search and discover community-tested AI system prompts across coding, writing, research, education, and more." />
        <meta property="og:url" content="https://skillbrickai.com/browse" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Browse AI Skills",
            "description": "Discover AI skills and prompts across domains. Search community-tested system prompts to make your AI agent smarter.",
            "url": "https://skillbrickai.com/browse",
            "isPartOf": { "@type": "WebSite", "name": "SkillBrick AI", "url": "https://skillbrickai.com/" },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://skillbrickai.com/" },
                { "@type": "ListItem", "position": 2, "name": "Browse Skills" }
              ]
            }
          })}
        </script>
      </Helmet>

      {/* Search Section */}
      <div className={styles.searchSection}>
        <h1 className={styles.title}>Browse Skills</h1>
        <p className={styles.subtitle}>
          Discover prompts that make AI agents smarter in specific domains
        </p>

        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <Input
            type="text"
            placeholder="Search skills, tags, or domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterHeader}>
          <h3 className={styles.filterTitle}>Filter by Domain</h3>
          <div className={styles.sortControls}>
            <span className={styles.sortLabel}>Sort by:</span>
            <Button
              variant={sortBy === 'trending' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('trending')}
            >
              Trending
            </Button>
            <Button
              variant={sortBy === 'newest' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('newest')}
            >
              Newest
            </Button>
          </div>
        </div>

        <div className={styles.domainFilters}>
          <Button
            variant={selectedDomain === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleDomainChange('all')}
          >
            All Domains
          </Button>
          {domains.map(domain => (
            <Button
              key={domain}
              variant={selectedDomain === domain ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDomainChange(domain)}
            >
              {domain}
            </Button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className={styles.resultsCount}>
        <p>
          {filteredSkills.length} {filteredSkills.length === 1 ? 'skill' : 'skills'} found
        </p>
      </div>

      {/* Skills List */}
      <div className={styles.skillsList}>
        {filteredSkills.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No skills found</p>
            <p className={styles.emptySubtitle}>Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredSkills.map(skill => (
            <Link
              key={skill.id}
              to={`/skill/${skill.id}`}
              className={styles.skillCard}
            >
              <div className={styles.skillCardInner}>
                <img
                  src={skill.author.avatar}
                  alt={skill.author.name}
                  className={styles.skillAvatar}
                />

                <div className={styles.skillContent}>
                  <div className={styles.skillHeader}>
                    <div className={styles.skillHeaderText}>
                      <h3 className={styles.skillTitle}>{skill.title}</h3>
                      <p className={styles.skillAuthor}>
                        {skill.originalAuthorName
                          ? <>originally by {skill.originalAuthorName}{skill.claimedBy ? <> &middot; claimed</> : <> &middot; <span className={styles.unclaimed}>unclaimed</span></>}</>
                          : <>by {skill.author.name}</>
                        }
                      </p>
                    </div>
                    <Badge variant="outline">{skill.domain}</Badge>
                  </div>

                  <p className={styles.skillDescription}>{skill.description}</p>

                  <div className={styles.skillFooter}>
                    <div className={styles.skillTags}>
                      {skill.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                    <div className={styles.skillUses}>
                      {skill.downloads.toLocaleString()} uses
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
