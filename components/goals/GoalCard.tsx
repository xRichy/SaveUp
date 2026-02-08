import { useLanguage } from '@/store/language';
import { useThemeStore } from '@/store/theme';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../ui/Card';
import { GradientButton } from '../ui/GradientButton';
import { ProgressBar } from '../ui/ProgressBar';

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
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);

  const progress = (goal.saved / goal.target) * 100;
  const isCompleted = progress >= 100;

  const getProgressColorClass = () => {
    if (isCompleted) return 'bg-green-500';
    if (progress > 60) return 'bg-purple-500';
    if (progress > 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <TouchableOpacity onPress={() => router.push(`/goals/${goal.id}`)} className="mb-4" activeOpacity={0.7}>
      <Card variant="elevated" className="border border-gray-100 dark:border-zinc-700">
        {/* Header */}
        <View className="flex-row items-start mb-4">
          <View className={`w-14 h-14 rounded-2xl items-center justify-center bg-gray-50 dark:bg-zinc-800`}>
            <Text className="text-2xl">{goal.emoji}</Text>
          </View>

          <View className="flex-1 ml-4">
            <View className="flex-row justify-between items-start">
              <Text className="text-lg font-bold text-gray-900 dark:text-white flex-1 mr-2" numberOfLines={1}>
                {goal.name}
              </Text>
              {isCompleted && (
                <View className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                  <Text className="text-green-700 dark:text-green-400 font-bold text-[10px] uppercase tracking-wider">{t('completed')}</Text>
                </View>
              )}
            </View>

            {goal.description && (
              <Text
                className="text-gray-500 dark:text-gray-400 text-sm mt-0.5"
                numberOfLines={1}
              >
                {goal.description}
              </Text>
            )}
          </View>
        </View>

        {/* Progresso */}
        <View className="mb-5">
          <View className="flex-row justify-between items-baseline mb-2">
            <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(goal.saved)}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-500">
              / {formatCurrency(goal.target)}
            </Text>
          </View>

          <ProgressBar
            progress={progress}
            height={8}
            className="bg-gray-100 dark:bg-zinc-700"
            fillClassName={getProgressColorClass()}
          />

          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-xs font-semibold text-gray-400 dark:text-zinc-500">
              {progress.toFixed(0)}%
            </Text>
            <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {isCompleted ? t('goalReached') : `${formatCurrency(goal.target - goal.saved)} ${t('toGo')}`}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        {!isCompleted && (
          <GradientButton
            title={t('addFunds')}
            onPress={() => onAddFunds?.(goal.id)}
            className="w-full shadow-none"
          />
        )}
      </Card>
    </TouchableOpacity>
  );
};
