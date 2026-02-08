// app/goals/add-transaction/[id].tsx

import { GradientButton } from '@/components/ui/GradientButton'; // Import GradientButton
import { ScreenLayout } from '@/components/ui/ScreenLayout'; // Import ScreenLayout
import { GoalTransaction, useGoalsState } from '@/store/goals';
import { useThemeStore } from '@/store/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const TransactionGoal = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { addTransaction } = useGoalsState();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const [transaction, setTransaction] = useState<GoalTransaction>({
        id: '',
        amount: 0,
        date: new Date(),
        note: ''
    });

    const onChangeDate = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || transaction.date;
        setTransaction({ ...transaction, date: currentDate });
    }

    const handleSave = () => {
        if (!transaction.amount || transaction.amount <= 0) {
            alert("Please enter a valid amount greater than 0");
            return;
        }
        if (!id || typeof id !== 'string') {
            alert("Invalid goal ID");
            router.back();
            return;
        }

        const result = addTransaction(parseInt(id), transaction)

        if (!result.success) {
            alert("Error adding transaction: " + result.error);
            return;
        }

        router.back();
    }

    return (
        <ScreenLayout edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}>

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
                        Add Transaction
                    </Text>
                    <View className="w-10" />
                </View>

                <ScrollView
                    className="flex-1 px-6"
                    contentContainerStyle={{ paddingBottom: 50 }}
                    keyboardShouldPersistTaps="handled">

                    {/* Form */}
                    <View className="space-y-6 mt-6">

                        {/* Amount */}
                        <View className="mb-4">
                            <Text
                                className="mb-2 font-semibold text-gray-700 dark:text-gray-200"
                            >
                                Amount Saved
                            </Text>
                            <View
                                className="border rounded-xl px-4 py-4 flex-row items-center bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                            >
                                <Text className="text-gray-500 mr-2 text-lg">€</Text>
                                <TextInput
                                    className="w-full text-lg text-gray-900 dark:text-white"
                                    placeholder="0"
                                    placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                                    value={transaction.amount > 0 ? transaction.amount.toString() : ''}
                                    onChangeText={(text) =>
                                        setTransaction({ ...transaction, amount: parseFloat(text) || 0 })
                                    }
                                    keyboardType="numeric"
                                    autoFocus
                                />
                            </View>
                        </View>


                        {/* Date */}
                        <View className="mb-4">
                            <Text className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
                                Date
                            </Text>
                            <View className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden">
                                <DateTimePicker
                                    value={transaction.date || new Date()}
                                    mode="date"
                                    display="spinner"
                                    onChange={onChangeDate}
                                    textColor={isDark ? "#FFFFFF" : "#000000"}
                                    style={{ height: 120 }}
                                />
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
                                value={transaction.note}
                                onChangeText={(text) =>
                                    setTransaction({ ...transaction, note: text })
                                }
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                            />
                        </View>

                        {/* Save Button */}
                        <View className="w-full items-center mt-6">
                            <GradientButton
                                title="Save Transaction"
                                onPress={handleSave}
                                className="w-full shadow-lg shadow-purple-500/20"
                            />
                        </View>

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenLayout>
    )
}

export default TransactionGoal