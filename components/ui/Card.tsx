// =============================================================================
// src/components/ui/Card.tsx - Componente Card base
// =============================================================================
import { useThemeStore } from '@/store/theme';
import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glass';
  padding?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default', 
  padding = 'md',
  className = '',
  ...props 
}) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return isDark
          ? 'bg-gray-900 border border-gray-800 shadow-md'
          : 'bg-white border border-gray-100 shadow-md';
      case 'glass':
        return isDark
          ? 'bg-gray-800/70 backdrop-blur-xl border border-gray-700'
          : 'bg-white/80 backdrop-blur-xl border border-gray-200';
      default:
        return isDark
          ? 'bg-gray-900 border border-gray-800'
          : 'bg-white border border-gray-100';
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'sm': return 'p-4';
      case 'lg': return 'p-8';
      default: return 'p-6';
    }
  };

  return (
    <View 
      className={`rounded-2xl ${getVariantStyles()} ${getPaddingStyles()} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};
