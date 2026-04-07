import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Copy, Download, ArrowLeft, ExternalLink, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { Upvote } from '@/components/Upvote/Upvote';
import { SuccessCheckmark } from '@/components/SuccessCheckmark/SuccessCheckmark';
import { useSkill } from '@/lib/hooks';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/api';
import styles from './SkillDetailPage.module.scss';

export default function SkillDetailPage() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const user = useAuthStore((s) => s.user);

  const { data: skill, isLoading, refetch } = useSkill(skillId);

  const isAttributed = !!skill?.originalAuthorName;
  const isClaimed = !!skill?.claimedBy;

  const handleClaim = async () => {
    if (!skill) return;
    setClaiming(true);
    try {
      await api.post(`/skills/${skill.id}/claim`);
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to claim skill');
    } finally {
      setClaiming(false);
    }
  };

  if (isLoading) {
    return <div className={styles.notFound}><p>Loading...</p></div>;
  }

  if (!skill) {
    return (
      <div className={styles.notFound}>
        <p>Skill not found</p>
        <Link to="/browse">
          <Button variant="outline">Browse All Skills</Button>
        </Link>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(skill.content);
      setCopied(true);
      setTimeout(() => navigate('/browse'), 1400);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([skill.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${skill.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.page}>
      <Helmet>
        <title>{`${skill.title} | SkillBrick AI`}</title>
        <meta name="description" content={skill.description} />
        <meta property="og:title" content={`${skill.title} - AI Skill | SkillBrick AI`} />
        <meta property="og:description" content={skill.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://skillbrickai.com/skill/${skill.id}`} />
        <meta property="article:author" content={skill.author.name} />
        <meta property="article:section" content={skill.domain} />
        <link rel="canonical" href={`https://skillbrickai.com/skill/${skill.id}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": skill.title,
            "description": skill.description,
            "author": {
              "@type": "Person",
              "name": skill.author.name,
              "url": `https://skillbrickai.com/profile/${skill.author.id}`
            },
            "datePublished": skill.createdAt,
            "keywords": skill.tags.join(", "),
            "genre": skill.domain,
            "interactionStatistic": [
              {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/LikeAction",
                "userInteractionCount": skill.upvotes
              },
              {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/DownloadAction",
                "userInteractionCount": skill.downloads
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
                { "@type": "ListItem", "position": 2, "name": "Browse Skills", "item": "https://skillbrickai.com/browse" },
                { "@type": "ListItem", "position": 3, "name": skill.title }
              ]
            }
          })}
        </script>
      </Helmet>

      <SuccessCheckmark visible={copied} label="Copied!" />

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

          <div className={styles.skillInfo}>
            <Link to={`/profile/${skill.author.id}`}>
              <img
                src={skill.author.avatar}
                alt={skill.author.name}
                className={styles.authorAvatar}
              />
            </Link>

            <div className={styles.skillMeta}>
              <h1 className={styles.skillTitle}>{skill.title}</h1>
              <p className={styles.skillDescription}>{skill.description}</p>
              <div className={styles.skillByline}>
                {isAttributed ? (
                  <>
                    <span className={styles.bylineLabel}>originally by</span>
                    {skill.originalAuthorUrl ? (
                      <a href={skill.originalAuthorUrl} target="_blank" rel="noopener noreferrer" className={styles.bylineAuthor}>
                        {skill.originalAuthorName}
                        <ExternalLink style={{ width: '0.75rem', height: '0.75rem', marginLeft: '0.25rem', display: 'inline' }} />
                      </a>
                    ) : (
                      <span className={styles.bylineAuthor}>{skill.originalAuthorName}</span>
                    )}
                    {isClaimed && (
                      <>
                        <span className={styles.bylineSep}>{'\u2022'}</span>
                        <span className={styles.claimedBadge}>
                          <UserCheck style={{ width: '0.75rem', height: '0.75rem' }} />
                          Claimed by <Link to={`/profile/${skill.claimedBy!.id}`} className={styles.bylineAuthor}>{skill.claimedBy!.username}</Link>
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <span className={styles.bylineLabel}>by</span>
                    <Link to={`/profile/${skill.author.id}`} className={styles.bylineAuthor}>
                      {skill.author.name}
                    </Link>
                  </>
                )}
                <span className={styles.bylineSep}>{'\u2022'}</span>
                <span className={styles.bylineDate}>
                  {new Date(skill.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <Button onClick={handleCopy} disabled={copied}>
              <Copy style={{ width: '1rem', height: '1rem' }} />
              Copy Prompt
            </Button>
            <Button onClick={handleDownload} variant="outline">
              <Download style={{ width: '1rem', height: '1rem' }} />
              Download
            </Button>
            <Upvote initialCount={skill.upvotes} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.main}>
        <div className={styles.mainGrid}>
          {/* Content */}
          <div className={styles.content}>
            <div className={styles.contentBox}>
              <pre className={styles.contentPre}>{skill.content}</pre>
            </div>

            <div className={styles.suggestLink}>
              <button>Suggest an Improvement</button>
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Details</h3>

              <div className={styles.detailsList}>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Domain</div>
                  <Badge variant="outline">{skill.domain}</Badge>
                </div>

                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Tags</div>
                  <div className={styles.detailTags}>
                    {skill.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Tested on</div>
                  <div className={styles.testedOnList}>
                    {skill.testedOn.map(model => (
                      <div key={model} className={styles.testedOnItem}>{model}</div>
                    ))}
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Uses</div>
                  <div className={styles.detailValue}>{skill.downloads.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {isAttributed && (
              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>Attribution</h3>
                <div className={styles.detailsList}>
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>Original Author</div>
                    <div className={styles.detailValue}>
                      {skill.originalAuthorUrl ? (
                        <a href={skill.originalAuthorUrl} target="_blank" rel="noopener noreferrer" className={styles.attributionLink}>
                          {skill.originalAuthorName}
                          <ExternalLink style={{ width: '0.75rem', height: '0.75rem', marginLeft: '0.25rem' }} />
                        </a>
                      ) : (
                        skill.originalAuthorName
                      )}
                    </div>
                  </div>
                  {skill.sourceUrl && (
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Source</div>
                      <a href={skill.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.attributionLink}>
                        View Original
                        <ExternalLink style={{ width: '0.75rem', height: '0.75rem', marginLeft: '0.25rem' }} />
                      </a>
                    </div>
                  )}
                  <div className={styles.detailItem}>
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
                    {claiming ? 'Claiming...' : 'Claim This Skill'}
                  </Button>
                )}
              </div>
            )}

            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>{isAttributed ? 'Posted By' : 'About the Author'}</h3>

              <Link to={`/profile/${skill.author.id}`} className={styles.authorCard}>
                <img
                  src={skill.author.avatar}
                  alt={skill.author.name}
                  className={styles.authorCardAvatar}
                />
                <div>
                  <div className={styles.authorCardName}>{skill.author.name}</div>
                  <div className={styles.authorCardSkills}>{skill.author.skillsPublished} skills</div>
                </div>
              </Link>

              <p className={styles.authorCardBio}>{skill.author.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
