import { useThemeStore } from '@/store/theme';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface MenuCardProps {
    icon?: React.ComponentType<{ size?: number; color?: string }>;
    emoji?: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    danger?: boolean;
    isLast?: boolean;
    rightElement?: React.ReactNode;
}

export const MenuCard: React.FC<MenuCardProps> = ({
    icon: Icon,
    emoji,
    title,
    subtitle,
    onPress,
    showArrow = true,
    danger = false,
    rightElement
}) => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={0.7}
            style={{ minHeight: 60 }} // Ensure adequate touch target size
            className={`mx-1 mb-3 p-4 rounded-2xl flex-row items-center ${isDark ? 'bg-zinc-900' : 'bg-white'
                } shadow-sm border border-gray-100 dark:border-zinc-800`}
        >
            <View className={`p-3 rounded-xl mr-4 ${danger
                ? 'bg-red-50 dark:bg-red-900/20'
                : isDark
                    ? 'bg-purple-900/20'
                    : 'bg-purple-50'
                }`}>
                {Icon ? (
                    <Icon
                        size={22}
                        color={danger ? '#EF4444' : isDark ? '#A855F7' : '#7C3AED'}
                    />
                ) : (
                    <Text className="text-xl">{emoji}</Text>
                )}
            </View>

            <View className="flex-1 justify-center">
                <Text className={`font-semibold text-base ${danger
                    ? 'text-red-500'
                    : isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                    {title}
                </Text>
                {subtitle && (
                    <Text className={`text-sm mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        {subtitle}
                    </Text>
                )}
            </View>

            {rightElement && (
                <View className="ml-2">
                    {rightElement}
                </View>
            )}

            {showArrow && !rightElement && onPress && (
                <ChevronRight size={20} color={isDark ? '#4B5563' : '#9CA3AF'} />
            )}
        </TouchableOpacity>
    );
};
