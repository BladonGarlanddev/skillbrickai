import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

function restoreUser(): { user: User | null; token: string | null } {
  const token = localStorage.getItem('token');
  if (!token) return { user: null, token: null };
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      token,
      user: { id: payload.sub, email: payload.email, username: payload.email.split('@')[0] },
    };
  } catch {
    localStorage.removeItem('token');
    return { user: null, token: null };
  }
}

const restored = restoreUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: restored.user,
  token: restored.token,
  isAuthenticated: !!restored.token,
  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  setUser: (user) => {
    set({ user });
  },
}));
