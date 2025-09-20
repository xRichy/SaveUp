import { create } from "zustand";

export type Goal = {
  id: string | number;
  name: string;
  target: number;
  category?: GoalCategory;
  saved: number;
  emoji: string;
  color?: string;
  description?: string;
};

export type GoalCategory ={
    id:string;
    name:string;
    emoji:string;
    color:string;
}

interface GoalsState {
  goals: Goal[];
  addGoal: (goal: Partial<Goal>) => { success: boolean; error?: string };
  removeGoal: (id: string | number) => { success: boolean; error?: string };
  updateGoal: (id: string | number, updated: Partial<Goal>) => { success: boolean; error?: string };
}

export const useGoalsState = create<GoalsState>((set, get) => ({
  goals: [
{ id: 1, name: "Vacanza in Giappone", target: 3000, saved: 1250, emoji: "🗾"},
    { id: 2, name: "Nuovo MacBook Pro", target: 1500, saved: 890, emoji: "💻" },
  ],

  addGoal: (goal) => {
    try {
      if (!goal.name || !goal.target || !goal.emoji) {
        return { success: false, error: "Nome, target ed emoji sono obbligatori." };
      }

      const newGoal: Goal = {
        id: Date.now(),
        name: goal.name,
        target: goal.target,
        saved: goal.saved ?? 0,
        emoji: goal.emoji,
        color: goal.color ?? "from-purple-500 to-indigo-500",
        description: goal.description ?? "",
      };

      set((state) => ({
        goals: [...state.goals, newGoal],
      }));

      return { success: true };
    } catch (err) {
      return { success: false, error: "Errore durante l'aggiunta dell'obiettivo." };
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
      return { success: false, error: "Errore durante la rimozione dell'obiettivo." };
    }
  },

  updateGoal: (id, updated) => {
    try {
      const exists = get().goals.some((goal) => goal.id === id);
      if (!exists) return { success: false, error: "Obiettivo non trovato." };

      set((state) => ({
        goals: state.goals.map((goal) =>
          goal.id === id ? { ...goal, ...updated } : goal
        ),
      }));

      return { success: true };
    } catch {
      return { success: false, error: "Errore durante l'aggiornamento dell'obiettivo." };
    }
  },
}));
