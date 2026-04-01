import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Header } from './Header';
import { useAuthStore } from '@/stores/auth.store';

describe('Header', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  });

  it('renders logo with link to home', () => {
    render(<Header />);
    expect(screen.getByText('SkillBrick AI')).toBeInTheDocument();
    expect(screen.getByText('SkillBrick AI').closest('a')).toHaveAttribute('href', '/');
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: 'Browse' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Community' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Contribute' })).toBeInTheDocument();
  });

  it('shows Log In button when not authenticated', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
  });

  it('shows user icon when authenticated', () => {
    useAuthStore.setState({
      user: { id: 'u1', username: 'testuser', email: 'test@test.com' },
      token: 'fake-token',
      isAuthenticated: true,
    });
    render(<Header />);
    expect(screen.queryByRole('button', { name: 'Log In' })).not.toBeInTheDocument();
  });
});
