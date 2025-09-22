import { router } from 'expo-router';
import { Plus, Target } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GoalCard } from '@/components/goals/GoalCard';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useThemeStore } from '@/store/theme';
import { useGoalsState } from '@/store/goals';

export default function HomePage() {
  const { theme } = useThemeStore();

  const isDark = theme === 'dark';
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const { goals, addGoal } = useGoalsState();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);

  const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const overallProgress = (totalSaved / totalTarget) * 100;

  const addFoundsToGoal = (goalId: string | number) => {
    router.push(`/goals/add-transaction/${goalId}`);
  }

  return (
    <>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView className={`flex-1 ${isDark ? "bg-black" : "bg-white"}`} edges={['top']}>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        >
          {/* Header semplice */}
          <View className="mb-6">
            <Text className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              Ciao 👋
            </Text>
            <Text className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              I tuoi risparmi
            </Text>
          </View>

          {/* Totali */}
          <Card className={`mb-6 `}>
            <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Totale risparmiato
            </Text>
            <View className="flex-row justify-between items-baseline mb-3">
              <Text className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {formatCurrency(totalSaved)}
              </Text>
              <Text className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
                di {formatCurrency(totalTarget)}
              </Text>
            </View>

            <ProgressBar progress={overallProgress} height={8} />
          </Card>

          {/* Obiettivi */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              Obiettivi
            </Text>
          </View>

          {goals.length === 0 ? (
            <EmptyState
              icon="🎯"
              title="Nessun obiettivo"
              description="Crea il tuo primo obiettivo di risparmio"
              actionTitle="Crea Obiettivo"
              onAction={() => router.push('/goals/create')}
            />
          ) : (
            <View className="space-y-3">
              {goals.map(goal => (
                <GoalCard key={goal.id} goal={goal} onAddFunds={addFoundsToGoal} />
              ))}
            </View>
          )}
        </ScrollView>

      </SafeAreaView>
    </>
  );
}
