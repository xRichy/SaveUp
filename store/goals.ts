// store/goals.ts

import { create } from "zustand";

// Singolo movimento di denaro associato all'obiettivo
export type GoalTransaction = {
  id: string;
  amount: number; // positivo = deposito, negativo = prelievo
  date: string;
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

  createdAt: string;
  updatedAt: string;
  deadline?: string;
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

interface GoalsState {
  goals: Goal[];
  addGoal: (goal: Partial<Goal>) => { success: boolean; error?: string };
  removeGoal: (id: string | number) => { success: boolean; error?: string };
  updateGoal: (
    id: string | number,
    updated: Partial<Goal>
  ) => { success: boolean; error?: string };
}

export const useGoalsState = create<GoalsState>((set, get) => ({
  goals: [
    {
      id: 1,
      name: "Vacanza in Giappone",
      target: 3000,
      saved: 1250,
      emoji: "🗾",
      color: "from-purple-500 to-indigo-500",
      description: "Un viaggio dei sogni in Giappone.",
      category: { id: "travel", name: "Viaggi", emoji: "✈️", color: "blue" },
      createdAt: new Date("2025-01-01").toISOString(),
      updatedAt: new Date("2025-01-10").toISOString(),
      deadline: new Date("2025-12-31").toISOString(),
      priority: "high",
      notes: "Controllare offerte voli e hotel.",
      transactions: [
        { id: "t1", amount: 500, date: "2025-01-02", note: "Primo deposito" },
        { id: "t2", amount: 750, date: "2025-01-08", note: "Bonus stipendio" },
      ],
      status: "active",
    },
    {
      id: 2,
      name: "Nuovo MacBook Pro",
      target: 1500,
      saved: 890,
      emoji: "💻",
      color: "from-pink-500 to-red-500",
      description: "Laptop per lavoro e sviluppo.",
      category: { id: "tech", name: "Tecnologia", emoji: "🖥️", color: "gray" },
      createdAt: new Date("2025-02-01").toISOString(),
      updatedAt: new Date("2025-02-15").toISOString(),
      deadline: new Date("2025-06-01").toISOString(),
      priority: "medium",
      notes: "Aspettare eventuale uscita nuovo modello.",
      transactions: [
        { id: "t3", amount: 400, date: "2025-02-05" },
        { id: "t4", amount: 490, date: "2025-02-12" },
      ],
      status: "active",
    },
  ],

  addGoal: (goal) => {
    try {
      if (!goal.name || !goal.target || !goal.emoji) {
        return {
          success: false,
          error: "Nome, target ed emoji sono obbligatori.",
        };
      }

      const now = new Date().toISOString();

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

      const now = new Date().toISOString();

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
}));
