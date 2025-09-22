import { useThemeStore } from '@/store/theme';
import React, { useEffect } from 'react';
import { Switch, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        <View className={`flex-row items-center justify-between ${theme === "dark" ? 'bg-gray-800' : 'bg-gray-200'} rounded-2xl px-4 py-4 shadow-sm`}>
          <Text className={`text-base font-medium ${theme === "dark" ? 'text-gray-200' : 'text-gray-800'}`}>
            Dark Mode
          </Text>
          <TouchableOpacity
            onPress={toggleTheme}
            className={`rounded-full px-3 py-1 ${theme === "dark" ? 'bg-gray-600' : 'bg-gray-500'}`}
          >
            <Text className="text-lg">{theme === "dark" ? "🌙" : "☀️"}</Text>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}
