// app/(auth)/_layout.tsx

import { useAuthStore } from '@/store/auth';
import { useThemeStore } from '@/store/theme';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export default function AuthLayout() {
  const { theme } = useThemeStore();
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  // Se non ancora caricato, non mostrare nulla
  if (!hasHydrated) {
    return null;
  }

  // Se utente autenticato, non mostrare auth screens
  if (isAuthenticated) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme === 'dark' ? '#111827' : '#F9FAFB'
        },
        animation: 'slide_from_right',
      }}
    >
      {/* Schermata principale login */}
      <Stack.Screen 
        name="index" 
        options={{ title: 'Login' }} 
      />
      
      {/* Altre schermate auth */}
      {/* 
      <Stack.Screen 
        name="register" 
        options={{ title: 'Registrati' }} 
      />
      
      <Stack.Screen 
        name="forgot-password" 
        options={{ title: 'Password Dimenticata' }} 
      />
      
      <Stack.Screen 
        name="verify-email" 
        options={{ title: 'Verifica Email' }} 
      />

      */}
    </Stack>
  );
}