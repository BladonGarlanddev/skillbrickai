import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/test/test-utils';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Writing</Badge>);
    expect(screen.getByText('Writing')).toBeInTheDocument();
  });

  it('applies default variant', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default')).toHaveClass('default');
  });

  it('applies secondary variant', () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary')).toHaveClass('secondary');
  });

  it('applies outline variant', () => {
    render(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline')).toHaveClass('outline');
  });

  it('passes through onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Badge onClick={onClick}>Clickable</Badge>);
    await user.click(screen.getByText('Clickable'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
