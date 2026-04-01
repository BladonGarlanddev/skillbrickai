import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn (class name utility)', () => {
  it('merges string class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('handles undefined and null', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end');
  });

  it('handles empty call', () => {
    expect(cn()).toBe('');
  });

  it('handles objects', () => {
    expect(cn({ active: true, disabled: false })).toBe('active');
  });

  it('handles arrays', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c');
  });
});
