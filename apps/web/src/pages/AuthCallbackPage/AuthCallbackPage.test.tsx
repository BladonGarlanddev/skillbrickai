import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthCallbackPage from './AuthCallbackPage';

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/stores/auth.store', () => ({
  useAuthStore: (selector: any) => {
    const state = { login: mockLogin };
    return selector(state);
  },
}));

function renderWithRoute(route: string) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[route]}>
        <AuthCallbackPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('AuthCallbackPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading message', () => {
    renderWithRoute('/auth/callback?token=abc');
    expect(screen.getByText('Signing you in...')).toBeInTheDocument();
  });

  it('navigates to /auth when no token is provided', () => {
    renderWithRoute('/auth/callback');
    expect(mockNavigate).toHaveBeenCalledWith('/auth');
  });

  it('decodes JWT and calls login with valid token', () => {
    // Create a fake JWT: header.payload.signature
    const payload = { sub: 'user-1', email: 'test@example.com' };
    const encoded = btoa(JSON.stringify(payload));
    const fakeToken = `header.${encoded}.signature`;

    renderWithRoute(`/auth/callback?token=${fakeToken}`);

    expect(mockLogin).toHaveBeenCalledWith(
      { id: 'user-1', email: 'test@example.com', username: 'test' },
      fakeToken,
    );
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('navigates to /auth with invalid token', () => {
    renderWithRoute('/auth/callback?token=invalid-token');
    expect(mockNavigate).toHaveBeenCalledWith('/auth');
  });
});
