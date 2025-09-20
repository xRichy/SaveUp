
// =============================================================================
// src/components/ui/ProgressBar.tsx - Progress bar animata
// =============================================================================
import React, { useEffect, useRef } from 'react';
import { View, Animated, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  colors?: readonly [ColorValue, ColorValue, ...ColorValue[]]; // Tipo corretto per LinearGradient
  backgroundColor?: string;
  animated?: boolean;
  showGlow?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 12,
  colors = ['#8B5CF6', '#EC4899'] as const, // as const per inferenza tipo
  backgroundColor = '#E5E7EB', // gray-200
  animated = true,
  showGlow = false
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, animated]);

  const containerStyle = {
    height,
    backgroundColor,
    borderRadius: height / 2,
    overflow: 'hidden' as const,
  };

  const progressStyle = {
    height,
    borderRadius: height / 2,
    shadowColor: showGlow ? colors[0] : 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: showGlow ? 0.5 : 0,
    shadowRadius: showGlow ? 8 : 0,
    elevation: showGlow ? 4 : 0,
  };

  return (
    <View style={containerStyle} className="w-full">
      {animated ? (
        <Animated.View
          style={[
            progressStyle,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height, borderRadius: height / 2 }}
          />
        </Animated.View>
      ) : (
        <View 
          style={[
            progressStyle,
            { width: `${Math.min(progress, 100)}%` }
          ]}
        >
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height, borderRadius: height / 2 }}
          />
        </View>
      )}
    </View>
  );
};