// =============================================================================
// src/components/ui/EmptyState.tsx - Stato vuoto
// =============================================================================
import React from 'react';
import { Text, View } from 'react-native';
import { GradientButton } from './GradientButton';
import { useThemeStore } from '@/store/theme';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
}



export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionTitle,
  onAction
}) => {

  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <View className="items-center justify-center py-12 px-6">
      <Text className="text-6xl mb-4">{icon}</Text>
      <Text className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}  mb-2 text-center`}>{title}</Text>
      <Text className="text-gray-600 text-center mb-8 leading-6">{description}</Text>
      
      {actionTitle && onAction && (
        <GradientButton
          title={actionTitle}
          onPress={onAction}
          size="lg"
        />
      )}
    </View>
  );
};