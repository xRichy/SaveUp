// =============================================================================
// src/components/ui/EmptyState.tsx - Stato vuoto
// =============================================================================
import React from 'react';
import { Text, View } from 'react-native';
import { GradientButton } from './GradientButton';

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
  return (
    <View className="items-center justify-center py-12 px-6">
      <Text className="text-6xl mb-4">{icon}</Text>
      <Text className="text-xl font-bold text-gray-900 mb-2 text-center">{title}</Text>
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