import { describe, it, expect } from 'vitest';
import { render, screen, userEvent } from '@/test/test-utils';
import { Upvote } from './Upvote';

describe('Upvote', () => {
  it('renders initial count', () => {
    render(<Upvote initialCount={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('increments count on first click', async () => {
    const user = userEvent.setup();
    render(<Upvote initialCount={10} />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('11')).toBeInTheDocument();
  });

  it('decrements count when toggled off', async () => {
    const user = userEvent.setup();
    render(<Upvote initialCount={10} />);
    const button = screen.getByRole('button');
    await user.click(button); // upvote
    expect(screen.getByText('11')).toBeInTheDocument();
    await user.click(button); // un-upvote
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('applies active class when upvoted', async () => {
    const user = userEvent.setup();
    render(<Upvote initialCount={5} />);
    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('active');
    await user.click(button);
    expect(button).toHaveClass('active');
  });

  it('renders sm size variant', () => {
    render(<Upvote initialCount={0} size="sm" />);
    expect(screen.getByRole('button')).toHaveClass('sm');
  });
});
