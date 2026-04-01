import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { CommunityScore } from './CommunityScore';

describe('CommunityScore', () => {
  it('renders score value', () => {
    render(<CommunityScore score={1240} />);
    expect(screen.getByText('1,240')).toBeInTheDocument();
  });

  it('renders diamond icon', () => {
    render(<CommunityScore score={100} />);
    expect(screen.getByText('\u25C6')).toBeInTheDocument();
  });

  it('applies size class', () => {
    const { container } = render(<CommunityScore score={50} size="lg" />);
    expect(container.firstChild).toHaveClass('lg');
  });
});
