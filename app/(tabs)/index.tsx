// app/(tabs)/index.tsx

import { router } from 'expo-router';
import React, { useState, useMemo } from 'react';
import { ScrollView, StatusBar, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  TrendingUp,
  Target,
  Trophy,
  Calendar,
  ArrowRight,
  Zap,
  Star
} from 'lucide-react-native';

import { GoalCard } from '@/components/goals/GoalCard';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useGoalsState } from '@/store/goals';
import { useThemeStore } from '@/store/theme';
import { useAuthStore } from '@/store/auth';
import { GradientButton } from '@/components/ui/GradientButton';

const { width } = Dimensions.get('window');

export default function HomePage() {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const { goals } = useGoalsState();
  const isDark = theme === 'dark';

  const userName = user?.name || 'Utente';
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buongiorno';
    if (hour < 18) return 'Buon pomeriggio';
    return 'Buonasera';
  }, []);

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
      .slice(0, 3);

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
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);

  const addFoundsToGoal = (goalId: string | number) => {
    router.push(`/goals/add-transaction/${goalId}`);
  };

  // Quick stats component
  const QuickStat = ({ icon, label, value, color }: {
    icon: React.ReactElement;
    label: string;
    value: string;
    color: string;
  }) => (
    <View className="flex-1 items-center">
      <View className={`p-3 rounded-xl mb-2 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'
        }`}>
        {React.cloneElement(icon as React.ReactElement<any>, {
          size: 20,
          color: color
        })}
      </View>
      <Text className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
        {label}
      </Text>
      <Text className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'
        }`}>
        {value}
      </Text>
    </View>
  );

  return (
    <>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView className={`flex-1 ${isDark ? "bg-black" : "bg-gradient-to-br from-purple-50 via-white to-blue-50"
        }`} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          className="px-4"
        >

          {/* Header con gradiente */}
          <Card className="mt-4 mb-6 p-0 rounded-3xl overflow-hidden shadow-lg">
            <LinearGradient
              colors={isDark
                ? ['#7C3AED', '#3B82F6']
                : ['#8B5CF6', '#06B6D4']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className=""
            >

              <View className='p-4'>

                <View className="flex-row justify-between items-start mb-6">
                  <View className="flex-1">
                    <Text className="text-purple-100 text-base mb-1">
                      {greeting}
                    </Text>
                    <Text className="text-2xl font-bold text-white mb-2">
                      {userName}! 👋
                    </Text>
                    <Text className="text-purple-100 opacity-90">
                      Continua così con i tuoi obiettivi
                    </Text>
                  </View>
                </View>

                {/* Progresso principale */}
                <View className="bg-white/10 rounded-2xl p-4">
                  <View className="flex-row justify-between items-baseline mb-3">
                    <View>
                      <Text className="text-purple-100 text-sm">Totale Risparmiato</Text>
                      <Text className="text-3xl font-bold text-white">
                        {formatCurrency(statistics.totalSaved)}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-purple-200 text-sm">Obiettivo</Text>
                      <Text className="text-xl font-semibold text-white">
                        {formatCurrency(statistics.totalTarget)}
                      </Text>
                    </View>
                  </View>

                  <ProgressBar
                    progress={statistics.overallProgress}
                    height={8}
                  />

                  <Text className="text-purple-100 text-sm mt-2 text-center">
                    {Math.round(statistics.overallProgress)}% completato
                  </Text>
                </View>

              </View>

            </LinearGradient>
          </Card>

          {/* Quick Stats */}
          {goals.length > 0 && (
            <Card className="mb-6 p-4">
              <Text className={`text-base font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                Riepilogo Veloce
              </Text>

              <View className="flex-row justify-around">
                <QuickStat
                  icon={<Target />}
                  label="Attivi"
                  value={statistics.activeGoals.toString()}
                  color={isDark ? '#3B82F6' : '#2563EB'}
                />
                <QuickStat
                  icon={<Trophy />}
                  label="Completati"
                  value={statistics.completedGoals.toString()}
                  color={isDark ? '#10B981' : '#059669'}
                />
                <QuickStat
                  icon={<TrendingUp />}
                  label="Progresso"
                  value={`${Math.round(statistics.overallProgress)}%`}
                  color={isDark ? '#8B5CF6' : '#7C3AED'}
                />
              </View>
            </Card>
          )}

          {/* Obiettivo Urgente */}
          {statistics.urgentGoal && (
            <Card className="mb-6 p-4 border-l-4 border-orange-500">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <Zap size={16} color="#F59E0B" />
                    <Text className={`ml-2 font-semibold text-sm ${isDark ? 'text-orange-400' : 'text-orange-600'
                      }`}>
                      OBIETTIVO URGENTE
                    </Text>
                  </View>
                  <Text className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                    {statistics.urgentGoal.emoji} {statistics.urgentGoal.name}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    Scadenza: {new Date(statistics.urgentGoal.deadline!).toLocaleDateString('it-IT')}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => addFoundsToGoal(statistics.urgentGoal!.id)}
                  className="bg-orange-500 p-2 rounded-lg"
                >
                  <Plus size={16} color="white" />
                </TouchableOpacity>
              </View>
            </Card>
          )}

          {/* Obiettivi in evidenza */}
          {statistics.progressingGoals.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                  In Evidenza
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/stats')}
                  className="flex-row items-center"
                >
                  <Text className={`text-sm mr-1 ${isDark ? 'text-purple-400' : 'text-purple-600'
                    }`}>
                    Vedi tutto
                  </Text>
                  <ArrowRight size={16} color={isDark ? '#A855F7' : '#7C3AED'} />
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="space-x-4"
              >
                {statistics.progressingGoals.map((goal) => {
                  const progress = (goal.saved / goal.target) * 100;
                  return (
                    <TouchableOpacity
                      key={goal.id}
                      onPress={() => addFoundsToGoal(goal.id)}
                      className={`w-48 p-4 rounded-2xl mr-4 ${isDark ? 'bg-zinc-900' : 'bg-white'
                        } shadow-sm`}
                    >
                      <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-2xl">{goal.emoji}</Text>
                        <Star size={16} color="#FFD700" fill="#FFD700" />
                      </View>

                      <Text className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'
                        }`} numberOfLines={1}>
                        {goal.name}
                      </Text>

                      <Text className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        {formatCurrency(goal.saved)} di {formatCurrency(goal.target)}
                      </Text>

                      <ProgressBar progress={progress} height={6} />

                      <Text className={`text-xs mt-2 text-center ${isDark ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                        {Math.round(progress)}% completato
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Lista obiettivi */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                I Tuoi Obiettivi ({goals.length})
              </Text>

              {goals.length > 0 && (
                <TouchableOpacity
                  onPress={() => router.push('/goals/create')}
                  className={`flex-row items-center px-3 py-1 rounded-lg ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                    }`}
                >
                  <Plus size={16} color={isDark ? '#A855F7' : '#7C3AED'} />
                  <Text className={`ml-1 text-sm font-medium ${isDark ? 'text-purple-400' : 'text-purple-700'
                    }`}>
                    Nuovo
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {goals.length === 0 ? (
              <EmptyState
                icon="🎯"
                title="Nessun obiettivo"
                description="Inizia il tuo percorso di risparmio creando il primo obiettivo"
                actionTitle="Crea il Primo Obiettivo"
                onAction={() => router.push('/goals/create')}
              />
            ) : (
              <View className="space-y-3">
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
      </SafeAreaView>
    </>
  );
}