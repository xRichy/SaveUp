// store/auth.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean; // <-- nuovo flag

  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  setHasHydrated: (state: boolean) => void; // <-- azione per settare hydration
}

// Storage adapter per SecureStore
const authStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch (error) {
      console.error('Error getting auth data:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error('Error removing auth data:', error);
    }
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false, // default = non ancora ricaricato

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          if (email && password.length >= 6) {
            const user: User = {
              id: Date.now().toString(),
              name: email.split('@')[0],
              email,
              createdAt: new Date(),
            };

            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });

            return { success: true };
          } else {
            set({ isLoading: false });
            return { success: false, error: 'Credenziali non valide' };
          }
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'Errore durante il login' };
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const user: User = {
            id: Date.now().toString(),
            name,
            email,
            createdAt: new Date(),
          };

          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });

          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'Errore durante la registrazione' };
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      },

      updateProfile: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },

      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => authStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Quando SecureStore ha finito di ricaricare i dati
        state?.setHasHydrated(true);
      },
    }
  )
);
