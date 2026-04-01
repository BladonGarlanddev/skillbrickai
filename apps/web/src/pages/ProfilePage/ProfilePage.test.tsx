import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { mockUserProfile, mockSkill, mockCollection } from '@/test/mock-data';
import ProfilePage from './ProfilePage';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ userId: 'author-1' }),
    useNavigate: () => vi.fn(),
  };
});

vi.mock('@/stores/auth.store', () => ({
  useAuthStore: (selector: any) => {
    const state = {
      user: { id: 'author-1', username: 'janedoe', email: 'jane@test.com' },
      isAuthenticated: true,
    };
    return selector ? selector(state) : state;
  },
}));

vi.mock('@/lib/hooks', () => ({
  useUserProfile: () => ({ data: mockUserProfile, isLoading: false }),
  useUserSkills: () => ({ data: [mockSkill] }),
  useUserCollections: () => ({ data: [mockCollection] }),
}));

describe('ProfilePage', () => {
  it('renders user name', () => {
    render(<ProfilePage />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('renders user bio', () => {
    render(<ProfilePage />);
    expect(screen.getByText('Test user bio')).toBeInTheDocument();
  });

  it('renders community score', () => {
    render(<ProfilePage />);
    expect(screen.getByText('1,240')).toBeInTheDocument();
  });

  it('shows token count for own profile', () => {
    render(<ProfilePage />);
    expect(screen.getByText('tokens available')).toBeInTheDocument();
  });

  it('renders Skills tab with skill cards', () => {
    render(<ProfilePage />);
    expect(screen.getByRole('tab', { name: 'Skills' })).toBeInTheDocument();
    expect(screen.getByText('Empathetic Email Composition')).toBeInTheDocument();
  });

  it('renders Collections tab', () => {
    render(<ProfilePage />);
    expect(screen.getByRole('tab', { name: 'Collections' })).toBeInTheDocument();
  });

  it('renders back button', () => {
    render(<ProfilePage />);
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
  });

  it('renders skill domain badge', () => {
    render(<ProfilePage />);
    expect(screen.getByText('Writing')).toBeInTheDocument();
  });
});
