// app/(tabs)/create.tsx

import { GoalCategory, useGoalsState } from "@/store/goals";
import { useThemeStore } from "@/store/theme";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DateTimePicker from '@react-native-community/datetimepicker';

const GOAL_CATEGORIES: GoalCategory[] = [
  { id: "travel", name: "Viaggi", emoji: "✈️", color: "from-blue-500 to-cyan-500" },
  { id: "tech", name: "Tecnologia", emoji: "💻", color: "from-purple-500 to-indigo-500" },
  { id: "car", name: "Auto", emoji: "🚗", color: "from-green-500 to-emerald-500" },
  { id: "home", name: "Casa", emoji: "🏠", color: "from-yellow-500 to-orange-500" },
  { id: "education", name: "Formazione", emoji: "📚", color: "from-red-500 to-pink-500" },
  { id: "other", name: "Altro", emoji: "🎯", color: "from-gray-500 to-slate-500" },
];

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

  const [formData, setFormData] = useState<FormData>({
    name: "",
    target: "",
    category: null,
    description: "",
    deadline: new Date(),
    priority: "medium",
    notes: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  }

  const onChangeDate = (event: any, selectedDate?: Date) => {
    console.log("Selected date:", selectedDate);
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

    router.back();
  };

  const selectedCategory = GOAL_CATEGORIES.find(
    (cat) => cat.id === formData.category
  );

  const isDark = theme === "dark";

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-black" : "bg-gradient-to-br from-purple-50 via-white to-blue-50"}`}
    >

      {/* Header */}
      <View
        className={`flex-row items-center justify-between px-6 py-4 ${isDark ? "bg-zinc-900" : "bg-white"
          }`}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={isDark ? "#F3F4F6" : "#374151"} />
        </TouchableOpacity>
        <Text
          className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"
            }`}
        >
          Nuovo Obiettivo
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text className="text-purple-600 font-semibold">Salva</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          className="flex-1 px-6 py-6"
          contentContainerStyle={{ paddingBottom: 20 }} // Un po' di spazio in fondo
          keyboardShouldPersistTaps="handled">
          {/* Preview Card */}
          <View
            className={`rounded-2xl p-6 shadow-lg mb-6 ${isDark ? "bg-zinc-900" : "bg-white"
              }`}
          >
            <View
              className={`w-16 h-16 rounded-full items-center justify-center mb-4 self-center ${selectedCategory
                ? `bg-gradient-to-r`
                : "bg-gray-200"
                }`}
            >
              <Text className="text-2xl">
                {selectedCategory?.emoji || "🎯"}
              </Text>
            </View>

            <Text
              className={`text-xl font-bold text-center mb-2 ${isDark ? "text-white" : "text-gray-900"
                }`}
            >
              {formData.name || "Nome del tuo obiettivo"}
            </Text>

            <Text className="text-2xl font-bold text-purple-600 text-center">
              €{formData.target || "0"}
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-6">
            {/* Nome Obiettivo */}
            <View className="my-3">
              <Text
                className={`mb-2 font-semibold ${isDark ? "text-gray-200" : "text-gray-700"
                  }`}
              >
                Nome Obiettivo
              </Text>
              <TextInput
                className={`border rounded-xl px-4 py-3 ${isDark
                  ? "bg-zinc-800 border-zinc-700 text-white"
                  : "bg-white border-gray-200 text-gray-900"
                  }`}
                placeholder="es. Vacanza in Giappone"
                placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>

            {/* Importo Target */}
            <View className="my-3">
              <Text
                className={`mb-2 font-semibold ${isDark ? "text-gray-200" : "text-gray-700"
                  }`}
              >
                Quanto vuoi risparmiare?
              </Text>
              <View
                className={`border rounded-xl px-4 py-3 flex-row items-center ${isDark
                  ? "bg-zinc-800 border-zinc-700"
                  : "bg-white border-gray-200"
                  }`}
              >
                <Text className="text-gray-500 mr-2">€</Text>
                <TextInput
                  className={` ${isDark ? "text-white" : "text-gray-900"
                    }`}
                  placeholder="0"
                  placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
                  value={formData.target}
                  onChangeText={(text) =>
                    setFormData({ ...formData, target: text })
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Categoria */}
            <View className="my-3">
              <Text
                className={`mb-3 font-semibold ${isDark ? "text-gray-200" : "text-gray-700"
                  }`}
              >
                Categoria
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {GOAL_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    className={`flex-1 min-w-[45%] border-2 rounded-xl p-4 items-center ${isDark ? "bg-zinc-800" : "bg-white"
                      } ${formData.category === category.id
                        ? "border-purple-500"
                        : isDark
                          ? "border-zinc-700"
                          : "border-gray-200"
                      }`}
                    onPress={() => {
                      console.log("Category selected:", category.id);
                      setFormData({ ...formData, category: category.id })
                    }
                    }
                  >
                    <Text className="text-2xl mb-2">{category.emoji}</Text>
                    <Text
                      className={`font-medium text-sm text-center ${isDark ? "text-gray-200" : "text-gray-700"
                        }`}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Descrizione */}
            <View className="my-3">
              <Text
                className={`mb-2 font-semibold ${isDark ? "text-gray-200" : "text-gray-700"
                  }`}
              >
                Descrizione (opzionale)
              </Text>
              <TextInput
                className={`border rounded-xl px-4 py-3 ${isDark
                  ? "bg-zinc-800 border-zinc-700 text-white"
                  : "bg-white border-gray-200 text-gray-900"
                  }`}
                placeholder="Aggiungi una descrizione..."
                placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
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
            <View className="my-3">
              <Text
                className={`mb-2 font-semibold ${isDark ? "text-gray-200" : "text-gray-700"
                  }`}
              >
                Scadenza (opzionale)
              </Text>

              <DateTimePicker
                value={formData.deadline}
                mode="date"
                display="spinner"
                onChange={onChangeDate}
                className={`border rounded-xl px-4 py-3 ${isDark
                  ? "bg-zinc-800 border-zinc-700 text-white"
                  : "bg-white border-gray-200 text-gray-900"
                  }`}
                textColor={isDark ? "#FFFFFF" : "#000000"}

              />




            </View>

            {/* Priority */}
            <View className="my-3">
              <Text
                className={`mb-2 font-semibold ${isDark ? "text-gray-200" : "text-gray-700"
                  }`}
              >
                Priorità
              </Text>
              <View className="flex-row gap-3">
                {["low", "medium", "high"].map((level) => (
                  <TouchableOpacity
                    key={level}
                    className={`flex-1 py-3 rounded-xl items-center ${formData.priority === level
                      ? "bg-purple-600"
                      : isDark
                        ? "bg-zinc-800"
                        : "bg-gray-200"
                      }`}
                    onPress={() =>
                      setFormData({
                        ...formData,
                        priority: level as "low" | "medium" | "high",
                      })
                    }
                  >
                    <Text
                      className={`font-medium ${formData.priority === level
                        ? "text-white"
                        : isDark
                          ? "text-gray-200"
                          : "text-gray-700"
                        }`}
                    >
                      {level === "low" ? "Bassa" : level === "medium" ? "Media" : "Alta"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Note */}
            <View className="my-3">
              <Text
                className={`mb-2 font-semibold ${isDark ? "text-gray-200" : "text-gray-700"
                  }`}
              >
                Note (opzionali)
              </Text>
              <TextInput
                className={`border rounded-xl px-4 py-3 ${isDark
                  ? "bg-zinc-800 border-zinc-700 text-white"
                  : "bg-white border-gray-200 text-gray-900"
                  }`}
                placeholder="Aggiungi eventuali note..."
                placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
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
          <TouchableOpacity
            className="bg-gradient-to-r from-purple-600 to-purple-700 py-4 rounded-xl mt-8 mb-6"
            onPress={handleSave}
          >
            <Text className="text-white font-semibold text-lg text-center">
              Crea Obiettivo
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
