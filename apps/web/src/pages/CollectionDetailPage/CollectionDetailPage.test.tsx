import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { mockSkill, mockSkill2, mockAuthor } from '@/test/mock-data';
import CollectionDetailPage from './CollectionDetailPage';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ collectionId: 'col-1' }),
    useNavigate: () => vi.fn(),
  };
});

vi.mock('@/lib/hooks', () => ({
  useCollection: () => ({
    data: {
      id: 'col-1',
      title: 'Frontend Developer Essential Pack',
      description: 'Must-have skills for frontend development',
      author: mockAuthor,
      skillIds: ['skill-1', 'skill-2'],
      followers: 234,
      createdAt: '2026-02-15T00:00:00Z',
      skillCount: 2,
      skills: [mockSkill, mockSkill2],
    },
    isLoading: false,
  }),
}));

describe('CollectionDetailPage', () => {
  it('renders collection title', () => {
    render(<CollectionDetailPage />);
    expect(screen.getByText('Frontend Developer Essential Pack')).toBeInTheDocument();
  });

  it('renders collection description', () => {
    render(<CollectionDetailPage />);
    expect(screen.getByText('Must-have skills for frontend development')).toBeInTheDocument();
  });

  it('renders author name with link', () => {
    render(<CollectionDetailPage />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    const authorLink = screen.getByText('Jane Doe').closest('a');
    expect(authorLink).toHaveAttribute('href', '/profile/author-1');
  });

  it('renders skills count', () => {
    render(<CollectionDetailPage />);
    expect(screen.getByText('2 Skills')).toBeInTheDocument();
  });

  it('renders skill cards', () => {
    render(<CollectionDetailPage />);
    expect(screen.getByText('Empathetic Email Composition')).toBeInTheDocument();
    expect(screen.getByText('Code Review Assistant')).toBeInTheDocument();
  });

  it('links skill cards to detail pages', () => {
    render(<CollectionDetailPage />);
    const link = screen.getByText('Empathetic Email Composition').closest('a');
    expect(link).toHaveAttribute('href', '/skill/skill-1');
  });

  it('renders back button', () => {
    render(<CollectionDetailPage />);
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
  });
});
