// =============================================================================
// src/components/ui/FloatingActionButton.tsx - FAB per azioni rapide
// =============================================================================
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon,
  className = ''
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`absolute bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full items-center justify-center shadow-lg shadow-purple-500/25 ${className}`}
      style={{ elevation: 8 }}
    >
      {icon}
    </TouchableOpacity>
  );
};