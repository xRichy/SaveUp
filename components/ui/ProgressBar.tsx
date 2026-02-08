// components/ui/ProgressBar.tsx
import { useThemeStore } from '@/store/theme';
import React from 'react';
import { View } from 'react-native';

interface ProgressBarProps {
  progress: number;
  height?: number;
  className?: string;
  fillClassName?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  className = '',
  fillClassName = ''
}) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // Cap at 100%
  const percentage = Math.min(Math.max(progress, 0), 100);

  return (
    <View
      className={`w-full rounded-full overflow-hidden ${isDark ? 'bg-zinc-700' : 'bg-gray-200'} ${className}`}
      style={{ height }}
    >
      <View
        className={`h-full rounded-full ${isDark ? 'bg-purple-500' : 'bg-purple-600'} ${fillClassName}`}
        style={{ width: `${percentage}%` }}
      />
    </View>
  );
};