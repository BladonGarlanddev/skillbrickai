import { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './Upvote.module.scss';

interface UpvoteProps {
  initialCount: number;
  className?: string;
  size?: 'sm' | 'md';
}

export function Upvote({ initialCount, className, size = 'md' }: UpvoteProps) {
  const [upvoted, setUpvoted] = useState(false);
  const [count, setCount] = useState(initialCount);

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (upvoted) {
      setUpvoted(false);
      setCount(count - 1);
    } else {
      setUpvoted(true);
      setCount(count + 1);
    }
  };

  return (
    <button
      onClick={handleUpvote}
      className={cn(
        styles.upvote,
        styles[size],
        upvoted && styles.active,
        className
      )}
    >
      <ChevronUp className={styles.icon} />
      <span>{count}</span>
    </button>
  );
}
