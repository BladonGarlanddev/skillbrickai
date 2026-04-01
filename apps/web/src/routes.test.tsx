import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes';
import { useAuthStore } from '@/stores/auth.store';

// Mock all page components to avoid loading real pages with complex deps
vi.mock('@/pages/HomePage/HomePage', () => ({
  default: () => <div>HomePage</div>,
}));
vi.mock('@/pages/BrowsePage/BrowsePage', () => ({
  default: () => <div>BrowsePage</div>,
}));
vi.mock('@/pages/SkillDetailPage/SkillDetailPage', () => ({
  default: () => <div>SkillDetailPage</div>,
}));
vi.mock('@/pages/AuthPage/AuthPage', () => ({
  default: () => <div>AuthPage</div>,
}));
vi.mock('@/pages/AuthCallbackPage/AuthCallbackPage', () => ({
  default: () => <div>AuthCallbackPage</div>,
}));
vi.mock('@/pages/CommunityPage/CommunityPage', () => ({
  default: () => <div>CommunityPage</div>,
}));
vi.mock('@/pages/CollectionDetailPage/CollectionDetailPage', () => ({
  default: () => <div>CollectionDetailPage</div>,
}));
vi.mock('@/pages/ProfilePage/ProfilePage', () => ({
  default: () => <div>ProfilePage</div>,
}));
vi.mock('@/pages/SubmitPage/SubmitPage', () => ({
  default: () => <div>SubmitPage</div>,
}));

function renderRoute(path: string) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Routes', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  it('renders HomePage at /', () => {
    renderRoute('/');
    expect(screen.getByText('HomePage')).toBeInTheDocument();
  });

  it('renders BrowsePage at /browse', () => {
    renderRoute('/browse');
    expect(screen.getByText('BrowsePage')).toBeInTheDocument();
  });

  it('renders SkillDetailPage at /skill/:id', () => {
    renderRoute('/skill/abc');
    expect(screen.getByText('SkillDetailPage')).toBeInTheDocument();
  });

  it('renders AuthPage at /auth', () => {
    renderRoute('/auth');
    expect(screen.getByText('AuthPage')).toBeInTheDocument();
  });

  it('renders CommunityPage at /community', () => {
    renderRoute('/community');
    expect(screen.getByText('CommunityPage')).toBeInTheDocument();
  });

  it('renders CollectionDetailPage at /collection/:id', () => {
    renderRoute('/collection/col-1');
    expect(screen.getByText('CollectionDetailPage')).toBeInTheDocument();
  });

  it('redirects /profile/:id to /auth when not authenticated', () => {
    renderRoute('/profile/user-1');
    expect(screen.getByText('AuthPage')).toBeInTheDocument();
    expect(screen.queryByText('ProfilePage')).not.toBeInTheDocument();
  });

  it('redirects /submit to /auth when not authenticated', () => {
    renderRoute('/submit');
    expect(screen.getByText('AuthPage')).toBeInTheDocument();
    expect(screen.queryByText('SubmitPage')).not.toBeInTheDocument();
  });

  it('renders ProfilePage when authenticated', () => {
    useAuthStore.setState({
      user: { id: 'u1', username: 'test', email: 'test@test.com' },
      token: 'token',
      isAuthenticated: true,
    });
    renderRoute('/profile/u1');
    expect(screen.getByText('ProfilePage')).toBeInTheDocument();
  });

  it('renders SubmitPage when authenticated', () => {
    useAuthStore.setState({
      user: { id: 'u1', username: 'test', email: 'test@test.com' },
      token: 'token',
      isAuthenticated: true,
    });
    renderRoute('/submit');
    expect(screen.getByText('SubmitPage')).toBeInTheDocument();
  });

  it('renders Header on all routes', () => {
    renderRoute('/');
    expect(screen.getByText('SkillBrick AI')).toBeInTheDocument();
  });
});
