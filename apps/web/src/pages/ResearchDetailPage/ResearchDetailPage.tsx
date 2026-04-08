import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Bookmark, Download, ArrowLeft, ExternalLink, UserCheck, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { Upvote } from '@/components/Upvote/Upvote';
import { SuccessCheckmark } from '@/components/SuccessCheckmark/SuccessCheckmark';
import { useResearch } from '@/lib/hooks';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/api';
import styles from './ResearchDetailPage.module.scss';

export default function ResearchDetailPage() {
  const { researchId } = useParams();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);
  const [showKeyFindings, setShowKeyFindings] = useState(false);
  const user = useAuthStore((s) => s.user);

  const { data: research, isLoading, refetch } = useResearch(researchId);

  const isAttributed = !!research?.originalAuthorName;
  const isClaimed = !!research?.claimedBy;

  const handleClaim = async () => {
    if (!research) return;
    setClaiming(true);
    try {
      await api.post(`/research/${research.id}/claim`);
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to claim research');
    } finally {
      setClaiming(false);
    }
  };

  if (isLoading) {
    return <div className={styles.notFound}><p>Loading...</p></div>;
  }

  if (!research) {
    return (
      <div className={styles.notFound}>
        <p>Research not found</p>
        <Link to="/browse?type=research">
          <Button variant="outline">Browse All Research</Button>
        </Link>
      </div>
    );
  }

  const handleSaveReference = async () => {
    try {
      await api.post(`/research/${research.id}/reference`);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save reference:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([research.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${research.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.page}>
      <Helmet>
        <title>{`${research.title} | SkillBrick AI Research`}</title>
        <meta name="description" content={research.description} />
        <meta property="og:title" content={`${research.title} - Research | SkillBrick AI`} />
        <meta property="og:description" content={research.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://skillbrickai.com/research/${research.id}`} />
        <link rel="canonical" href={`https://skillbrickai.com/research/${research.id}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ScholarlyArticle",
            "name": research.title,
            "description": research.description,
            "author": {
              "@type": "Person",
              "name": research.author.name,
              "url": `https://skillbrickai.com/profile/${research.author.id}`
            },
            "datePublished": research.createdAt,
            "keywords": research.tags.join(", "),
            "genre": research.domain,
            "interactionStatistic": [
              {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/LikeAction",
                "userInteractionCount": research.upvotes
              }
            ],
            "isPartOf": {
              "@type": "WebSite",
              "name": "SkillBrick AI",
              "url": "https://skillbrickai.com/"
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://skillbrickai.com/" },
                { "@type": "ListItem", "position": 2, "name": "Browse Research", "item": "https://skillbrickai.com/browse?type=research" },
                { "@type": "ListItem", "position": 3, "name": research.title }
              ]
            }
          })}
        </script>
      </Helmet>

      <SuccessCheckmark visible={saved} label="Saved!" />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className={styles.backButton}
          >
            <ArrowLeft style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
            Back
          </Button>

          <div className={styles.researchInfo}>
            <Link to={`/profile/${research.author.id}`}>
              <img
                src={research.author.avatar}
                alt={research.author.name}
                className={styles.authorAvatar}
              />
            </Link>

            <div className={styles.researchMeta}>
              <h1 className={styles.researchTitle}>{research.title}</h1>
              <p className={styles.researchDescription}>{research.description}</p>
              <div className={styles.byline}>
                {isAttributed ? (
                  <>
                    <span className={styles.bylineLabel}>originally by</span>
                    {research.originalAuthorUrl ? (
                      <a href={research.originalAuthorUrl} target="_blank" rel="noopener noreferrer" className={styles.bylineAuthor}>
                        {research.originalAuthorName}
                        <ExternalLink style={{ width: '0.75rem', height: '0.75rem', marginLeft: '0.25rem', display: 'inline' }} />
                      </a>
                    ) : (
                      <span className={styles.bylineAuthor}>{research.originalAuthorName}</span>
                    )}
                    {isClaimed && (
                      <>
                        <span className={styles.bylineSep}>{'\u2022'}</span>
                        <span className={styles.claimedBadge}>
                          <UserCheck style={{ width: '0.75rem', height: '0.75rem' }} />
                          Claimed by <Link to={`/profile/${research.claimedBy!.id}`} className={styles.bylineAuthor}>{research.claimedBy!.username}</Link>
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <span className={styles.bylineLabel}>by</span>
                    <Link to={`/profile/${research.author.id}`} className={styles.bylineAuthor}>
                      {research.author.name}
                    </Link>
                  </>
                )}
                <span className={styles.bylineSep}>{'\u2022'}</span>
                <span className={styles.bylineDate}>
                  {new Date(research.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <Button onClick={handleSaveReference} disabled={saved}>
              <Bookmark style={{ width: '1rem', height: '1rem' }} />
              {saved ? 'Saved!' : 'Save Reference'}
            </Button>
            <Button onClick={handleDownload} variant="outline">
              <Download style={{ width: '1rem', height: '1rem' }} />
              Download
            </Button>
            <Upvote initialCount={research.upvotes} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.main}>
        <div className={styles.mainGrid}>
          {/* Content */}
          <div>
            <div className={styles.contentBox}>
              <pre className={styles.contentPre}>{research.content}</pre>
            </div>

            {research.methodology && (
              <div className={styles.collapsibleSection}>
                <button
                  className={styles.collapsibleToggle}
                  onClick={() => setShowMethodology(!showMethodology)}
                >
                  {showMethodology ? <ChevronDown style={{ width: '1rem', height: '1rem' }} /> : <ChevronRight style={{ width: '1rem', height: '1rem' }} />}
                  Methodology
                </button>
                {showMethodology && (
                  <div className={styles.collapsibleContent}>
                    {research.methodology}
                  </div>
                )}
              </div>
            )}

            {research.keyFindings && (
              <div className={styles.collapsibleSection}>
                <button
                  className={styles.collapsibleToggle}
                  onClick={() => setShowKeyFindings(!showKeyFindings)}
                >
                  {showKeyFindings ? <ChevronDown style={{ width: '1rem', height: '1rem' }} /> : <ChevronRight style={{ width: '1rem', height: '1rem' }} />}
                  Key Findings
                </button>
                {showKeyFindings && (
                  <div className={styles.collapsibleContent}>
                    {research.keyFindings}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Details</h3>

              <div className={styles.detailsList}>
                <div>
                  <div className={styles.detailLabel}>Domain</div>
                  <Badge variant="outline">{research.domain}</Badge>
                </div>

                {research.tags.length > 0 && (
                  <div>
                    <div className={styles.detailLabel}>Tags</div>
                    <div className={styles.detailTags}>
                      {research.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className={styles.detailLabel}>References</div>
                  <div className={styles.detailValue}>{research.references.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {research.sources.length > 0 && (
              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>Sources</h3>
                <div className={styles.sourcesList}>
                  {research.sources.map((source, i) => (
                    <div key={i} className={styles.sourceItem}>
                      <div className={styles.sourceTitle}>
                        {source.url ? (
                          <a href={source.url} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
                            {source.title}
                            <ExternalLink style={{ width: '0.75rem', height: '0.75rem' }} />
                          </a>
                        ) : (
                          source.title
                        )}
                      </div>
                      {source.description && (
                        <div className={styles.sourceDescription}>{source.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isAttributed && (
              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>Attribution</h3>
                <div className={styles.detailsList}>
                  <div>
                    <div className={styles.detailLabel}>Original Author</div>
                    <div className={styles.detailValue}>
                      {research.originalAuthorUrl ? (
                        <a href={research.originalAuthorUrl} target="_blank" rel="noopener noreferrer" className={styles.attributionLink}>
                          {research.originalAuthorName}
                          <ExternalLink style={{ width: '0.75rem', height: '0.75rem', marginLeft: '0.25rem' }} />
                        </a>
                      ) : (
                        research.originalAuthorName
                      )}
                    </div>
                  </div>
                  {research.sourceUrl && (
                    <div>
                      <div className={styles.detailLabel}>Source</div>
                      <a href={research.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.attributionLink}>
                        View Original
                        <ExternalLink style={{ width: '0.75rem', height: '0.75rem', marginLeft: '0.25rem' }} />
                      </a>
                    </div>
                  )}
                  <div>
                    <div className={styles.detailLabel}>Status</div>
                    {isClaimed ? (
                      <Badge variant="secondary">Claimed</Badge>
                    ) : (
                      <Badge variant="outline">Unclaimed</Badge>
                    )}
                  </div>
                </div>
                {!isClaimed && user && (
                  <Button
                    onClick={handleClaim}
                    disabled={claiming}
                    variant="outline"
                    size="sm"
                    className={styles.claimButton}
                  >
                    <UserCheck style={{ width: '0.875rem', height: '0.875rem' }} />
                    {claiming ? 'Claiming...' : 'Claim This Research'}
                  </Button>
                )}
              </div>
            )}

            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>{isAttributed ? 'Posted By' : 'About the Author'}</h3>

              <Link to={`/profile/${research.author.id}`} className={styles.authorCard}>
                <img
                  src={research.author.avatar}
                  alt={research.author.name}
                  className={styles.authorCardAvatar}
                />
                <div>
                  <div className={styles.authorCardName}>{research.author.name}</div>
                  <div className={styles.authorCardSkills}>{research.author.skillsPublished} skills</div>
                </div>
              </Link>

              <p className={styles.authorCardBio}>{research.author.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
