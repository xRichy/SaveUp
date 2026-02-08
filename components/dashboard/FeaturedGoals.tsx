import { ProgressBar } from '@/components/ui/ProgressBar';
import { Goal } from '@/store/goals';
import { useLanguage } from '@/store/language';
import { router } from 'expo-router';
import { ArrowRight, Star } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface FeaturedGoalsProps {
    goals: Goal[];
    onGoalPress: (id: string | number) => void;
}

export const FeaturedGoals: React.FC<FeaturedGoalsProps> = ({
    goals,
    onGoalPress,
}) => {
    const { t } = useLanguage();
    if (goals.length === 0) return null;

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);

    return (
        <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4 px-1">
                <Text className="text-lg font-bold text-gray-900 dark:text-white">
                    {t('spotlight')}
                </Text>
                <TouchableOpacity
                    onPress={() => router.push('/stats')}
                    className="flex-row items-center bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-full"
                >
                    <Text className="text-xs font-semibold mr-1 text-purple-600 dark:text-purple-400">
                        {t('viewStats')}
                    </Text>
                    <ArrowRight size={14} color="#9333EA" />
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
                className="-mx-4 px-4 py-3"
            >
                {goals.map((goal) => {
                    const progress = (goal.saved / goal.target) * 100;
                    return (
                        <TouchableOpacity
                            key={goal.id}
                            onPress={() => onGoalPress(goal.id)}
                            className="w-56 p-5 rounded-3xl mr-4 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm"
                        >
                            <View className="flex-row items-center justify-between mb-4">
                                <View className="bg-gray-50 dark:bg-zinc-700/50 w-12 h-12 rounded-full items-center justify-center">
                                    <Text className="text-2xl">{goal.emoji}</Text>
                                </View>
                                <View className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-full">
                                    <Star size={16} color="#EAB308" fill="#EAB308" />
                                </View>
                            </View>

                            <Text className="font-bold text-lg mb-1 text-gray-900 dark:text-white" numberOfLines={1}>
                                {goal.name}
                            </Text>

                            <Text className="text-sm mb-4 text-gray-500 dark:text-gray-400 font-medium">
                                {formatCurrency(goal.saved)} <Text className="text-gray-300 dark:text-zinc-600">/</Text> {formatCurrency(goal.target)}
                            </Text>

                            <ProgressBar progress={progress} height={6} className="bg-gray-100 dark:bg-zinc-700" />

                            <View className="flex-row justify-between items-center mt-3">
                                <Text className="text-xs font-semibold text-gray-400 dark:text-zinc-500">
                                    {Math.round(progress)}%
                                </Text>
                                <Text className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                                    {goal.priority ? goal.priority.toUpperCase() : 'NORMAL'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};
