// app/(tab)/_layout.tsx
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Home, BarChart3, User, Plus, Settings } from 'lucide-react-native';
import { useThemeStore } from '@/store/theme';

export default function TabLayout() {
  const { theme } = useThemeStore();

  const isDark = theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#111827' : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#374151' : '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 88,
        },
        tabBarActiveTintColor: isDark ? '#A78BFA' : '#8B5CF6',
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: 'Statistiche',
          tabBarIcon: ({ color, size }) => (
            <BarChart3 color={color} size={size} />
          ),
        }}
      />

      {/* Tab centrale per aggiungere obiettivo */}
      <Tabs.Screen
        name="create"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View className={`w-14 h-14 rounded-full items-center justify-center ${focused ? 'bg-purple-600' : 'bg-purple-500'
              }`}>
              <Plus color="#FFFFFF" size={28} />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            // router.push('/(modals)/goal-form');
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profilo',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{ 
          title: 'Impostazioni',
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
