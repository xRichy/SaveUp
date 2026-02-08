// components/ui/StatCard.tsx
import { useThemeStore } from '@/store/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactElement<any>;
  color: string;
  subtitle?: string | null;
  gradient?: boolean;
}

const getColorClasses = (color: string, isDark: boolean) => {
  const colors: Record<string, { bg: string, text: string, icon: string }> = {
    green: {
      bg: isDark ? 'bg-green-900/30' : 'bg-green-100',
      text: isDark ? 'text-green-400' : 'text-green-700',
      icon: isDark ? '#4ade80' : '#15803d'
    },
    red: {
      bg: isDark ? 'bg-red-900/30' : 'bg-red-100',
      text: isDark ? 'text-red-400' : 'text-red-700',
      icon: isDark ? '#f87171' : '#b91c1c'
    },
    blue: {
      bg: isDark ? 'bg-blue-900/30' : 'bg-blue-100',
      text: isDark ? 'text-blue-400' : 'text-blue-700',
      icon: isDark ? '#60a5fa' : '#1d4ed8'
    },
    orange: {
      bg: isDark ? 'bg-orange-900/30' : 'bg-orange-100',
      text: isDark ? 'text-orange-400' : 'text-orange-700',
      icon: isDark ? '#fb923c' : '#c2410c'
    },
    purple: {
      bg: isDark ? 'bg-purple-900/30' : 'bg-purple-100',
      text: isDark ? 'text-purple-400' : 'text-purple-700',
      icon: isDark ? '#c084fc' : '#7e22ce'
    },
  };
  return colors[color] || colors.purple;
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle = null,
  gradient = false
}) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const themeColors = getColorClasses(color, isDark);

  return (
    <View className={`flex-1 mx-2 mb-4 rounded-2xl overflow-hidden ${isDark ? 'bg-zinc-900' : 'bg-white'
      } shadow-sm border border-gray-100 dark:border-zinc-800`}>
      {gradient ? (
        <LinearGradient
          colors={isDark ? ['#7C3AED', '#3B82F6'] : ['#8B5CF6', '#06B6D4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-4"
        >
          <View className="flex-row items-center justify-between mb-2">
            <View className="bg-white/20 p-2 rounded-xl">
              {React.cloneElement(icon as React.ReactElement<any>, { size: 20, color: 'white' })}
            </View>
          </View>
          <Text className="text-2xl font-bold text-white mb-1" numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
          <Text className="text-purple-100 text-sm" numberOfLines={1}>{title}</Text>
          {subtitle && (
            <Text className="text-purple-200 text-xs mt-1">{subtitle}</Text>
          )}
        </LinearGradient>
      ) : (
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-2">
            <View className={`p-2 rounded-xl ${themeColors.bg}`}>
              {React.cloneElement(icon, {
                size: 20,
                color: themeColors.icon
              })}
            </View>
          </View>
          <Text className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'
            }`} numberOfLines={1} adjustsFontSizeToFit>
            {value}
          </Text>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'
              }`}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};