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
      case 'sm': return 'p-4';
      case 'lg': return 'p-8';
      default: return 'p-6';
    }
  };

  return (
    <View 
      className={`rounded-2xl ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-100'} shadow-sm ${getPaddingStyles()} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};
