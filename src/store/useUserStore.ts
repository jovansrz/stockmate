import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { useAuthStore } from './useAuthStore';

export interface UserProfile {
  riskTolerance: string;
  investmentHorizon: string;
  investmentGoal: string;
  preferredSectors: string[];
}

interface UserState {
  balance: number;
  xp: number;
  level: number;
  streak: number;
  lastInteractionDate: string | null;
  profile: UserProfile | null;
  watchlist: string[];
  isSyncing: boolean;
  portfolio: Record<string, number>;
  setBalance: (balance: number) => void;
  addBalance: (amount: number) => Promise<void>;
  subtractBalance: (amount: number) => Promise<boolean>;
  buyStock: (ticker: string, lots: number, totalPrice: number) => Promise<boolean>;
  sellStock: (ticker: string, lots: number, totalPrice: number) => Promise<boolean>;
  addXp: (amount: number) => void;
  setProfile: (profile: UserProfile) => void;
  incrementStreak: () => void;
  interactWithModule: () => void;
  checkStreak: () => void;
  toggleWatchlist: (ticker: string) => void;
  syncFromBackend: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      balance: 10000000, // Rp 10,000,000 - default sebelum login
      xp: 0,
      level: 1,
      streak: 0,
      lastInteractionDate: null,
      profile: null,
      watchlist: [],
      isSyncing: false,
      portfolio: {},

      setBalance: (balance) => set({ balance }),

      // Sync balance to backend (PUT /user/saldo/:id)
      addBalance: async (amount) => {
        const newBalance = get().balance + amount;
        set({ balance: newBalance });

        try {
          const { user } = useAuthStore.getState();
          if (user?.id) {
            await api.put(`/user/saldo/${user.id}`, { saldo_virtual: newBalance });
          }
        } catch (error) {
          console.error('Failed to sync balance to backend:', error);
        }
      },

      subtractBalance: async (amount) => {
        const current = get().balance;
        if (current < amount) return false;

        const newBalance = current - amount;
        set({ balance: newBalance });

        try {
          const { user } = useAuthStore.getState();
          if (user?.id) {
            await api.put(`/user/saldo/${user.id}`, { saldo_virtual: newBalance });
          }
        } catch (error) {
          console.error('Failed to sync balance to backend:', error);
          // Rollback on failure
          set({ balance: current });
          return false;
        }
        return true;
      },

      buyStock: async (ticker, lots, totalPrice) => {
        const current = get().balance;
        if (current < totalPrice) return false;

        const newBalance = current - totalPrice;
        set({ balance: newBalance });

        const currentPortfolio = get().portfolio || {};
        const currentLots = currentPortfolio[ticker] || 0;
        set({ portfolio: { ...currentPortfolio, [ticker]: currentLots + lots } });

        try {
          const { user } = useAuthStore.getState();
          if (user?.id) {
            await api.put(`/user/saldo/${user.id}`, { saldo_virtual: newBalance });
          }
        } catch (error) {
          console.error('Failed to sync balance to backend:', error);
          set({ balance: current, portfolio: currentPortfolio });
          return false;
        }
        return true;
      },

      sellStock: async (ticker, lots, totalPrice) => {
        const currentPortfolio = get().portfolio || {};
        const currentLots = currentPortfolio[ticker] || 0;
        
        if (currentLots < lots) return false;

        const prevBalance = get().balance;
        const newBalance = prevBalance + totalPrice;
        set({ balance: newBalance });

        const newLots = currentLots - lots;
        const newPortfolio = { ...currentPortfolio };
        if (newLots === 0) {
          delete newPortfolio[ticker];
        } else {
          newPortfolio[ticker] = newLots;
        }
        set({ portfolio: newPortfolio });

        try {
          const { user } = useAuthStore.getState();
          if (user?.id) {
            await api.put(`/user/saldo/${user.id}`, { saldo_virtual: newBalance });
          }
        } catch (error) {
          console.error('Failed to sync balance to backend:', error);
          set({ balance: prevBalance, portfolio: currentPortfolio });
          return false;
        }
        return true;
      },

      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        const newLevel = Math.floor(newXp / 100) + 1;
        return { xp: newXp, level: newLevel };
      }),

      setProfile: (profile) => set({ profile }),
      incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),

      interactWithModule: () => set((state) => {
        // Use local timezone to get the current date
        const todayObj = new Date();
        const today = new Date(todayObj.getTime() - (todayObj.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        
        const lastDate = state.lastInteractionDate;
        
        if (!lastDate) {
          return { streak: 1, lastInteractionDate: today };
        }
        
        if (lastDate === today) {
          return { lastInteractionDate: today };
        }
        
        const lastDateObj = new Date(lastDate);
        const diffTime = Math.abs(new Date(today).getTime() - lastDateObj.getTime());
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          return { streak: state.streak + 1, lastInteractionDate: today };
        } else {
          return { streak: 1, lastInteractionDate: today };
        }
      }),

      checkStreak: () => set((state) => {
        if (!state.lastInteractionDate) return state;
        
        const todayObj = new Date();
        const today = new Date(todayObj.getTime() - (todayObj.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        const lastDate = state.lastInteractionDate;
        
        if (lastDate === today) return state;
      
        const lastDateObj = new Date(lastDate);
        const diffTime = Math.abs(new Date(today).getTime() - lastDateObj.getTime());
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1) {
          return { streak: 0 };
        }
        return state;
      }),

      toggleWatchlist: (ticker) => set((state) => {
        const alreadyIn = state.watchlist ? state.watchlist.includes(ticker) : false;
        const currentWatchlist = state.watchlist || [];
        const newWatchlist = alreadyIn
          ? currentWatchlist.filter((t) => t !== ticker)
          : [...currentWatchlist, ticker];
        return { watchlist: newWatchlist };
      }),

      // Sync user data from backend (GET /user/:username)
      syncFromBackend: async () => {
        const { user } = useAuthStore.getState();
        if (!user?.username) return;

        set({ isSyncing: true });
        try {
          const response = await api.get(`/user/${user.username}`);
          if (response.data?.success && response.data.data) {
            const backendUser = response.data.data;
            set({
              balance: backendUser.saldo_virtual ?? get().balance,
            });
          }
        } catch (error) {
          console.error('Failed to sync user data from backend:', error);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'stockmate-user-storage',
    }
  )
);
