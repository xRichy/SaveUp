// app/_layout.tsx

import { useAuthStore } from '@/store/auth';
import { useThemeStore } from '@/store/theme';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import './global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const { theme } = useThemeStore();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  // Gestione navigazione basata su auth
  useEffect(() => {
    if (!hasHydrated) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    console.log('Navigation check:', {
      isAuthenticated,
      segments,
      inAuthGroup
    });

    // Delay per permettere al router di essere pronto
    const timer = setTimeout(() => {
      if (isAuthenticated && inAuthGroup) {
        // User autenticato ma in auth pages -> redirect a tabs
        console.log('Redirecting authenticated user to tabs');
        router.replace('/(tabs)');
      } else if (!isAuthenticated && !inAuthGroup) {
        // User non autenticato ma non in auth pages -> redirect a login
        console.log('Redirecting unauthenticated user to auth');
        router.replace('/(auth)');
      }
      
      setIsNavigationReady(true);
      SplashScreen.hideAsync();
    }, 1000);

    return () => clearTimeout(timer);
  }, [hasHydrated, isAuthenticated, segments]);

  // Mostra splash fino a quando tutto è pronto
  if (!hasHydrated || !isNavigationReady) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme === 'dark' ? 'bg-zinc-900' : '#F9FAFB'
          }
        }}
      >
        {/* Registra TUTTE le possibili routes - sempre */}
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="goals" />
        <Stack.Screen
          name="(modals)"
          options={{
            presentation: 'modal',
          }}
        />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}