
// =============================================================================
// src/components/ui/GradientButton.tsx - Bottone con gradiente
// =============================================================================
import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

interface GradientButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gradient-to-r from-gray-600 to-gray-700';
      case 'outline':
        return 'bg-transparent border-2 border-purple-500';
      default:
        return 'bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg shadow-purple-500/25';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return 'py-2 px-4';
      case 'lg': return 'py-4 px-8';
      default: return 'py-3 px-6';
    }
  };

  const getTextStyles = () => {
    const baseStyles = variant === 'outline' ? 'text-purple-600' : 'text-white';
    switch (size) {
      case 'sm': return `${baseStyles} text-sm font-semibold`;
      case 'lg': return `${baseStyles} text-lg font-bold`;
      default: return `${baseStyles} text-base font-semibold`;
    }
  };

  return (
    <TouchableOpacity
      className={`${getVariantStyles()} ${getSizeStyles()} rounded-xl flex-row items-center justify-center space-x-2 ${className}`}
      disabled={loading}
      {...props}
    >
      {icon && !loading && icon}
      <Text className={getTextStyles()}>
        {loading ? 'Caricamento...' : title}
      </Text>
    </TouchableOpacity>
  );
};