// =============================================================================
// src/components/ui/StatCard.tsx - Card per statistiche
// =============================================================================
import React from 'react';
import { Text, View } from 'react-native';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'text-purple-600'
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '📊';
    }
  };

  return (
    <Card variant="elevated" padding="md" className="flex-1">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-gray-600 text-sm font-medium">{title}</Text>
        {icon || <Text className="text-lg">{getTrendIcon()}</Text>}
      </View>
      
      <Text className={`text-2xl font-bold ${color} mb-1`}>{value}</Text>
      
      {subtitle && (
        <Text className="text-gray-500 text-xs">{subtitle}</Text>
      )}
    </Card>
  );
};