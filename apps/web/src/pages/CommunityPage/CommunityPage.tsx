import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { CommunityScore } from '@/components/CommunityScore/CommunityScore';
import { BadgeDisplay } from '@/components/BadgeDisplay/BadgeDisplay';
import { Upvote } from '@/components/Upvote/Upvote';
import { usePosts, useRequests, useShowcases, useSkills } from '@/lib/hooks';
import type { BadgeType } from '@/data/community-data';
import styles from './CommunityPage.module.scss';

type PostType = 'all' | 'discussion' | 'request' | 'showcase';
type CategoryFilter = 'all' | 'general' | 'help' | 'ideas' | 'show-tell';

export default function CommunityPage() {
  const [postType, setPostType] = useState<PostType>('all');
  const [category, setCategory] = useState<CategoryFilter>('all');

  const { data: discussionPosts } = usePosts();
  const { data: skillRequests } = useRequests();
  const { data: showcaseList } = useShowcases();
  const { data: skillsData } = useSkills({ limit: 100 });

  const skills = skillsData?.skills ?? [];

  const allPosts = [
    ...(discussionPosts ?? []).map(p => ({ ...p, type: 'discussion' as const })),
    ...(skillRequests ?? []).map(r => ({ ...r, type: 'request' as const, category: 'help' as const })),
    ...(showcaseList ?? []).map(s => ({ ...s, type: 'showcase' as const, category: 'show-tell' as const }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredPosts = allPosts.filter(post => {
    if (postType !== 'all' && post.type !== postType) return false;
    if (category !== 'all' && post.category !== category) return false;
    return true;
  });

  const categoryLabels: Record<string, string> = {
    'general': 'General',
    'help': 'Help',
    'ideas': 'Ideas',
    'show-tell': 'Show & Tell'
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Community</h1>
          <p className={styles.subtitle}>
            Discuss skills, request new ones, and share what you've built
          </p>
        </div>
        <Button>
          <Plus style={{ width: '1rem', height: '1rem' }} />
          New Post
        </Button>
      </div>

      {/* Post Type Filter */}
      <div className={styles.postTypeFilters}>
        {(['all', 'discussion', 'request', 'showcase'] as PostType[]).map(type => (
          <Button
            key={type}
            variant={postType === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPostType(type)}
          >
            {type === 'all' ? 'All' : type === 'discussion' ? 'Discussions' : type === 'request' ? 'Requests' : 'Showcase'}
          </Button>
        ))}
      </div>

      {/* Category Filter */}
      <div className={styles.categoryFilters}>
        <div className={styles.categoryLabel}>Category:</div>
        {(['all', 'general', 'help', 'ideas', 'show-tell'] as CategoryFilter[]).map(cat => (
          <Button
            key={cat}
            variant={category === cat ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setCategory(cat)}
          >
            {cat === 'all' ? 'All' : categoryLabels[cat]}
          </Button>
        ))}
      </div>

      {/* Feed */}
      <div className={styles.feed}>
        {filteredPosts.map((post, index) => {
          const key = `${post.type}-${post.id || index}`;
          return (
            <div key={key} className={styles.feedCard}>
              <div className={styles.feedCardInner}>
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className={styles.feedAvatar}
                />
                <div className={styles.feedContent}>
                  <div className={styles.feedTitleRow}>
                    <h3 className={styles.feedTitle}>{post.title}</h3>
                    {post.type === 'request' && (post as any).status === 'fulfilled' && (
                      <span className={styles.fulfilledBadge}>Fulfilled</span>
                    )}
                  </div>

                  <div className={styles.feedMeta}>
                    <span className={styles.feedAuthorName}>{post.author.name}</span>
                    <CommunityScore score={post.author.communityScore} size="sm" />
                    {post.author.badges.length > 0 && (
                      <BadgeDisplay badgeId={post.author.badges[0] as BadgeType} />
                    )}
                  </div>

                  <p className={styles.feedPreview}>
                    {post.type === 'discussion' || post.type === 'request'
                      ? (post as any).content || (post as any).description
                      : (post as any).description}
                  </p>

                  {post.type === 'showcase' && (post as any).skillsUsed && (
                    <div className={styles.showcaseSkills}>
                      {skills
                        .filter(s => (post as any).skillsUsed.includes(s.id))
                        .slice(0, 3)
                        .map(skill => (
                          <Badge key={skill.id} variant="secondary">{skill.title}</Badge>
                        ))}
                    </div>
                  )}

                  <div className={styles.feedFooter}>
                    <Badge variant="secondary">{categoryLabels[post.category] || post.category}</Badge>

                    {(post.type === 'discussion' || post.type === 'request') && (
                      <div className={styles.feedReplyCount}>
                        <MessageSquare style={{ width: '0.875rem', height: '0.875rem' }} />
                        <span>{(post as any).replyCount ?? (post as any).replies?.length ?? 0}</span>
                      </div>
                    )}

                    {post.type === 'request' && (
                      <Badge variant="outline">{(post as any).domain}</Badge>
                    )}

                    {(post.type === 'discussion' || post.type === 'showcase') && (
                      <Upvote initialCount={(post as any).upvotes} size="sm" />
                    )}

                    <span className={styles.feedDate}>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredPosts.length === 0 && (
          <div className={styles.empty}>No posts found</div>
        )}
      </div>
    </div>
  );
}
