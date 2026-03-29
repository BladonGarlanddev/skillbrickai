import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import styles from './Input.module.scss';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(styles.input, className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
