import { useLanguage } from '@/store/language';
import { LinearGradient } from 'expo-linear-gradient';
import { Target, Wallet } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

interface HomeHeaderProps {
    greeting: string;
    userName: string;
    totalSaved: string;
    totalTarget: string;
    overallProgress: number;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
    greeting,
    userName,
    totalSaved,
    totalTarget,
    overallProgress,
}) => {
    const { t } = useLanguage();

    return (
        <View className="mt-4 mb-6 shadow-xl shadow-indigo-500/20">
            <LinearGradient
                colors={['#4F46E5', '#7C3AED', '#DB2777']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-2xl p-6 relative overflow-hidden"
            >
                {/* Decorative background elements */}
                <View className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                <View className="absolute bottom-0 -left-10 w-32 h-32 bg-indigo-500/20 rounded-full" />

                {/* Top Row: Greeting & Icon */}
                <View className="flex-row justify-between items-start mb-5">
                    <View>
                        <Text className="text-indigo-100 font-medium text-sm mb-1 tracking-wide">
                            {greeting}
                        </Text>
                        <Text className="text-white font-bold text-3xl">
                            {userName}
                        </Text>
                    </View>
                    <View className="bg-white/20 p-3 rounded-2xl border border-white/10">
                        <Wallet size={24} color="white" />
                    </View>
                </View>

                {/* Main Balance */}
                <View className="mb-5">
                    <Text className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-2 opacity-80">
                        {t('totalSaved')}
                    </Text>
                    <Text className="text-white font-bold text-5xl tracking-tight leading-tight">
                        {totalSaved}
                    </Text>
                </View>

                {/* Progress Section - Glass Effect */}
                <View className="bg-black/10 rounded-2xl p-4 border border-white/10">
                    <View className="flex-row justify-between items-center mb-3">
                        <View className="flex-row items-center gap-2">
                            <Target size={16} color="#E0E7FF" />
                            <Text className="text-indigo-100 text-sm font-medium">Goal Progress</Text>
                        </View>
                        <View className="bg-white/20 px-2 py-1 rounded-lg">
                            <Text className="text-white font-bold text-xs">{Math.round(overallProgress)}%</Text>
                        </View>
                    </View>

                    {/* Custom Progress Bar */}
                    <View className="h-3 bg-black/20 rounded-full overflow-hidden mb-2 border border-white/5">
                        <View
                            className="h-full bg-white rounded-full shadow-sm"
                            style={{ width: `${Math.min(overallProgress, 100)}%` }}
                        />
                    </View>

                    <View className="flex-row justify-between items-center mt-1">
                        <Text className="text-indigo-200 text-xs font-medium">0 €</Text>
                        <Text className="text-white font-medium text-xs tracking-wide">
                            Target: {totalTarget}
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};
