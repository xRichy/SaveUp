// app/goals/edit/[id].tsx
import { GradientButton } from '@/components/ui/GradientButton';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { GOAL_CATEGORIES, useGoalsState } from '@/store/goals';
import { useThemeStore } from '@/store/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

type FormData = {
    name: string;
    target: string;
    category: string | null;
    description: string;
    deadline: Date;
    priority: "low" | "medium" | "high";
    notes: string;
};

export default function EditGoalScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { goals, updateGoal, removeGoal } = useGoalsState();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const goalId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';
    const goal = goals.find((g) => g.id.toString() === goalId);

    const [formData, setFormData] = useState<FormData>({
        name: "",
        target: "",
        category: null,
        description: "",
        deadline: new Date(),
        priority: "medium",
        notes: "",
    });

    useEffect(() => {
        if (goal) {
            setFormData({
                name: goal.name,
                target: goal.target.toString(),
                category: goal.category?.id || null,
                description: goal.description || "",
                deadline: goal.deadline ? new Date(goal.deadline) : new Date(),
                priority: goal.priority,
                notes: goal.notes || "",
            });
        }
    }, [goal]);

    const onChangeDate = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || formData.deadline;
        setFormData({ ...formData, deadline: currentDate });
    };

    const handleSave = () => {
        if (!goal) return;

        const selectedCategory = GOAL_CATEGORIES.find(
            (cat) => cat.id === formData.category
        );

        const result = updateGoal(goal.id, {
            name: formData.name.trim(),
            target: Number(formData.target) || 0,
            emoji: selectedCategory?.emoji ?? "🎯",
            category: selectedCategory,
            description: formData.description.trim(),
            deadline: formData.deadline || undefined,
            priority: formData.priority,
            notes: formData.notes.trim(),
        });

        if (!result.success) {
            Alert.alert("Error", result.error || "Failed to update goal");
            return;
        }

        router.back();
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Goal",
            "Are you sure you want to delete this goal? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        if (goal) {
                            const result = removeGoal(goal.id);
                            if (result.success) {
                                router.dismissAll();
                                router.push("/(tabs)");
                            } else {
                                Alert.alert("Error", result.error || "Failed to delete goal");
                            }
                        }
                    },
                },
            ]
        );
    };

    if (!goal) {
        return (
            <ScreenLayout edges={['top']}>
                <View className="flex-1 items-center justify-center">
                    <Text className="text-gray-500 text-lg">Goal not found</Text>
                    <TouchableOpacity onPress={() => router.back()} className="mt-4">
                        <Text className="text-purple-600 font-semibold">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </ScreenLayout>
        );
    }

    const selectedCategory = GOAL_CATEGORIES.find(
        (cat) => cat.id === formData.category
    );

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
                        Edit Goal
                    </Text>
                    <TouchableOpacity
                        onPress={handleDelete}
                        className="w-10 h-10 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20"
                    >
                        <Trash2 size={20} color="#EF4444" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">

                    {/* Form */}
                    <View className="space-y-6">
                        {/* Nome Obiettivo */}
                        <View className="mb-4">
                            <Text
                                className="mb-2 font-semibold text-gray-700 dark:text-gray-200"
                            >
                                Goal Name
                            </Text>
                            <TextInput
                                className="border rounded-xl px-4 py-4 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                                placeholder="e.g. Trip to Japan"
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
                                Target Amount
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
                                Category
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
                                Description (optional)
                            </Text>
                            <TextInput
                                className="border rounded-xl px-4 py-4 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                                placeholder="Add a description..."
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
                                Deadline (optional)
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
                                Priority
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
                                Notes (optional)
                            </Text>
                            <TextInput
                                className="border rounded-xl px-4 py-4 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                                placeholder="Add any notes..."
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

                    {/* Save Button */}
                    <View className="w-full items-center mt-6">
                        <GradientButton
                            title="Save Changes"
                            onPress={handleSave}
                            className="w-full shadow-lg shadow-purple-500/20"
                        />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenLayout>
    );
}
