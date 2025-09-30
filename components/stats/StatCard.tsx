// components/ui/StatCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '@/store/theme';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactElement<any>;
  color: string;
  subtitle?: string | null;
  gradient?: boolean;
}

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

  return (
    <View className={`flex-1 mx-2 mb-4 rounded-2xl overflow-hidden ${
      isDark ? 'bg-zinc-900' : 'bg-white'
    } shadow-sm`}>
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
          <Text className="text-2xl font-bold text-white mb-1">{value}</Text>
          <Text className="text-purple-100 text-sm">{title}</Text>
          {subtitle && (
            <Text className="text-purple-200 text-xs mt-1">{subtitle}</Text>
          )}
        </LinearGradient>
      ) : (
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-2">
            <View className={`p-2 rounded-xl ${
              isDark ? 'bg-purple-900/30' : 'bg-purple-100'
            }`}>
              {React.cloneElement(icon, { 
                size: 20, 
                color: isDark ? '#A855F7' : '#7C3AED' 
              })}
            </View>
          </View>
          <Text className={`text-2xl font-bold mb-1 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {value}
          </Text>
          <Text className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {title}
          </Text>
          {subtitle && (
            <Text className={`text-xs mt-1 ${
              isDark ? 'text-gray-500' : 'text-gray-500'
            }`}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};