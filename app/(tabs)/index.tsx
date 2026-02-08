// app/(tabs)/index.tsx

import { FeaturedGoals } from '@/components/dashboard/FeaturedGoals';
import { HomeHeader } from '@/components/dashboard/HomeHeader';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { GoalCard } from '@/components/goals/GoalCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { useAuthStore } from '@/store/auth';
import { useGoalsState } from '@/store/goals';
import { useLanguage } from '@/store/language';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { goals } = useGoalsState();
  const { t } = useLanguage();

  const userName = user?.name || 'Utente';
  const greeting = t('welcome');

  // Calcoli statistiche
  const statistics = useMemo(() => {
    const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);
    const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    const completedGoals = goals.filter(goal => goal.status === 'completed').length;
    const activeGoals = goals.filter(goal => goal.status === 'active').length;

    // Obiettivo più vicino alla scadenza
    const urgentGoals = goals
      .filter(goal => goal.deadline && goal.status === 'active')
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

    // Obiettivi con maggior progresso
    const progressingGoals = goals
      .filter(goal => goal.status === 'active' && goal.saved > 0)
      .sort((a, b) => (b.saved / b.target) - (a.saved / a.target))
      .slice(0, 5);

    return {
      totalSaved,
      totalTarget,
      overallProgress,
      completedGoals,
      activeGoals,
      urgentGoal: urgentGoals[0],
      progressingGoals,
    };
  }, [goals]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);

  const addFoundsToGoal = (goalId: string | number) => {
    router.push(`/goals/add-transaction/${goalId}`);
  };

  return (
    <ScreenLayout withGradient edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-4"
      >
        <HomeHeader
          greeting={greeting}
          userName={userName}
          totalSaved={formatCurrency(statistics.totalSaved)}
          totalTarget={formatCurrency(statistics.totalTarget)}
          overallProgress={statistics.overallProgress}
        />

        {goals.length > 0 && (
          <QuickStats
            activeGoals={statistics.activeGoals}
            completedGoals={statistics.completedGoals}
            progress={statistics.overallProgress}
          />
        )}

        <FeaturedGoals
          goals={statistics.progressingGoals}
          onGoalPress={addFoundsToGoal}
        />

        {/* Lista obiettivi */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4 px-1">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              {t('allGoals')} ({goals.length})
            </Text>

            {goals.length > 0 && (
              <TouchableOpacity
                onPress={() => router.push('/create')}
                className="flex-row items-center px-3 py-1.5 rounded-full bg-purple-100 dark:bg-zinc-800"
              >
                <Plus size={16} color="#7C3AED" />
                <Text className="ml-1 text-xs font-semibold text-purple-700 dark:text-purple-400">
                  {t('newGoal')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {goals.length === 0 ? (
            <EmptyState
              icon="🎯"
              title={t('noGoals')}
              description={t('noGoalsDesc')}
              actionTitle={t('createFirstGoal')}
              onAction={() => router.push('/create')}
            />
          ) : (
            <View className="space-y-4">
              {goals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onAddFunds={addFoundsToGoal}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}