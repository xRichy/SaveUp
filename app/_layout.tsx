import { useAuthStore } from '@/store/auth';
import { useLanguage } from '@/store/language';
import { useThemeStore } from '@/store/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { cssInterop, useColorScheme } from 'nativewind';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import './global.css';

cssInterop(LinearGradient, {
  className: {
    target: "style",
  },
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const { theme } = useThemeStore();
  const { language } = useLanguage();
  const { setColorScheme } = useColorScheme();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const isSplashHidden = useRef(false); // Track if splash screen is hidden
  const router = useRouter();
  const segments = useSegments();

  // Sync theme store with NativeWind
  useEffect(() => {
    setColorScheme(theme);
  }, [theme, setColorScheme]);

  // Gestione navigazione basata su auth
  useEffect(() => {
    if (!hasHydrated) return;

    const inAuthGroup = segments[0] === '(auth)';

    // Delay per permettere al router di essere pronto
    const timer = setTimeout(() => {
      if (isAuthenticated && inAuthGroup) {
        router.replace('/(tabs)');
      } else if (!isAuthenticated && !inAuthGroup) {
        router.replace('/(auth)');
      }

      setIsNavigationReady(true);

      if (!isSplashHidden.current) {
        SplashScreen.hideAsync().catch(() => {
          // Ignore error if splash screen is already hidden
        });
        isSplashHidden.current = true;
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [hasHydrated, isAuthenticated, segments]);

  if (!hasHydrated || !isNavigationReady) {
    return null;
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-900" key={language}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' }
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="goals" />
        <Stack.Screen
          name="modals"
          options={{
            presentation: 'modal',
          }}
        />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}