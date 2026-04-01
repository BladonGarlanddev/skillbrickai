import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent } from '@/test/test-utils';
import AuthPage from './AuthPage';

vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

vi.mock('@/stores/auth.store', () => ({
  useAuthStore: vi.fn((selector) => {
    const state = {
      login: vi.fn(),
      user: null,
      isAuthenticated: false,
    };
    return selector ? selector(state) : state;
  }),
}));

describe('AuthPage', () => {
  it('renders signup mode by default', () => {
    render(<AuthPage />);
    expect(screen.getByText('Join SkillBrick AI')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  it('shows early adopter incentive in signup mode', () => {
    render(<AuthPage />);
    expect(screen.getByText('Early Adopter')).toBeInTheDocument();
    expect(screen.getByText('Start with 30 free installs')).toBeInTheDocument();
  });

  it('renders OAuth buttons', () => {
    render(<AuthPage />);
    expect(screen.getByRole('button', { name: /Continue with GitHub/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue with Google/i })).toBeInTheDocument();
  });

  it('renders email and password fields', () => {
    render(<AuthPage />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders username field in signup mode', () => {
    render(<AuthPage />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('switches to login mode', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);
    await user.click(screen.getByRole('button', { name: 'Log in' }));
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
  });

  it('hides username field in login mode', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);
    await user.click(screen.getByRole('button', { name: 'Log in' }));
    expect(screen.queryByLabelText('Username')).not.toBeInTheDocument();
  });

  it('hides early adopter incentive in login mode', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);
    await user.click(screen.getByRole('button', { name: 'Log in' }));
    expect(screen.queryByText('Early Adopter')).not.toBeInTheDocument();
  });

  it('shows forgot password in login mode', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);
    await user.click(screen.getByRole('button', { name: 'Log in' }));
    expect(screen.getByRole('button', { name: 'Forgot password?' })).toBeInTheDocument();
  });

  it('switches back to signup mode', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);
    await user.click(screen.getByRole('button', { name: 'Log in' }));
    await user.click(screen.getByRole('button', { name: 'Sign up' }));
    expect(screen.getByText('Join SkillBrick AI')).toBeInTheDocument();
  });

  it('renders password hint in signup mode', () => {
    render(<AuthPage />);
    expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
  });

  it('renders terms links in signup mode', () => {
    render(<AuthPage />);
    expect(screen.getByText(/Terms of Service/)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/)).toBeInTheDocument();
  });

  it('allows typing in form fields', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const usernameInput = screen.getByLabelText('Username');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(usernameInput, 'testuser');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(usernameInput).toHaveValue('testuser');
  });

  it('links logo to home', () => {
    render(<AuthPage />);
    const logo = screen.getByText('SkillBrick AI').closest('a');
    expect(logo).toHaveAttribute('href', '/');
  });
});
