import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { Upvote } from '@/components/Upvote/Upvote';
import { useCollection } from '@/lib/hooks';
import styles from './CollectionDetailPage.module.scss';

export default function CollectionDetailPage() {
  const { collectionId } = useParams();
  const navigate = useNavigate();

  const { data: collectionData, isLoading } = useCollection(collectionId);

  if (isLoading) {
    return <div className={styles.notFound}><p>Loading...</p></div>;
  }

  if (!collectionData) {
    return (
      <div className={styles.notFound}>
        <p>Collection not found</p>
        <Link to="/browse">
          <Button variant="outline">Browse Skills</Button>
        </Link>
      </div>
    );
  }

  const { skills: collectionSkills, ...collection } = collectionData;

  return (
    <div className={styles.page}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className={styles.backButton}
      >
        <ArrowLeft style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
        Back
      </Button>

      {/* Collection Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{collection.title}</h1>
        <p className={styles.description}>{collection.description}</p>

        <div className={styles.meta}>
          <Link to={`/profile/${collection.author.id}`} className={styles.authorLink}>
            <img src={collection.author.avatar} alt={collection.author.name} className={styles.authorAvatar} />
            <span>{collection.author.name}</span>
          </Link>
          <span className={styles.sep}>{'\u2022'}</span>
          <span className={styles.date}>
            {new Date(collection.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Skills */}
      <div>
        <h2 className={styles.skillsCount}>
          {collectionSkills.length} {collectionSkills.length === 1 ? 'Skill' : 'Skills'}
        </h2>

        <div className={styles.skillsList}>
          {collectionSkills.map(skill => (
            <Link key={skill.id} to={`/skill/${skill.id}`} className={styles.skillCard}>
              <div className={styles.skillCardInner}>
                <img src={skill.author.avatar} alt={skill.author.name} className={styles.skillAvatar} />
                <div className={styles.skillContent}>
                  <div className={styles.skillHeader}>
                    <div className={styles.skillHeaderText}>
                      <h3 className={styles.skillTitle}>{skill.title}</h3>
                      <p className={styles.skillAuthor}>by {skill.author.name}</p>
                    </div>
                    <Badge variant="outline">{skill.domain}</Badge>
                  </div>
                  <p className={styles.skillDesc}>{skill.description}</p>
                  <div className={styles.skillFooter}>
                    <div className={styles.skillTags}>
                      {skill.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                    <div className={styles.skillMeta}>
                      <Upvote initialCount={skill.upvotes} size="sm" />
                      <span>{skill.downloads.toLocaleString()} uses</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
