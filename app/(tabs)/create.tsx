import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useGoalsState, GoalCategory } from '@/store/goals';

const GOAL_CATEGORIES: GoalCategory[] = [
  { id: 'travel', name: 'Viaggi', emoji: '✈️', color: 'from-blue-500 to-cyan-500' },
  { id: 'tech', name: 'Tecnologia', emoji: '💻', color: 'from-purple-500 to-indigo-500' },
  { id: 'car', name: 'Auto', emoji: '🚗', color: 'from-green-500 to-emerald-500' },
  { id: 'home', name: 'Casa', emoji: '🏠', color: 'from-yellow-500 to-orange-500' },
  { id: 'education', name: 'Formazione', emoji: '📚', color: 'from-red-500 to-pink-500' },
  { id: 'other', name: 'Altro', emoji: '🎯', color: 'from-gray-500 to-slate-500' }
];

type FormData = {
  name: string;
  target: string; // stringa per TextInput
  category: string | null;
  description: string;
};

export default function CreateGoalPage() {
  const { addGoal } = useGoalsState();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    target: '',
    category: null,
    description: '',
  });

  const handleSave = () => {
    const selectedCategory = GOAL_CATEGORIES.find(cat => cat.id === formData.category);

    const result = addGoal({
      name: formData.name.trim(),
      target: Number(formData.target) || 0,
      saved: 0,
      emoji: selectedCategory?.emoji ?? '🎯',
      category: selectedCategory,
      description: formData.description.trim(),
    });

    if (!result.success) {
      console.warn(result.error);
      return;
    }

    router.back();
  };

  const selectedCategory = GOAL_CATEGORIES.find(cat => cat.id === formData.category);

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">Nuovo Obiettivo</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text className="text-purple-600 font-semibold">Salva</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Preview Card */}
        <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <View
            className={`w-16 h-16 rounded-full items-center justify-center mb-4 self-center ${
              selectedCategory ? `bg-gradient-to-r ${selectedCategory.color}` : 'bg-gray-200'
            }`}
          >
            <Text className="text-2xl">{selectedCategory?.emoji || '🎯'}</Text>
          </View>

          <Text className="text-xl font-bold text-gray-900 text-center mb-2">
            {formData.name || 'Nome del tuo obiettivo'}
          </Text>

          <Text className="text-2xl font-bold text-purple-600 text-center">
            €{formData.target || '0'}
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-6">
          {/* Nome Obiettivo */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">Nome Obiettivo</Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
              placeholder="es. Vacanza in Giappone"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          {/* Importo Target */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">Quanto vuoi risparmiare?</Text>
            <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex-row items-center">
              <Text className="text-gray-500 mr-2">€</Text>
              <TextInput
                className="flex-1 text-gray-900 text-lg"
                placeholder="0"
                value={formData.target}
                onChangeText={(text) => setFormData({ ...formData, target: text })}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Categoria */}
          <View>
            <Text className="text-gray-700 font-semibold mb-3">Categoria</Text>
            <View className="flex-row flex-wrap gap-3">
              {GOAL_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className={`flex-1 min-w-[45%] bg-white border-2 rounded-xl p-4 items-center ${
                    formData.category === category.id ? 'border-purple-500' : 'border-gray-200'
                  }`}
                  onPress={() => setFormData({ ...formData, category: category.id })}
                >
                  <Text className="text-2xl mb-2">{category.emoji}</Text>
                  <Text className="text-gray-700 font-medium text-sm text-center">{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Descrizione */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2">Descrizione (opzionale)</Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
              placeholder="Aggiungi una descrizione per motivarti..."
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          className="bg-gradient-to-r from-purple-600 to-purple-700 py-4 rounded-xl mt-8 mb-6"
          onPress={handleSave}
        >
          <Text className="text-white font-semibold text-lg text-center">Crea Obiettivo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
