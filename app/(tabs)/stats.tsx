// app/(tabs)/stats.tsx

import { StatCard } from '@/components/stats/StatCard';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Goal, useGoalsState } from '@/store/goals';
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
  StatusBar,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StatisticsScreen() {
  const { goals } = useGoalsState();
  const { theme } = useThemeStore();
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

    console.log(totalProgress)

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
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#F9FAFB'}
      />

      <SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-purple-50 via-white to-blue-50'
        }`} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          className="px-4"
        >
          {/* Header unificato con statistiche e progresso */}
          <Card className={`mt-4 mb-6 p-0 rounded-3xl overflow-hidden shadow-lg`}>
            <LinearGradient
              colors={isDark
                ? ['#7C3AED', '#3B82F6']
                : ['#8B5CF6', '#06B6D4']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-6"
            >
              <View className='p-4'>
                <Text className="text-2xl font-bold text-white mb-2">
                  Le Tue Statistiche
                </Text>
                <Text className="text-purple-100 opacity-90 mb-6">
                  Analisi completa dei tuoi progressi
                </Text>

                {/* Progresso e importi */}
                <View className="rounded-xl p-4 mb-4">
                  <ProgressBar progress={statistics.totalProgress} height={8} />
                </View>

                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-purple-100 text-sm">Risparmiato</Text>
                    <Text className="text-2xl font-bold text-white">
                      €{statistics.totalSaved.toLocaleString()}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-purple-100 text-sm">Obiettivo</Text>
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
            <Text className={`text-lg font-semibold mx-3 mb-4 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Stato Obiettivi
            </Text>

            <View className="flex-row mb-2">
              <StatCard
                title="Attivi"
                value={statistics.activeGoals.toString()}
                icon={<CheckCircle2 />}
                color="green"
              />
              <StatCard
                title="In Pausa"
                value={statistics.pausedGoals.toString()}
                icon={<Pause />}
                color="orange"
              />
            </View>
          </View>

          {/* Financial Overview */}
          <View className="mb-6">
            <Text className={`text-lg font-semibold mx-3 mb-4 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Panoramica Finanziaria
            </Text>

            <View className="flex-row mb-2">
              <StatCard
                title="Depositi Totali"
                value={`€${statistics.totalDeposits.toLocaleString()}`}
                icon={<TrendingUp />}
                color="green"
              />
              <StatCard
                title="Prelievi Totali"
                value={`€${statistics.totalWithdrawals.toLocaleString()}`}
                icon={<TrendingUp />}
                color="red"
              />
            </View>

            <View className="flex-row">
              <StatCard
                title="Media per Obiettivo"
                value={`€${Math.round(statistics.avgSavingsPerGoal).toLocaleString()}`}
                icon={<BarChart3 />}
                color="blue"
              />
              <StatCard
                title="Transazioni Totali"
                value={statistics.allTransactions.length.toString()}
                icon={<DollarSign />}
                color="purple"
              />
            </View>
          </View>

          {/* Insights */}
          {(statistics.urgentGoal || statistics.popularCategory) && (
            <View className="mb-6">
              <Text className={`text-lg font-semibold  mx-3 mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                Insights
              </Text>

              {statistics.urgentGoal && (
                <View className={`mb-4 p-4 rounded-2xl ${isDark ? 'bg-zinc-900' : 'bg-white'
                  } shadow-sm`}>
                  <View className="flex-row items-center mb-2">
                    <Clock size={20} color={isDark ? '#F59E0B' : '#D97706'} />
                    <Text className={`ml-2 font-semibold ${isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                      Obiettivo Urgente
                    </Text>
                  </View>
                  <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {statistics.urgentGoal.emoji} {statistics.urgentGoal.name}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Scadenza: {new Date(statistics.urgentGoal.deadline!).toLocaleDateString('it-IT')}
                  </Text>
                </View>
              )}

              {statistics.popularCategory && (
                <View className={`p-4 rounded-2xl ${isDark ? 'bg-zinc-900' : 'bg-white'
                  } shadow-sm`}>
                  <View className="flex-row items-center mb-2">
                    <PieChart size={20} color={isDark ? '#8B5CF6' : '#7C3AED'} />
                    <Text className={`ml-2 font-semibold ${isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                      Categoria Preferita
                    </Text>
                  </View>
                  <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {statistics.popularCategory.emoji} {statistics.popularCategory.name}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    La categoria che usi di più
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Recent Transactions Preview */}
          {statistics.allTransactions.length > 0 && (
            <View className="mb-6">
              <Text className={`text-lg mx-3 font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                Ultime Transazioni
              </Text>

              <View className={`p-4 rounded-2xl ${isDark ? 'bg-zinc-900' : 'bg-white'
                } shadow-sm`}>
                {statistics.allTransactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 3)
                  .map((transaction, index) => (
                    <View
                      key={transaction.id}
                      className={`flex-row items-center justify-between py-3 ${index < 2 ? `border-b ${isDark ? 'border-zinc-700' : 'border-gray-200'}` : ''
                        }`}
                    >
                      <View className="flex-row items-center flex-1">
                        <Text className="text-lg mr-3">{transaction.goalEmoji}</Text>
                        <View className="flex-1">
                          <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                            {transaction.goalName}
                          </Text>
                          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            {new Date(transaction.date).toLocaleDateString('it-IT')}
                          </Text>
                        </View>
                      </View>
                      <Text className={`font-bold ${transaction.amount > 0
                        ? 'text-green-500'
                        : 'text-red-500'
                        }`}>
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
              <View className={`w-24 h-24 rounded-full items-center justify-center mb-4 ${isDark ? 'bg-zinc-800' : 'bg-gray-200'
                }`}>
                <BarChart3 size={32} color={isDark ? '#6B7280' : '#9CA3AF'} />
              </View>
              <Text className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                Nessuna statistica disponibile
              </Text>
              <Text className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                Crea il tuo primo obiettivo per vedere le statistiche qui
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}