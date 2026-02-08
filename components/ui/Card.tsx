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

  const getPaddingStyles = () => {
    switch (padding) {
      case 'sm': return 'p-3';
      case 'lg': return 'p-6';
      default: return 'p-4';
    }
  };

  const getVariantStyles = () => {
    if (isDark) {
      switch (variant) {
        case 'elevated': return 'bg-zinc-800 shadow-md border border-zinc-700';
        case 'glass': return 'bg-zinc-800/80 border border-zinc-700/50'; // Fallback for glass in RN without BlurView wrapper
        default: return 'bg-zinc-900 border border-zinc-800';
      }
    } else {
      switch (variant) {
        case 'elevated': return 'bg-white shadow-md shadow-gray-200 border border-gray-100';
        case 'glass': return 'bg-white/90 border border-white/50 shadow-sm';
        default: return 'bg-white border border-gray-100 shadow-sm';
      }
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
