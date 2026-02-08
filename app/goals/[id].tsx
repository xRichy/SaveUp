import { Card } from "@/components/ui/Card";
import { GradientButton } from "@/components/ui/GradientButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ScreenLayout } from "@/components/ui/ScreenLayout";
import { useGoalsState } from "@/store/goals";
import { useLanguage } from '@/store/language';
import { useThemeStore } from "@/store/theme";
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Edit2 } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function GoalDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { goals } = useGoalsState();
  const { theme } = useThemeStore();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  const goalId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';
  const goal = goals.find((g) => g.id.toString() === goalId);

  if (!goal) {
    return (
      <ScreenLayout className="items-center justify-center">
        <Text className="text-lg font-semibold text-red-600 dark:text-red-400">
          {t('goalNotFound')}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 px-4 py-2 bg-indigo-500 rounded-xl flex-row items-center"
        >
          <ChevronLeft color="white" size={20} />
          <Text className="text-white ml-2">{t('back')}</Text>
        </TouchableOpacity>
      </ScreenLayout>
    );
  }

  const progress = Math.min((goal.saved / goal.target) * 100, 100);

  const getPriorityColors = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          container: 'bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-800',
          text: 'text-red-700 dark:text-red-200',
          label: 'text-red-600/70 dark:text-red-300/70'
        };
      case 'medium':
        return {
          container: 'bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-800 dark:text-yellow-200',
          label: 'text-yellow-700/70 dark:text-yellow-300/70'
        };
      default:
        return {
          container: 'bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800',
          text: 'text-green-800 dark:text-green-200',
          label: 'text-green-700/70 dark:text-green-300/70'
        };
    }
  };

  const priorityStyles = getPriorityColors(goal.priority);

  return (
    <ScreenLayout edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800"
        >
          <ChevronLeft size={24} className="text-gray-900 dark:text-white" color={isDark ? '#FFF' : '#111'} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900 dark:text-white">{t('goalDetails')}</Text>
        <TouchableOpacity
          onPress={() => router.push(`/goals/edit/${goalId}`)}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800"
        >
          <Edit2 size={20} color={isDark ? '#FFF' : '#111'} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="flex-1 px-6">
        {/* Card principale */}
        <Card variant="elevated" className="mb-6 p-6 border-gray-100 dark:border-zinc-700">
          <View className="items-center mb-4">
            <View className="w-24 h-24 rounded-full bg-gray-50 dark:bg-zinc-800 items-center justify-center mb-4">
              <Text className="text-5xl">{goal.emoji}</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
              {goal.name}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center px-4">
              {goal.description || t('noDescription')}
            </Text>
          </View>

          <View className="mb-2">
            <ProgressBar
              progress={progress}
              height={12}
              className="bg-gray-100 dark:bg-zinc-700"
              fillClassName="bg-purple-600 dark:bg-purple-500"
            />
          </View>

          <View className="flex-row justify-between mt-2">
            <Text className="text-gray-500 dark:text-gray-400 font-medium">
              {t('savedLabel')}: <Text className="text-gray-900 dark:text-white font-bold">{goal.saved}€</Text>
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 font-medium">
              {t('targetLabel')}: <Text className="text-gray-900 dark:text-white font-bold">{goal.target}€</Text>
            </Text>
          </View>
        </Card>

        {goal.status !== 'completed' && (
          <View className="mb-8">
            <GradientButton
              title={t('addFunds')}
              onPress={() => router.push(`/goals/add-transaction/${id}`)}
              className="w-full shadow-lg shadow-purple-500/30"
            />
          </View>
        )}

        {/* Info Grid */}
        <View className="flex-row flex-wrap gap-4 mb-6">
          <View className="flex-1 min-w-[45%] bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-gray-100 dark:border-zinc-700">
            <Text className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t('created')}</Text>
            <Text className="text-gray-900 dark:text-white font-semibold">
              {format(new Date(goal.createdAt), "dd MMM yyyy")}
            </Text>
          </View>

          {goal.deadline && (
            <View className="flex-1 min-w-[45%] bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-gray-100 dark:border-zinc-700">
              <Text className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t('deadline')}</Text>
              <Text className="text-gray-900 dark:text-white font-semibold">
                {format(new Date(goal.deadline), "dd MMM yyyy")}
              </Text>
            </View>
          )}

          <View className={`flex-1 min-w-[45%] p-4 rounded-2xl ${priorityStyles.container}`}>
            <Text className={`text-xs uppercase tracking-wider mb-1 ${priorityStyles.label}`}>{t('priority')}</Text>
            <Text className={`font-bold capitalize ${priorityStyles.text}`}>{goal.priority}</Text>
          </View>

          <View className="flex-1 min-w-[45%] bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-gray-100 dark:border-zinc-700">
            <Text className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t('status')}</Text>
            <Text className="text-gray-900 dark:text-white font-semibold capitalize">{goal.status}</Text>
          </View>
        </View>

        {/* Notes */}
        {goal.notes ? (
          <View className="bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-gray-100 dark:border-zinc-700 mb-6">
            <Text className="text-sm text-gray-400 mb-2 font-medium">{t('notes')}</Text>
            <Text className="text-gray-700 dark:text-gray-300 leading-relaxed">{goal.notes}</Text>
          </View>
        ) : null}

        {/* Transactions */}
        <View className="bg-white dark:bg-zinc-800 rounded-3xl border border-gray-100 dark:border-zinc-700 overflow-hidden mb-6">
          <View className="p-4 border-b border-gray-100 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/50">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">{t('transactionHistory')}</Text>
          </View>

          {goal.transactions.length > 0 ? (
            <View>
              {goal.transactions.slice().reverse().map((tx, index) => (
                <View
                  key={tx.id}
                  className={`p-4 flex-row justify-between items-center ${index !== goal.transactions.length - 1 ? 'border-b border-gray-100 dark:border-zinc-700' : ''
                    }`}
                >
                  <View className="flex-1 mr-4">
                    <Text className="text-gray-900 dark:text-white font-medium mb-0.5">
                      {tx.note || t('fundAddition')}
                    </Text>
                    <Text className="text-xs text-gray-400">
                      {format(new Date(tx.date), "dd MMM yyyy, HH:mm")}
                    </Text>
                  </View>
                  <Text className={`font-bold text-lg ${tx.amount >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                    {tx.amount >= 0 ? '+' : ''}{tx.amount}€
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="p-8 items-center justify-center">
              <Text className="text-gray-400 dark:text-gray-500 text-center">{t('noTransactions')}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
