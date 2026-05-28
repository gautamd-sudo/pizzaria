import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setSession: (user: User, token: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  accessToken: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  setSession: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', token);
    set({ user, accessToken: token, isAuthenticated: true });
  },
  clearSession: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
