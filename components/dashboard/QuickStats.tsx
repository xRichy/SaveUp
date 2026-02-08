import { Card } from '@/components/ui/Card';
import { useThemeStore } from '@/store/theme';
import { Target, TrendingUp, Trophy } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

interface QuickStatsProps {
    activeGoals: number;
    completedGoals: number;
    progress: number;
}

const StatItem = ({ Icon, label, value, color }: {
    Icon: React.ElementType;
    label: string;
    value: string;
    color: string;
}) => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    return (
        <View className="flex-1 items-center">
            <View className={`p-3 rounded-2xl mb-2 ${isDark ? 'bg-zinc-800' : 'bg-gray-50'}`}>
                <Icon size={24} color={color} />
            </View>
            <Text className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium">
                {label}
            </Text>
            <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {value}
            </Text>
        </View>
    );
};

export const QuickStats: React.FC<QuickStatsProps> = ({
    activeGoals,
    completedGoals,
    progress,
}) => {
    return (
        <Card className="mb-6 p-5" variant="elevated">
            <Text className="text-base font-semibold mb-4 text-gray-900 dark:text-white">
                Quick Overview
            </Text>

            <View className="flex-row justify-around">
                <StatItem
                    Icon={Target}
                    label="Active"
                    value={activeGoals.toString()}
                    color="#3B82F6"
                />
                <View className="w-[1px] h-full bg-gray-100 dark:bg-zinc-800 mx-2" />
                <StatItem
                    Icon={Trophy}
                    label="Done"
                    value={completedGoals.toString()}
                    color="#10B981"
                />
                <View className="w-[1px] h-full bg-gray-100 dark:bg-zinc-800 mx-2" />
                <StatItem
                    Icon={TrendingUp}
                    label="Progress"
                    value={`${Math.round(progress)}%`}
                    color="#8B5CF6"
                />
            </View>
        </Card>
    );
};
