import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import HomePage from './HomePage';

vi.mock('@/lib/hooks', () => ({
  useSkills: () => ({
    data: {
      skills: [
        {
          id: 'skill-1',
          title: 'Empathetic Email Composition',
          description: 'Write professional emails',
          content: '',
          author: { id: 'a1', name: 'Jane Doe', avatar: 'https://example.com/avatar.jpg', bio: '', skillsPublished: 5 },
          tags: ['writing', 'communication'],
          domain: 'Writing',
          testedOn: [],
          downloads: 1234,
          upvotes: 42,
          createdAt: '2026-03-01T00:00:00Z',
          relatedSkills: [],
        },
        {
          id: 'skill-2',
          title: 'Code Review Assistant',
          description: 'Review code for bugs',
          content: '',
          author: { id: 'a2', name: 'John Smith', avatar: 'https://example.com/john.jpg', bio: '', skillsPublished: 3 },
          tags: ['code'],
          domain: 'Code Review',
          testedOn: [],
          downloads: 567,
          upvotes: 18,
          createdAt: '2026-03-05T00:00:00Z',
          relatedSkills: [],
        },
      ],
      meta: {},
    },
  }),
  useDomains: () => ({
    data: ['Writing', 'Code Review'],
  }),
}));

describe('HomePage', () => {
  it('renders hero section', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /Knowledge transfer,/ })).toBeInTheDocument();
  });

  it('renders Browse Skills and Contribute buttons', () => {
    render(<HomePage />);
    expect(screen.getByRole('button', { name: /Browse Skills/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Contribute a Skill/i })).toBeInTheDocument();
  });

  it('renders featured skills section', () => {
    render(<HomePage />);
    expect(screen.getByText('Featured Skills')).toBeInTheDocument();
    // Skill appears in both featured and trending
    expect(screen.getAllByText('Empathetic Email Composition').length).toBeGreaterThanOrEqual(1);
  });

  it('renders trending skills section', () => {
    render(<HomePage />);
    expect(screen.getByText('Trending')).toBeInTheDocument();
  });

  it('renders Browse by Domain section', () => {
    render(<HomePage />);
    expect(screen.getByText('Browse by Domain')).toBeInTheDocument();
  });

  it('renders How It Works section', () => {
    render(<HomePage />);
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Browse the Library')).toBeInTheDocument();
    expect(screen.getByText('Copy the Prompt')).toBeInTheDocument();
    expect(screen.getByText('Paste Into Your Agent')).toBeInTheDocument();
  });

  it('links featured skills to detail pages', () => {
    render(<HomePage />);
    const skillLinks = screen.getAllByText('Empathetic Email Composition');
    const link = skillLinks[0].closest('a');
    expect(link).toHaveAttribute('href', '/skill/skill-1');
  });

  it('links domains to browse page with filter', () => {
    render(<HomePage />);
    const domainLinks = screen.getAllByText('Writing');
    const domainCard = domainLinks.find(el => el.closest('a')?.getAttribute('href')?.includes('/browse'));
    expect(domainCard?.closest('a')).toHaveAttribute('href', '/browse?domain=Writing');
  });
});
