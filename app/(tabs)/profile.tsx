// app/(tabs)/profile.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/auth';
import { useThemeStore } from '../../store/theme';

export default function ProfileScreen() {
  const { user, updateProfile, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    updateProfile({ name, email });
    Alert.alert('Successo', 'Profilo aggiornato con successo!');
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="px-6 py-4 h-full">
        {/* Avatar Section */}
        <View className="items-center mb-8">
          <View className={`w-24 h-24 rounded-full mb-4 items-center justify-center ${
            isDark ? 'bg-blue-600' : 'bg-blue-500'
          }`}>
            <Text className="text-3xl text-white">
              {user?.name?.charAt(0)?.toUpperCase() || '👤'}
            </Text>
          </View>
          <TouchableOpacity>
            <Text className="text-blue-500 text-base">Cambia foto</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View className="mb-6">
          <Text className={`text-lg font-semibold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Nome
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className={`p-4 rounded-lg mb-4 ${
              isDark 
                ? 'bg-gray-800 text-white border border-gray-700' 
                : 'bg-white text-gray-900 border border-gray-300'
            }`}
          />

          <Text className={`text-lg font-semibold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            className={`p-4 rounded-lg mb-6 ${
              isDark 
                ? 'bg-gray-800 text-white border border-gray-700' 
                : 'bg-white text-gray-900 border border-gray-300'
            }`}
          />

          <TouchableOpacity
            onPress={handleSave}
            className="bg-blue-500 p-4 rounded-lg mb-4"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Salva Modifiche
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}