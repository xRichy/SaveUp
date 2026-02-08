import { StatCard } from '@/components/stats/StatCard';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { Goal, useGoalsState } from '@/store/goals';
import { useLanguage } from '@/store/language';
import { useThemeStore } from '@/store/theme';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  DollarSign,
  Pause,
  PieChart,
  TrendingUp
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  ScrollView,
  Text,
  View
} from 'react-native';

export default function StatisticsScreen() {
  const { goals } = useGoalsState();
  const { theme } = useThemeStore();
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  // Calcoli statistiche principali
  const statistics = useMemo(() => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => goal.status === 'completed').length;
    const activeGoals = goals.filter(goal => goal.status === 'active').length;
    const pausedGoals = goals.filter(goal => goal.status === 'paused').length;
    const cancelledGoals = goals.filter(goal => goal.status === 'cancelled').length;

    const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
    const totalSaved = goals.reduce((sum, goal) => sum + goal.saved, 0);
    const totalProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    // Transazioni totali
    const allTransactions = goals.flatMap(goal =>
      goal.transactions.map(transaction => ({
        ...transaction,
        goalName: goal.name,
        goalEmoji: goal.emoji
      }))
    );

    const totalDeposits = allTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdrawals = Math.abs(allTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0));

    // Media risparmi per obiettivo
    const avgSavingsPerGoal = totalGoals > 0 ? totalSaved / totalGoals : 0;

    // Obiettivo più vicino alla scadenza
    const goalsWithDeadlines = goals.filter(goal =>
      goal.deadline && goal.status === 'active'
    );

    const urgentGoal = goalsWithDeadlines.reduce((urgent, current) => {
      if (!urgent) return current;
      return new Date(current.deadline!) < new Date(urgent.deadline!) ? current : urgent;
    }, null as Goal | null);

    // Categoria più popolare
    const categoryCounts = goals.reduce((acc, goal) => {
      if (goal.category) {
        acc[goal.category.id] = (acc[goal.category.id] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const mostPopularCategory = Object.entries(categoryCounts).reduce(
      (max, [categoryId, count]) => count > max.count ? { categoryId, count } : max,
      { categoryId: '', count: 0 }
    );

    const popularCategory = goals.find(goal =>
      goal.category?.id === mostPopularCategory.categoryId
    )?.category;

    return {
      totalGoals,
      completedGoals,
      activeGoals,
      pausedGoals,
      cancelledGoals,
      totalTarget,
      totalSaved,
      totalProgress,
      allTransactions,
      totalDeposits,
      totalWithdrawals,
      avgSavingsPerGoal,
      urgentGoal,
      popularCategory,
      completionRate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0
    };
  }, [goals]);

  return (
    <ScreenLayout withGradient edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-4"
      >
        {/* Header unificato con statistiche e progresso */}
        <Card className="mt-4 mb-6 p-0 rounded-3xl overflow-hidden shadow-lg border-0">
          <LinearGradient
            colors={['#7C3AED', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-6 rounded-2xl"
          >
            <View>
              <Text className="text-2xl font-bold text-white mb-2">
                {t('statistics')}
              </Text>
              <Text className="text-purple-100 opacity-90 mb-6">
                {t('statsSubtitle')}
              </Text>

              {/* Progresso e importi */}
              <View className="rounded-xl p-4 mb-4 bg-white/10 border border-white/10">
                <ProgressBar
                  progress={statistics.totalProgress}
                  height={8}
                  className="bg-black/20"
                  fillClassName="bg-white"
                />
              </View>

              <View className="flex-row justify-between">
                <View>
                  <Text className="text-purple-100 text-sm">{t('savedLabel')}</Text>
                  <Text className="text-2xl font-bold text-white">
                    €{statistics.totalSaved.toLocaleString()}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-purple-100 text-sm">{t('targetLabel')}</Text>
                  <Text className="text-2xl font-bold text-white">
                    €{statistics.totalTarget.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

          </LinearGradient>
        </Card>

        {/* Status Breakdown */}
        <View className="mb-6 mt-3">
          <Text className="text-lg font-semibold mx-3 mb-4 text-gray-900 dark:text-white">
            {t('goalsStatus')}
          </Text>

          <View className="flex-row mb-2">
            <View className="flex-1 mr-2">
              <StatCard
                title={t('active')}
                value={statistics.activeGoals.toString()}
                icon={<CheckCircle2 />}
                color="green"
              />
            </View>
            <View className="flex-1 ml-2">
              <StatCard
                title={t('paused')}
                value={statistics.pausedGoals.toString()}
                icon={<Pause />}
                color="orange"
              />
            </View>
          </View>
        </View>

        {/* Financial Overview */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mx-3 mb-4 text-gray-900 dark:text-white">
            {t('financialOverview')}
          </Text>

          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <StatCard
                title={t('totalDeposits')}
                value={`€${statistics.totalDeposits.toLocaleString()}`}
                icon={<TrendingUp />}
                color="green"
              />
            </View>
            <View className="flex-1 ml-2">
              <StatCard
                title={t('totalWithdrawals')}
                value={`€${statistics.totalWithdrawals.toLocaleString()}`}
                icon={<TrendingUp />}
                color="red"
              />
            </View>
          </View>

          <View className="flex-row">
            <View className="flex-1 mr-2">
              <StatCard
                title={t('avgPerGoal')}
                value={`€${Math.round(statistics.avgSavingsPerGoal).toLocaleString()}`}
                icon={<BarChart3 />}
                color="blue"
              />
            </View>
            <View className="flex-1 ml-2">
              <StatCard
                title={t('transactions')}
                value={statistics.allTransactions.length.toString()}
                icon={<DollarSign />}
                color="purple"
              />
            </View>
          </View>
        </View>

        {/* Insights */}
        {(statistics.urgentGoal || statistics.popularCategory) && (
          <View className="mb-6">
            <Text className="text-lg font-semibold mx-3 mb-4 text-gray-900 dark:text-white">
              {t('insights')}
            </Text>

            {statistics.urgentGoal && (
              <View className="mb-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-gray-100 dark:border-zinc-800">
                <View className="flex-row items-center mb-2">
                  <Clock size={20} className="text-orange-500" color="#F97316" />
                  <Text className="ml-2 font-semibold text-gray-900 dark:text-white">
                    {t('urgentGoalLabel')}
                  </Text>
                </View>
                <Text className="text-gray-700 dark:text-gray-300 font-medium">
                  {statistics.urgentGoal.emoji} {statistics.urgentGoal.name}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('deadline')}: {new Date(statistics.urgentGoal.deadline!).toLocaleDateString('it-IT')}
                </Text>
              </View>
            )}

            {statistics.popularCategory && (
              <View className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-gray-100 dark:border-zinc-800">
                <View className="flex-row items-center mb-2">
                  <PieChart size={20} className="text-purple-500" color="#8B5CF6" />
                  <Text className="ml-2 font-semibold text-gray-900 dark:text-white">
                    {t('favoriteCategory')}
                  </Text>
                </View>
                <Text className="text-gray-700 dark:text-gray-300 font-medium">
                  {statistics.popularCategory.emoji} {statistics.popularCategory.name}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('mostUsedCategory')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Recent Transactions Preview */}
        {statistics.allTransactions.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg mx-3 font-semibold mb-4 text-gray-900 dark:text-white">
              {t('recentTransactions')}
            </Text>

            <View className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-gray-100 dark:border-zinc-800">
              {statistics.allTransactions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 3)
                .map((transaction, index) => (
                  <View
                    key={transaction.id}
                    className={`flex-row items-center justify-between py-3 ${index < 2 ? 'border-b border-gray-100 dark:border-zinc-800' : ''}`}
                  >
                    <View className="flex-row items-center flex-1">
                      <Text className="text-2xl mr-3">{transaction.goalEmoji}</Text>
                      <View className="flex-1">
                        <Text className="font-medium text-gray-900 dark:text-white">
                          {transaction.goalName}
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(transaction.date).toLocaleDateString('it-IT')}
                        </Text>
                      </View>
                    </View>
                    <Text className={`font-bold ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.amount > 0 ? '+' : ''}€{transaction.amount.toLocaleString()}
                    </Text>
                  </View>
                ))
              }
            </View>
          </View>
        )}

        {/* Empty State */}
        {statistics.totalGoals === 0 && (
          <View className="items-center justify-center py-12">
            <View className="w-24 h-24 rounded-full items-center justify-center mb-4 bg-gray-100 dark:bg-zinc-800">
              <BarChart3 size={32} className="text-gray-400" color="#9CA3AF" />
            </View>
            <Text className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              {t('noStats')}
            </Text>
            <Text className="text-center text-gray-500 dark:text-gray-400">
              {t('createFirstGoalStats')}
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}