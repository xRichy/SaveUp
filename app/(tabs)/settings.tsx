import React, { useEffect } from 'react';
import { View, Text, Switch, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '@/store/theme';

export default function SettingsPage() {
  const { theme, toggleTheme, setTheme } = useThemeStore();
  const systemScheme = useColorScheme(); // "light" | "dark" | null
  const isDark = theme === 'dark';

  useEffect(() => {
    if (systemScheme) {
      setTheme(systemScheme);
    }
  }, [systemScheme]);

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="px-6 py-6">
        <Text className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </Text>

        {/* Sezione Tema */}
        <View className="flex-row items-center justify-between bg-white/90 dark:bg-gray-800 rounded-2xl px-4 py-4 shadow-sm">
          <Text className={`text-base font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            Dark Mode
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
            thumbColor={isDark ? '#A78BFA' : '#F9FAFB'}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
