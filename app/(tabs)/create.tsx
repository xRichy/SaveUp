// app/(tabs)/create.tsx

import { GOAL_CATEGORIES, useGoalsState } from "@/store/goals";
import { useLanguage } from '@/store/language';
import { useThemeStore } from "@/store/theme";
import { useFocusEffect } from '@react-navigation/native';
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { GradientButton } from "@/components/ui/GradientButton";
import { ScreenLayout } from "@/components/ui/ScreenLayout"; // Import ScreenLayout
import DateTimePicker from '@react-native-community/datetimepicker';

type FormData = {
  name: string;
  target: string;
  category: string | null;
  description: string;
  deadline: Date;
  priority: "low" | "medium" | "high";
  notes: string;
};

export default function CreateGoalPage() {
  const { addGoal } = useGoalsState();
  const { theme } = useThemeStore();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  const INITIAL_FORM_STATE: FormData = {
    name: "",
    target: "",
    category: null,
    description: "",
    deadline: new Date(),
    priority: "medium",
    notes: "",
  };

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);

  const [showDatePicker, setShowDatePicker] = useState(false);

  // Reset scroll on focus
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || formData.deadline;
    setFormData({ ...formData, deadline: currentDate });
    setShowDatePicker(false);
  }

  const handleSave = () => {
    const selectedCategory = GOAL_CATEGORIES.find(
      (cat) => cat.id === formData.category
    );

    console.log("Selected Category:", selectedCategory);

    const result = addGoal({
      name: formData.name.trim(),
      target: Number(formData.target) || 0,
      saved: 0,
      emoji: selectedCategory?.emoji ?? "🎯",
      category: selectedCategory,
      description: formData.description.trim(),
      deadline: formData.deadline || undefined,
      priority: formData.priority,
      notes: formData.notes.trim(),
    });

    if (!result.success) {
      console.warn(result.error);
      return;
    }

    setFormData(INITIAL_FORM_STATE);
    router.back();
  };

  const selectedCategory = GOAL_CATEGORIES.find(
    (cat) => cat.id === formData.category
  );

  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <ScreenLayout edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-6 py-4"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800"
          >
            <ArrowLeft size={24} color={isDark ? "#F3F4F6" : "#374151"} />
          </TouchableOpacity>
          <Text
            className="text-lg font-bold text-gray-900 dark:text-white"
          >
            {t('createGoalTitle')}
          </Text>
          <View className="w-10" />
        </View>


        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* Preview Card */}
          <View
            className="rounded-3xl p-6 mt-2 shadow-sm mb-6 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700"
          >
            <View
              className={`w-20 h-20 rounded-full items-center justify-center mb-4 self-center ${selectedCategory
                ? `bg-gray-50 dark:bg-zinc-700/50`
                : "bg-gray-100 dark:bg-zinc-700"
                }`}
            >
              <Text className="text-4xl">
                {selectedCategory?.emoji || "🎯"}
              </Text>
            </View>

            <Text
              className="text-xl font-bold text-center mb-1 text-gray-900 dark:text-white"
            >
              {formData.name || t('goalName')}
            </Text>

            <Text className="text-3xl font-bold text-purple-600 dark:text-purple-400 text-center">
              €{formData.target || "0"}
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-6">
            {/* Nome Obiettivo */}
            <View className="mb-4">
              <Text
                className="mb-2 font-semibold text-gray-700 dark:text-gray-200"
              >
                {t('goalName')}
              </Text>
              <TextInput
                className="border rounded-xl px-4 py-4 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                placeholder={t('goalNamePlaceholder')}
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>

            {/* Importo Target */}
            <View className="mb-4">
              <Text
                className="mb-2 font-semibold text-gray-700 dark:text-gray-200"
              >
                {t('targetAmount')}
              </Text>
              <View
                className="border rounded-xl px-4 h-14 flex-row items-center bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
              >
                <Text className="text-gray-500 mr-2 text-lg">€</Text>
                <TextInput
                  className="flex-1 text-lg text-gray-900 dark:text-white"
                  placeholder="0"
                  placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                  value={formData.target}
                  onChangeText={(text) =>
                    setFormData({ ...formData, target: text })
                  }
                  keyboardType="numeric"
                  style={{ lineHeight: 22, paddingVertical: 0 }}
                />
              </View>
            </View>

            {/* Categoria */}
            <View className="mb-4">
              <Text
                className="mb-3 font-semibold text-gray-700 dark:text-gray-200"
              >
                {t('category')}
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {GOAL_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    className={`flex-1 min-w-[45%] border-2 rounded-2xl p-4 items-center ${formData.category === category.id
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                      }`}
                    onPress={() => {
                      setFormData({ ...formData, category: category.id })
                    }}
                  >
                    <Text className="text-3xl mb-2">{category.emoji}</Text>
                    <Text
                      className={`font-medium text-sm text-center ${formData.category === category.id
                        ? "text-purple-700 dark:text-purple-300"
                        : "text-gray-700 dark:text-gray-200"
                        }`}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Descrizione */}
            <View className="mb-4">
              <Text
                className="mb-2 font-semibold text-gray-700 dark:text-gray-200"
              >
                {t('description')}
              </Text>
              <TextInput
                className="border rounded-xl px-4 py-4 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                placeholder={t('descriptionPlaceholder')}
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Deadline */}
            <View className="mb-4">
              <Text
                className="mb-2 font-semibold text-gray-700 dark:text-gray-200"
              >
                {t('deadlineOptional')}
              </Text>
              <View className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden">
                <DateTimePicker
                  value={formData.deadline}
                  mode="date"
                  display="spinner"
                  onChange={onChangeDate}
                  textColor={isDark ? "#FFFFFF" : "#000000"}
                  style={{ height: 120 }}
                />
              </View>
            </View>

            {/* Priority */}
            <View className="mb-4">
              <Text
                className="mb-2 font-semibold text-gray-700 dark:text-gray-200"
              >
                {t('priority')}
              </Text>
              <View className="flex-row gap-3">
                {["low", "medium", "high"].map((level) => (
                  <TouchableOpacity
                    key={level}
                    className={`flex-1 py-3 rounded-xl items-center border ${formData.priority === level
                      ? "bg-purple-600 border-purple-600"
                      : "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                      }`}
                    onPress={() =>
                      setFormData({
                        ...formData,
                        priority: level as "low" | "medium" | "high",
                      })
                    }
                  >
                    <Text
                      className={`font-semibold capitalize ${formData.priority === level
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-200"
                        }`}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Note */}
            <View className="mb-4">
              <Text
                className="mb-2 font-semibold text-gray-700 dark:text-gray-200"
              >
                {t('notesOptional')}
              </Text>
              <TextInput
                className="border rounded-xl px-4 py-4 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                placeholder={t('notesPlaceholder')}
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                value={formData.notes}
                onChangeText={(text) =>
                  setFormData({ ...formData, notes: text })
                }
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Create Button */}
          <View className="w-full items-center mt-6">
            <GradientButton
              title={t('create')}
              onPress={handleSave}
              className="w-full shadow-lg shadow-purple-500/20"
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}
