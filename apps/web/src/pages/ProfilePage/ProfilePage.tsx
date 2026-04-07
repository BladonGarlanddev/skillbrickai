import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { CommunityScore } from '@/components/CommunityScore/CommunityScore';
import type { BadgeType } from '@/data/community-data';
import { BadgeShelf } from '@/components/BadgeDisplay/BadgeDisplay';
import { Upvote } from '@/components/Upvote/Upvote';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs/Tabs';
import { useUserProfile, useUserSkills, useUserCollections } from '@/lib/hooks';
import { useAuthStore } from '@/stores/auth.store';
import styles from './ProfilePage.module.scss';

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.user);
  const isOwnProfile = authUser?.id === userId;

  const { data: user, isLoading } = useUserProfile(userId);
  const { data: userSkills } = useUserSkills(userId);
  const { data: userCollections } = useUserCollections(userId);

  if (isLoading || !user) {
    return <div className={styles.page}><p>Loading...</p></div>;
  }

  return (
    <div className={styles.page}>
      <Helmet>
        <title>{`${user.name} | SkillBrick AI`}</title>
        <meta name="description" content={user.bio || `View ${user.name}'s profile and published AI skills on SkillBrick AI.`} />
        <meta property="og:title" content={`${user.name} | SkillBrick AI`} />
        <meta property="og:description" content={user.bio || `View ${user.name}'s profile and published AI skills on SkillBrick AI.`} />
      </Helmet>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className={styles.backButton}
      >
        <ArrowLeft style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
        Back
      </Button>

      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <img src={user.avatar} alt={user.name} className={styles.profileAvatar} />
        <div className={styles.profileInfo}>
          <h1 className={styles.profileName}>{user.name}</h1>
          <p className={styles.profileBio}>{user.bio}</p>
          <div className={styles.profileScore}>
            <CommunityScore score={user.communityScore} size="lg" />
          </div>
          <div className={styles.profileBadges}>
            <BadgeShelf badgeIds={user.badges as BadgeType[]} />
          </div>
          {isOwnProfile && (
            <div className={styles.profileTokens}>
              <span className={styles.tokenCount}>{user.tokens}</span> tokens available
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="skills">
        <TabsList>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          {!userSkills || userSkills.length === 0 ? (
            <div className={styles.empty}>No skills published yet</div>
          ) : (
            <div className={styles.skillsList}>
              {userSkills.map(skill => (
                <Link key={skill.id} to={`/skill/${skill.id}`} className={styles.skillCard}>
                  <div className={styles.skillCardHeader}>
                    <h3 className={styles.skillCardTitle}>{skill.title}</h3>
                    <Badge variant="outline">{skill.domain}</Badge>
                  </div>
                  <p className={styles.skillCardDesc}>{skill.description}</p>
                  <div className={styles.skillCardFooter}>
                    <div className={styles.skillCardTags}>
                      {skill.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                    <div className={styles.skillCardMeta}>
                      <Upvote initialCount={skill.upvotes} size="sm" />
                      <span>{skill.downloads.toLocaleString()} uses</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collections">
          {!userCollections || userCollections.length === 0 ? (
            <div className={styles.empty}>No collections created yet</div>
          ) : (
            <div className={styles.collectionsList}>
              {userCollections.map(collection => (
                <Link key={collection.id} to={`/collection/${collection.id}`} className={styles.collectionCard}>
                  <h3 className={styles.collectionTitle}>{collection.title}</h3>
                  <p className={styles.collectionDesc}>{collection.description}</p>
                  <div className={styles.collectionMeta}>
                    <span>{collection.skillCount} skills</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
