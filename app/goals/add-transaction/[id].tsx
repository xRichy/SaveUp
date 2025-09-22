// app/goals/add-transaction/[id].tsx

import { GoalTransaction, useGoalsState } from '@/store/goals';
import { useThemeStore } from '@/store/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { parse } from 'date-fns';
import { ArrowLeft } from 'lucide-react-native';

const TransactionGoal = () => {
    const { id } = useLocalSearchParams();

    const router = useRouter();

    const { addTransaction } = useGoalsState();

    const { goals } = useGoalsState();
    const { theme } = useThemeStore();

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

        console.log("Salvataggio transazione...");
        console.log("Transaction of Goal ID to save: ", id);

        if (!transaction.amount || transaction.amount === 0 || transaction.amount < 0) {
            alert("Inserisci un importo valido maggiore di 0");
            return;
        }
        if (!id || typeof id !== 'string') {
            console.log("ID obiettivo non valido: ", typeof id, id);
            alert("ID obiettivo non valido");
            router.back();
            return;
        }

        const result = addTransaction(parseInt(id), transaction)

        if (!result.success) {
            console.log("Errore nell'aggiunta della transazione: ", result.error);
            alert("Errore nell'aggiunta della transazione: " + result.error);
            return;
        }
        
        console.log("Transazione aggiunta con successo");
        console.log("Transaction: ", transaction);

        router.back();
    }



    const isDark = theme === "dark";

    return (
        <>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />
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
                        Nuova Transazione
                    </Text>
                    <TouchableOpacity onPress={handleSave}>
                        <Text className="text-purple-600 font-semibold">Salva</Text>
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}>
                    <ScrollView
                        className="flex-1 px-6 py-6"
                        contentContainerStyle={{ paddingBottom: 20 }} // Un po' di spazio in fondo
                        keyboardShouldPersistTaps="handled">


                        {/* Form */}
                        <View className="space-y-6 my-auto">


                            {/* Importo Target */}
                            <View className="my-3">
                                <Text
                                    className={`mb-2 font-semibold ${isDark ? "text-gray-200" : "text-gray-700"
                                        }`}
                                >
                                    Quanto hai risparmiato?
                                </Text>
                                <View
                                    className={`border rounded-xl px-4 py-3 flex-row items-center ${isDark
                                        ? "bg-zinc-800 border-zinc-700"
                                        : "bg-white border-gray-200"
                                        }`}
                                >
                                    <Text className="text-gray-500 mr-2">€</Text>
                                    <TextInput
                                        className={`w-full ${isDark ? "text-white" : "text-gray-900"
                                            }`}
                                        placeholder="0"
                                        placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
                                        value={transaction.amount.toString()}
                                        onChangeText={(text) =>
                                            setTransaction({ ...transaction, amount: parseFloat(text) || 0 })
                                        }
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>


                            {/* Deadline */}
                            <View className="my-3">
                                <Text className={`mb-2 font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                                    Data
                                </Text>

                                <DateTimePicker
                                    value={transaction.date || new Date()}
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
                                    value={transaction.note}
                                    onChangeText={(text) =>
                                        setTransaction({ ...transaction, note: text })
                                    }
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                />
                            </View>



                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

        </>
    )
}

export default TransactionGoal