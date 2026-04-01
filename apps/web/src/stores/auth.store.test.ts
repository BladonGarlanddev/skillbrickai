import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './auth.store';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('auth.store', () => {
  beforeEach(() => {
    localStorageMock.clear();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  });

  it('starts unauthenticated when no token in localStorage', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('login sets user, token, and isAuthenticated', () => {
    const user = { id: 'u1', username: 'test', email: 'test@test.com' };
    useAuthStore.getState().login(user, 'my-token');

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.token).toBe('my-token');
    expect(state.isAuthenticated).toBe(true);
    expect(localStorageMock.getItem('token')).toBe('my-token');
  });

  it('logout clears user, token, and isAuthenticated', () => {
    const user = { id: 'u1', username: 'test', email: 'test@test.com' };
    useAuthStore.getState().login(user, 'my-token');
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorageMock.getItem('token')).toBeNull();
  });

  it('setUser updates user without affecting token', () => {
    const user = { id: 'u1', username: 'test', email: 'test@test.com' };
    useAuthStore.getState().login(user, 'my-token');

    const updatedUser = { id: 'u1', username: 'updated', email: 'new@test.com' };
    useAuthStore.getState().setUser(updatedUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(updatedUser);
    expect(state.token).toBe('my-token');
  });
});
