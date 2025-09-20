
// =============================================================================
// src/components/goals/GoalCard.tsx - Card per gli obiettivi
// =============================================================================

import React from 'react';
import { Text, TouchableOpacity, View, ColorValue } from 'react-native';
import { router } from 'expo-router';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { GradientButton } from '../ui/GradientButton';
import { useThemeStore } from '@/store/theme';

interface Goal {
  id: string | number;
  name: string;
  target: number;
  saved: number;
  emoji: string;
  color?: string;
  description?: string;
}

interface GoalCardProps {
  goal: Goal;
  onAddFunds?: (goalId: string | number) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onAddFunds }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);

  const progress = (goal.saved / goal.target) * 100;
  const isCompleted = progress >= 100;

  const getProgressColor = (): readonly [ColorValue, ColorValue, ...ColorValue[]] => {
    if (isCompleted) return ['#10B981', '#059669'] as const;
    if (progress > 60) return ['#8B5CF6', '#EC4899'] as const;
    if (progress > 30) return ['#F59E0B', '#EA580C'] as const;
    return ['#EF4444', '#EC4899'] as const;
  };

  return (
    <TouchableOpacity onPress={() => router.push(`/goals/${goal.id}`)} className="mb-4">
      <Card variant="elevated" className="overflow-hidden">
        {/* Header */}
        <View className="flex-row items-center mb-4">
          <View className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${goal.color} items-center justify-center shadow-md`}>
            <Text className="text-2xl">{goal.emoji}</Text>
          </View>
          
          <View className="flex-1 ml-4">
            <Text className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              {goal.name}
            </Text>
            {goal.description && (
              <Text
                className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm mt-1`}
                numberOfLines={1}
              >
                {goal.description}
              </Text>
            )}
          </View>
          
          {isCompleted && (
            <View className="bg-green-100 dark:bg-green-800 px-3 py-1 rounded-full">
              <Text className="text-green-800 dark:text-green-100 font-semibold text-xs">✓ Completato</Text>
            </View>
          )}
        </View>

        {/* Progresso */}
        <View className="mb-4">
          <View className="flex-row justify-between items-baseline mb-3">
            <Text className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              {formatCurrency(goal.saved)}
            </Text>
            <Text className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
              di {formatCurrency(goal.target)}
            </Text>
          </View>
          
          <ProgressBar 
            progress={progress}
            colors={getProgressColor()}
            height={8}
            showGlow={true}
          />
          
          <View className="flex-row justify-between items-center mt-2">
            <Text className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {progress.toFixed(1)}%
            </Text>
            <Text className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-800"}`}>
              {isCompleted ? '🎉 Obiettivo raggiunto!' : `Mancano ${formatCurrency(goal.target - goal.saved)}`}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        {!isCompleted && (
          <GradientButton
            title="+ Aggiungi Fondi"
            onPress={() => onAddFunds?.(goal.id)}
            className="w-full"
          />
        )}
      </Card>
    </TouchableOpacity>
  );
};
