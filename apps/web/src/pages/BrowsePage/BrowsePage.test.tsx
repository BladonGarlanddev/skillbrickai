import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/test/test-utils';
import { mockSkill, mockSkill2 } from '@/test/mock-data';
import BrowsePage from './BrowsePage';

vi.mock('@/lib/hooks', () => ({
  useSkills: () => ({
    data: { skills: [mockSkill, mockSkill2], meta: {} },
  }),
  useDomains: () => ({
    data: ['Writing', 'Code Review'],
  }),
}));

describe('BrowsePage', () => {
  it('renders page title', () => {
    render(<BrowsePage />);
    expect(screen.getByText('Browse Skills')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<BrowsePage />);
    expect(screen.getByPlaceholderText('Search skills, tags, or domains...')).toBeInTheDocument();
  });

  it('renders domain filter buttons', () => {
    render(<BrowsePage />);
    expect(screen.getByRole('button', { name: 'All Domains' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Writing' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Code Review' })).toBeInTheDocument();
  });

  it('renders sort controls', () => {
    render(<BrowsePage />);
    expect(screen.getByRole('button', { name: 'Trending' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Newest' })).toBeInTheDocument();
  });

  it('displays results count', () => {
    render(<BrowsePage />);
    expect(screen.getByText('2 skills found')).toBeInTheDocument();
  });

  it('renders skill cards with titles', () => {
    render(<BrowsePage />);
    expect(screen.getByText('Empathetic Email Composition')).toBeInTheDocument();
    expect(screen.getByText('Code Review Assistant')).toBeInTheDocument();
  });

  it('renders skill card with author info', () => {
    render(<BrowsePage />);
    expect(screen.getByText('by Jane Doe')).toBeInTheDocument();
  });

  it('renders skill card tags', () => {
    render(<BrowsePage />);
    expect(screen.getByText('writing')).toBeInTheDocument();
    expect(screen.getByText('communication')).toBeInTheDocument();
  });

  it('renders skill usage counts', () => {
    render(<BrowsePage />);
    expect(screen.getByText('1,234 uses')).toBeInTheDocument();
  });

  it('links skill cards to detail pages', () => {
    render(<BrowsePage />);
    const link = screen.getByText('Empathetic Email Composition').closest('a');
    expect(link).toHaveAttribute('href', '/skill/skill-1');
  });

  it('allows typing in search', async () => {
    const user = userEvent.setup();
    render(<BrowsePage />);
    const input = screen.getByPlaceholderText('Search skills, tags, or domains...');
    await user.type(input, 'email');
    expect(input).toHaveValue('email');
  });
});
