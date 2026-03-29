import { cn } from '@/lib/utils';
import styles from './CommunityScore.module.scss';

interface CommunityScoreProps {
  score: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CommunityScore({ score, className, size = 'md' }: CommunityScoreProps) {
  return (
    <div className={cn(styles.score, styles[size], className)}>
      <span className={styles.icon}>{'\u25C6'}</span>
      <span>{score.toLocaleString()}</span>
    </div>
  );
}
