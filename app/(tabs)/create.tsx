import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Target } from 'lucide-react-native';

const GOAL_CATEGORIES = [
  { id: 'travel', name: 'Viaggi', emoji: '✈️', color: 'from-blue-500 to-cyan-500' },
  { id: 'tech', name: 'Tecnologia', emoji: '💻', color: 'from-purple-500 to-indigo-500' },
  { id: 'car', name: 'Auto', emoji: '🚗', color: 'from-green-500 to-emerald-500' },
  { id: 'home', name: 'Casa', emoji: '🏠', color: 'from-yellow-500 to-orange-500' },
  { id: 'education', name: 'Formazione', emoji: '📚', color: 'from-red-500 to-pink-500' },
  { id: 'other', name: 'Altro', emoji: '🎯', color: 'from-gray-500 to-slate-500' }
];

type FormData = {
    name: string;
    target: string;
    category: string | null;
    description: string;
}

export default function CreateGoalPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    target: '',
    category:null,
    description: ''
  });

  const formatCurrency = (value:any) => {
    const number = parseInt(value.replace(/[^0-9]/g, ''));
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('it-IT').format(number);
  };

  const handleTargetChange = (text:any) => {
    setFormData({ ...formData, target: formatCurrency(text) });
  };

  const handleSave = () => {
    // Qui salverai l'obiettivo nel store
    console.log('Saving goal:', formData);
    router.back();
  };

  const selectedCategory = GOAL_CATEGORIES.find(cat => cat.id === formData.category);

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Header */}
      <Text>ADD </Text>
    </SafeAreaView>
  );
}