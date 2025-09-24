import NotificationButton from '@/components/notifications/NotificationButton';
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StatsPage() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-gray-900 mb-4">📊 Statistiche</Text>
        <Text className="text-gray-600 text-center px-6">
          Qui vedrai grafici e statistiche dettagliate sui tuoi risparmi.
          Questa pagina sarà implementata nella prossima fase.
        </Text>
        <NotificationButton />
      </View>
    </SafeAreaView>
  );
}