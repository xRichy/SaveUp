import { ProgressBar } from "@/components/ui/ProgressBar";
import { useGoalsState } from "@/store/goals";
import { useThemeStore } from "@/store/theme";
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GoalDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { goals } = useGoalsState();
  const { theme } = useThemeStore();

  const goal = goals.find((g) => g.id.toString() === id);

  if (!goal) {
    return (
      <View className={`flex-1 items-center justify-center ${theme === "dark" ? "bg-red-900" : "bg-red-50"}`}>
        <Text className={`text-lg font-semibold ${theme === "dark" ? "text-red-300" : "text-red-600"}`}>
          Obiettivo non trovato
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 px-4 py-2 bg-indigo-500 rounded-xl"
        >
          <Text className="text-white"><ChevronLeft /> Torna indietro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progress = Math.min((goal.saved / goal.target) * 100, 100);

  // Palette dinamica in base al tema
  const colors = {
    background: theme === "dark" ? "bg-black" : "bg-white",
    text: theme === "dark" ? "text-white" : "text-black",
    card: theme === "dark" ? "bg-zinc-900" : "bg-gray-50",
    mutedText: theme === "dark" ? "text-gray-400" : "text-gray-500",
    border: theme === "dark" ? "border-gray-700" : "border-gray-200",
    goBackButton: theme === "dark" ? "white" : "black",
  };

  const priorityColors = {
    low: theme === "dark" ? "bg-green-600 text-green-300" : "bg-green-300 text-green-700",
    medium: theme === "dark" ? "bg-yellow-600 text-yellow-300" : "bg-yellow-300 text-yellow-700",
    high: theme === "dark" ? "bg-red-600 text-red-300" : "bg-red-300 text-red-700",
  };

  return (
    <>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />
      <SafeAreaView className={`flex-1 ${colors.background}`} edges={["top"]}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="flex-1 px-6">
          {/* Header */}
          <View className="flex-row items-center justify-between py-4">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft color={colors.goBackButton} size={35}/>
            </TouchableOpacity>
            <Text className={`text-xl font-semibold ${colors.text}`}>Dettagli obiettivo</Text>
            <View className="w-6" />
          </View>

          {/* Card principale */}
          <View className="p-6 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 mb-6">
            <Text className={`text-8xl ${colors.text} opacity-90 mb-1 text-center p-4`}>{goal.emoji}</Text>
            <Text className={`text-4xl font-bold ${colors.text} mb-2`}>
               {goal.name}
            </Text>
            <Text className={`${colors.text} opacity-90 mb-4`}>
              {goal.description || "Nessuna descrizione"}
            </Text>

            <ProgressBar progress={progress} height={14} showGlow colors={["#8B5CF6", "#6366F1"]} />
            <Text className={`mt-3 text-sm ${colors.text} font-medium`}>
              Risparmiati: {goal.saved}€ / {goal.target}€
            </Text>
          </View>

          {/* Info veloci */}
          <View className="flex-row gap-3 mb-6">
            <View className={`flex-1 p-4 rounded-2xl items-center ${colors.card}`}>
              <Text className={`text-xs ${colors.mutedText}`}>Creato il</Text>
              <Text className={`text-sm font-medium ${colors.text}`}>
                {format(new Date(goal.createdAt), "dd MMM yyyy")}
              </Text>
            </View>
            {goal.deadline && (
              <View className={`flex-1 p-4 rounded-2xl items-center ${colors.card}`}>
                <Text className={`text-xs ${colors.mutedText}`}>Scadenza</Text>
                <Text className={`text-sm font-medium ${colors.text}`}>
                  {format(new Date(goal.deadline), "dd MMM yyyy")}
                </Text>
              </View>
            )}
          </View>

          {/* Priorità & Stato */}
          <View className="flex-row gap-3 mb-6">
            <View className={`flex-1 p-4 rounded-2xl items-center ${priorityColors[goal.priority]}`}>
              <Text className="text-xs">Priorità</Text>
              <Text className="font-semibold capitalize">{goal.priority}</Text>
            </View>
            <View className={`flex-1 p-4 rounded-2xl items-center ${colors.card}`}>
              <Text className={`text-xs ${colors.mutedText}`}>Stato</Text>
              <Text className={`text-sm font-medium capitalize ${colors.text}`}>{goal.status}</Text>
            </View>
          </View>

          {/* Note */}
          {goal.notes ? (
            <View className={`p-4 rounded-2xl mb-6 ${colors.card}`}>
              <Text className={`text-sm ${colors.mutedText} mb-1`}>Note</Text>
              <Text className={`text-base ${colors.text}`}>{goal.notes}</Text>
            </View>
          ) : null}

          {/* Storico transazioni */}
          {goal.transactions.length > 0 && (
            <View className={`p-4 rounded-2xl ${colors.card}`}>
              <Text className={`text-sm mb-3 ${colors.mutedText}`}>Storico movimenti</Text>
              {goal.transactions.map((t) => (
                <View key={t.id} className={`flex-row justify-between py-2 border-b ${colors.border} last:border-0`}>
                  <Text className={`text-base ${t.amount >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {t.amount >= 0 ? `+${t.amount}€` : `${t.amount}€`}
                  </Text>
                  <Text className={`text-sm ${colors.mutedText}`}>
                    {format(new Date(t.date), "dd MMM")}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
