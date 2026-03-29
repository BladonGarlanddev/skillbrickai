import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import styles from './Badge.module.scss';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline';
  children: ReactNode;
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(styles.badge, styles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
