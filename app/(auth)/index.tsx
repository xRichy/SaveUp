// app/auth/index.tsx
import { useAuthStore } from '@/store/auth';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/theme';


const ThemeToggle = ({ isDark, onPress }: { isDark: boolean; onPress: () => void }) => (
    <View className="absolute top-16 right-5 z-10">
        <TouchableOpacity
            onPress={onPress}
            className={`w-12 h-12 rounded-full items-center justify-center shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
        >
            <Text className="text-2xl">{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
    </View>
);

const InputField = ({
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default',
    isDark // Aggiungi isDark come prop
}: {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address';
    isDark: boolean; // Aggiungi il tipo
}) => (
    <View className="mb-4">
        <TextInput
            placeholder={placeholder}
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize="none"
            className={`w-full px-4 py-4 rounded-2xl text-base font-medium shadow-sm ${isDark
                ? 'bg-gray-800 text-white border border-gray-700'
                : 'bg-white text-gray-900 border border-gray-200'
                }`}
        />
    </View>
);

const SocialButton = ({ icon, onPress, isDark }: { icon: string; onPress: () => void, isDark: boolean }) => (
    <TouchableOpacity
        onPress={onPress}
        className={`flex-1 py-4 rounded-2xl mx-1 border shadow-sm ${isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
            }`}
    >
        <Text className="text-center text-2xl">{icon}</Text>
    </TouchableOpacity>
);


export default function AuthScreen() {

    const { theme, toggleTheme } = useThemeStore();
    const { login, register, isLoading } = useAuthStore();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');

    const isDark = theme === 'dark';

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Errore', 'Email e password sono obbligatori');
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            Alert.alert('Errore', 'Le password non coincidono');
            return;
        }

        if (!isLogin && !name) {
            Alert.alert('Errore', 'Il nome è obbligatorio per la registrazione');
            return;
        }

        try {
            const result = isLogin
                ? await login(email, password)
                : await register(name, email, password);

            if (!result.success) {
                Alert.alert('Errore', result.error || 'Operazione fallita');
            }
            // Se success è true, l'utente viene automaticamente reindirizzato dall'app
        } catch (error) {
            Alert.alert('Errore', 'Qualcosa è andato storto');
        }


    };



    return (
        <>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={isDark ? '#111827' : '#F9FAFB'}
            />

            <SafeAreaView className="flex-1">
                <ThemeToggle isDark={isDark} onPress={toggleTheme} />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="flex-1 justify-center px-8 py-12">

                            {/* Animated Header */}
                            <View className="items-center mb-12">

                                <View className={`rounded-3xl mb-8 items-center justify-center shadow-2xl ${isDark
                                    ? 'bg-gradient-to-br from-blue-600 to-purple-700'
                                    : 'bg-gradient-to-br from-blue-500 to-purple-600'
                                    }`}>
                                    <Text className="text-8xl pt-2">{isLogin ? '🎯' : '🥳'}</Text>
                                </View>

                                <Text className={`text-4xl font-bold mb-3 text-center ${isDark ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    {isLogin ? 'Bentornato!' : 'Iniziamo!'}
                                </Text>

                                <Text className={`text-lg text-center leading-6 ${isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                    {isLogin
                                        ? 'Accedi per continuare il tuo percorso verso i tuoi obiettivi'
                                        : 'Crea un account e inizia a trasformare i tuoi sogni in realtà'
                                    }
                                </Text>
                            </View>

                            {/* Form Container */}
                            <View className={`p-6 rounded-3xl mb-8 shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
                                }`}>
                                {!isLogin && (
                                    <InputField
                                        placeholder="Nome completo"
                                        value={name}
                                        onChangeText={setName}
                                        isDark={isDark} // Passa la prop
                                    />
                                )}

                                <InputField
                                    placeholder="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    isDark={isDark} // Passa la prop
                                />

                                <InputField
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    isDark={isDark} // Passa la prop
                                />

                                {!isLogin && (
                                    <InputField
                                        placeholder="Conferma password"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                        isDark={isDark} // Passa la prop
                                    />
                                )}

                                {/* Forgot Password - Solo per login */}
                                {isLogin && (
                                    <TouchableOpacity className="mb-6">
                                        <Text className={`text-right text-base font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'
                                            }`}>
                                            Password dimenticata?
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                {/* Auth Button */}
                                <TouchableOpacity
                                    onPress={handleAuth}
                                    disabled={isLoading}
                                    className={`w-full py-5 rounded-2xl mb-6 shadow-lg ${isLoading
                                        ? (isDark ? 'bg-gray-700' : 'bg-gray-300')
                                        : 'bg-gradient-to-r from-blue-500 to-purple-600'
                                        }`}
                                >
                                    <Text className="text-white text-center text-lg font-bold">
                                        {isLoading
                                            ? (isLogin ? 'Accesso in corso...' : 'Registrazione in corso...')
                                            : (isLogin ? 'Accedi' : 'Registrati')
                                        }
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Social Login Section */}
                            <View className="mb-8">
                                <View className="flex-row items-center mb-6">
                                    <View className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'
                                        }`} />
                                    <Text className={`mx-6 text-base font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                        oppure continua con
                                    </Text>
                                    <View className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'
                                        }`} />
                                </View>

                                <View className="flex-row justify-between">
                                    <SocialButton
                                        icon="🍎"
                                        onPress={() => Alert.alert('Apple Login', 'Funzionalità in arrivo!')}
                                        isDark={isDark} // Passa la prop
                                    />
                                    <SocialButton
                                        icon="🔍"
                                        onPress={() => Alert.alert('Google Login', 'Funzionalità in arrivo!')}
                                        isDark={isDark} // Passa la prop
                                    />
                                    <SocialButton
                                        icon="👤"
                                        onPress={() => Alert.alert('Facebook Login', 'Funzionalità in arrivo!')}
                                        isDark={isDark} // Passa la prop
                                    />
                                </View>
                            </View>

                            {/* Switch between Login/Register */}
                            <View className="flex-row justify-center items-center">
                                <Text className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {isLogin ? 'Non hai un account? ' : 'Hai già un account? '}
                                </Text>
                                <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                                    <Text className={`text-base font-bold underline ${isDark ? 'text-blue-400' : 'text-blue-600'
                                        }`}>
                                        {isLogin ? 'Registrati ora' : 'Accedi qui'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Terms and Privacy - Solo per registrazione */}
                            {!isLogin && (
                                <View className="mt-8">
                                    <Text className={`text-center text-sm leading-5 ${isDark ? 'text-gray-500' : 'text-gray-500'
                                        }`}>
                                        Registrandoti accetti i nostri{' '}
                                        <Text className={isDark ? 'text-blue-400' : 'text-blue-600'}>
                                            Termini di Servizio
                                        </Text>{' '}
                                        e l'{' '}
                                        <Text className={isDark ? 'text-blue-400' : 'text-blue-600'}>
                                            Informativa Privacy
                                        </Text>
                                    </Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}