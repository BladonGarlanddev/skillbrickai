import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Copy, Check, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { Upvote } from '@/components/Upvote/Upvote';
import { useSkill } from '@/lib/hooks';
import styles from './SkillDetailPage.module.scss';

export default function SkillDetailPage() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const { data: skill, isLoading } = useSkill(skillId);

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
      setTimeout(() => setCopied(false), 2000);
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
                <span className={styles.bylineLabel}>by</span>
                <Link to={`/profile/${skill.author.id}`} className={styles.bylineAuthor}>
                  {skill.author.name}
                </Link>
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
            <Button onClick={handleCopy}>
              {copied ? (
                <>
                  <Check style={{ width: '1rem', height: '1rem' }} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy style={{ width: '1rem', height: '1rem' }} />
                  Copy Prompt
                </>
              )}
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

            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>About the Author</h3>

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
