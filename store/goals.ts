// store/goals.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Singolo movimento di denaro associato all'obiettivo
export type GoalTransaction = {
  id: string;
  amount: number; // positivo = deposito, negativo = prelievo
  date: Date;
  note?: string;
};

export type Goal = {
  id: string | number;
  name: string;
  target: number;
  saved: number;
  emoji: string;
  color?: string;
  description?: string;
  category?: GoalCategory;

  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
  priority: "low" | "medium" | "high";
  notes?: string;
  transactions: GoalTransaction[];
  status: "active" | "completed" | "paused" | "cancelled";
};

export type GoalCategory = {
  id: string;
  name: string;
  emoji: string;
  color: string;
};

export const GOAL_CATEGORIES: GoalCategory[] = [
  { id: "travel", name: "Viaggi", emoji: "✈️", color: "from-blue-500 to-cyan-500" },
  { id: "tech", name: "Tecnologia", emoji: "💻", color: "from-purple-500 to-indigo-500" },
  { id: "car", name: "Auto", emoji: "🚗", color: "from-green-500 to-emerald-500" },
  { id: "home", name: "Casa", emoji: "🏠", color: "from-yellow-500 to-orange-500" },
  { id: "education", name: "Formazione", emoji: "📚", color: "from-red-500 to-pink-500" },
  { id: "other", name: "Altro", emoji: "🎯", color: "from-gray-500 to-slate-500" },
];

interface GoalsState {
  goals: Goal[];
  isLoading: boolean;
  addGoal: (goal: Partial<Goal>) => { success: boolean; error?: string };
  removeGoal: (id: string | number) => { success: boolean; error?: string };
  updateGoal: (
    id: string | number,
    updated: Partial<Goal>
  ) => { success: boolean; error?: string };
  addTransaction: (
    goalId: string | number,
    transaction: Omit<GoalTransaction, 'id'>
  ) => { success: boolean; error?: string };
  removeTransaction: (
    goalId: string | number,
    transactionId: string
  ) => { success: boolean; error?: string };
}

// Adapter per AsyncStorage
const asyncStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(name);
    } catch (error) {
      console.error('Error getting item from AsyncStorage:', error);
      return null;
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      console.error('Error setting item in AsyncStorage:', error);
    }
  },

  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      console.error('Error removing item from AsyncStorage:', error);
    }
  }
};

export const useGoalsState = create<GoalsState>()(
  persist(
    (set, get) => ({
      goals: [],
      isLoading: false,

      addGoal: (goal) => {
        try {
          if (!goal.name || !goal.target || !goal.emoji) {
            return {
              success: false,
              error: "Nome, target ed emoji sono obbligatori.",
            };
          }

          const now = new Date();

          const newGoal: Goal = {
            id: Date.now(),
            name: goal.name,
            target: goal.target,
            saved: goal.saved ?? 0,
            emoji: goal.emoji,
            color: goal.color ?? "from-purple-500 to-indigo-500",
            description: goal.description ?? "",
            category: goal.category,
            createdAt: now,
            updatedAt: now,
            deadline: goal.deadline,
            priority: goal.priority ?? "medium",
            notes: goal.notes ?? "",
            transactions: [],
            status: "active",
          };

          set((state) => ({
            goals: [...state.goals, newGoal],
          }));

          console.log("Obiettivo aggiunto:", newGoal);
          console.log("Stato attuale obiettivi:", get().goals);

          return { success: true };
        } catch {
          return {
            success: false,
            error: "Errore durante l'aggiunta dell'obiettivo.",
          };
        }
      },

      removeGoal: (id) => {
        try {
          const exists = get().goals.some((goal) => goal.id === id);
          if (!exists) return { success: false, error: "Obiettivo non trovato." };

          set((state) => ({
            goals: state.goals.filter((goal) => goal.id !== id),
          }));

          return { success: true };
        } catch {
          return { success: false, error: "Errore durante la rimozione." };
        }
      },

      updateGoal: (id, updated) => {
        try {
          const exists = get().goals.some((goal) => goal.id === id);
          if (!exists) return { success: false, error: "Obiettivo non trovato." };

          const now = new Date();

          set((state) => ({
            goals: state.goals.map((goal) =>
              goal.id === id ? { ...goal, ...updated, updatedAt: now } : goal
            ),
          }));

          return { success: true };
        } catch {
          return { success: false, error: "Errore durante l'aggiornamento." };
        }
      },

      addTransaction: (goalId, transaction) => {
        try {
          const goal = get().goals.find((goal) => goal.id === goalId);
          if (!goal) return { success: false, error: "Obiettivo non trovato." };

          const newTransaction: GoalTransaction = {
            ...transaction,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          };

          const newSaved = goal.saved + transaction.amount;

          set((state) => ({
            goals: state.goals.map((goal) =>
              goal.id === goalId
                ? {
                  ...goal,
                  saved: newSaved,
                  transactions: [...goal.transactions, newTransaction],
                  updatedAt: new Date(),
                  status: newSaved >= goal.target ? "completed" : goal.status,
                }
                : goal
            ),
          }));

          return { success: true };
        } catch {
          return {
            success: false,
            error: "Errore durante l'aggiunta della transazione.",
          };
        }
      },

      removeTransaction: (goalId, transactionId) => {
        try {
          const goal = get().goals.find((goal) => goal.id === goalId);
          if (!goal) return { success: false, error: "Obiettivo non trovato." };

          const transaction = goal.transactions.find((t) => t.id === transactionId);
          if (!transaction) return { success: false, error: "Transazione non trovata." };

          const newSaved = goal.saved - transaction.amount;

          set((state) => ({
            goals: state.goals.map((goal) =>
              goal.id === goalId
                ? {
                  ...goal,
                  saved: newSaved,
                  transactions: goal.transactions.filter((t) => t.id !== transactionId),
                  updatedAt: new Date(),
                  status: newSaved < goal.target && goal.status === "completed"
                    ? "active"
                    : goal.status,
                }
                : goal
            ),
          }));

          return { success: true };
        } catch {
          return {
            success: false,
            error: "Errore durante la rimozione della transazione.",
          };
        }
      },
    }),
    {
      name: 'goals-storage', // nome della chiave nel SecureStore
      storage: createJSONStorage(() => asyncStorage),

      // Persisti solo i dati importanti
      partialize: (state) => ({
        goals: state.goals,
        // Non persistiamo isLoading perché è uno stato temporaneo
      }),

      // Callback per quando i dati vengono caricati
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            console.error('Errore nel caricamento dati dal SecureStore:', error);
          } else {
            console.log('Dati caricati con successo dal SecureStore');
            console.log('Goals caricati:', state?.goals?.length || 0);
          }
        };
      },

      // Versioning per gestire migrazioni future
      version: 1,

      // Migrazione per versioni future (opzionale)
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migrazione da versione 0 a 1
          // Esempio: aggiungere nuovi campi ai goals esistenti
          return {
            ...persistedState,
            goals: persistedState.goals?.map((goal: any) => ({
              ...goal,
              // Aggiungi nuovi campi se necessario
              status: goal.status || 'active',
            })) || [],
          };
        }
        return persistedState;
      },
    }
  )
);