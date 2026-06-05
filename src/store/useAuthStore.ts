import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email?: string;
  nama?: string;
  saldo_virtual: number;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  login: (token: string, user: User) => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setUser: (user) => set({ user }),
      login: (token, user) => {
        localStorage.setItem('token', token); // Menyimpan token langsung agar bisa diakses di axios interceptor saat init
        set({ token, user, isAuthenticated: true });
      },
      updateUser: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
      })),
      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false });
        window.location.href = '/login'; // Redirect to login
      },
    }),
    {
      name: 'stockmate-auth-storage',
    }
  )
);
