// app/(tabs)/profile.tsx
import { Card } from '@/components/ui/Card';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Camera,
  Check,
  Edit3,
  LogOut,
  Mail,
  User,
  X
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/auth';
import { useThemeStore } from '../../store/theme';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, updateProfile, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalName, setOriginalName] = useState(user?.name || '');
  const [originalEmail, setOriginalEmail] = useState(user?.email || '');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Errore', 'Il nome non può essere vuoto');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Errore', 'Inserisci un\'email valida');
      return;
    }

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      avatar: avatar ?? undefined
    });

    setOriginalName(name);
    setOriginalEmail(email);
    setIsEditing(false);
    Alert.alert('✅ Successo', 'Profilo aggiornato con successo!');
  };

  const handleCancel = () => {
    setName(originalName);
    setEmail(originalEmail);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setOriginalName(name);
    setOriginalEmail(email);
    setIsEditing(true);
  };

  const pickImage = async () => {
    // Richiedi permessi per accedere alla galleria
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permesso necessario', 'È necessario concedere l\'accesso alla galleria per cambiare l\'avatar');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
      updateProfile({ avatar: result.assets[0].uri });
    }
  };

  const takePhoto = async () => {
    // Richiedi permessi per la fotocamera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permesso necessario', 'È necessario concedere l\'accesso alla fotocamera per scattare una foto');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
      updateProfile({ avatar: result.assets[0].uri });
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Scegli foto',
      'Come vuoi aggiungere la tua foto profilo?',
      [
        { text: 'Galleria', onPress: pickImage },
        { text: 'Fotocamera', onPress: takePhoto },
        { text: 'Annulla', style: 'cancel' }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Conferma logout',
      'Sei sicuro di voler uscire?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Esci',
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  type MenuCardProps = {
    icon: React.ComponentType<{ size?: number; color?: string }>;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showArrow?: boolean;
    danger?: boolean;
  };

  const MenuCard: React.FC<MenuCardProps> = ({ icon: Icon, title, subtitle, onPress, showArrow = true, danger = false }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`mx-4 mb-3 p-4 rounded-2xl flex-row items-center ${isDark ? 'bg-zinc-900' : 'bg-white'
        } shadow-sm`}
      style={{
        shadowColor: isDark ? '#000' : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className={`p-3 rounded-xl mr-4 ${danger
        ? 'bg-red-100'
        : isDark
          ? 'bg-purple-900/30'
          : 'bg-purple-100'
        }`}>
        <Icon
          size={22}
          color={
            danger
              ? '#EF4444'
              : isDark
                ? '#A855F7'
                : '#7C3AED'
          }
        />
      </View>

      <View className="flex-1">
        <Text className={`font-semibold text-base ${danger
          ? 'text-red-600'
          : isDark
            ? 'text-white'
            : 'text-gray-900'
          }`}>
          {title}
        </Text>
        {subtitle && (
          <Text className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
            {subtitle}
          </Text>
        )}
      </View>

      {showArrow && (
        <View className={`p-1 ${isDark ? 'text-gray-400' : 'text-gray-400'
          }`}>
          <Text className="text-lg">›</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#F9FAFB'}
      />

      <SafeAreaView className={`flex-1 ${isDark ? "bg-black" : "bg-white"}`}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header con gradiente */}
          <Card className={`m-6 p-0 rounded-3xl overflow-hidden shadow-lg`}>
            <LinearGradient
              colors={isDark
                ? ['#7C3AED', '#3B82F6']
                : ['#8B5CF6', '#06B6D4']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="px-6 pt-8 pb-12 mb-9 p-3"
            >
              <View className="flex-row justify-between items-center mb-8 p-3">
                <Text className="text-2xl font-bold text-white">Il Mio Profilo</Text>

                {!isEditing ? (
                  <TouchableOpacity
                    onPress={handleStartEdit}
                    className="bg-white/20 p-2 rounded-xl backdrop-blur-sm"
                  >
                    <Edit3 size={20} color="white" />
                  </TouchableOpacity>
                ) : (
                  <View className="flex-row space-x-2">
                    <TouchableOpacity
                      onPress={handleCancel}
                      className="bg-red-500/80 p-2 rounded-xl"
                    >
                      <X size={18} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSave}
                      className="bg-green-500/80 p-2 rounded-xl"
                    >
                      <Check size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Avatar Section */}
              <View className="items-center mb-3">
                <TouchableOpacity
                  onPress={showImageOptions}
                  className="relative mb-4"
                  activeOpacity={0.8}
                >
                  <View className="w-32 h-32 rounded-full overflow-hidden bg-white/20 items-center justify-center">
                    {avatar ? (
                      <Image
                        source={{ uri: avatar }}
                        className="w-full h-full rounded-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <Text className="text-4xl text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || '👤'}
                      </Text>
                    )}
                  </View>

                  {/* Camera overlay */}
                  <View className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg">
                    <Camera size={16} color="#7C3AED" />
                  </View>
                </TouchableOpacity>

                <Text className="text-xl font-bold text-white mb-1">
                  {user?.name || 'Nome utente'}
                </Text>
                <Text className="text-purple-100 opacity-90">
                  {user?.email || 'email@esempio.com'}
                </Text>
              </View>
            </LinearGradient>
          </Card>

          {/* Form di modifica (se in modalità editing) */}
          {isEditing && (
            <View className="mx-4 mb-6">
              <View className={`p-4 rounded-2xl ${isDark ? 'bg-zinc-900' : 'bg-white'
                } shadow-sm`}>
                <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                  Modifica Profilo
                </Text>

                {/* Nome */}
                <View className="mb-4">
                  <Text className={`mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    Nome
                  </Text>
                  <View className={`flex-row items-center border rounded-xl px-4 py-3 ${isDark
                    ? 'bg-zinc-800 border-zinc-700'
                    : 'bg-gray-50 border-gray-200'
                    }`}>
                    <User size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      className={`ml-3 flex-1 ${isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      placeholder="Inserisci il tuo nome"
                      placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                    />
                  </View>
                </View>

                {/* Email */}
                <View className="mb-4">
                  <Text className={`mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    Email
                  </Text>
                  <View className={`flex-row items-center border rounded-xl px-4 py-3 ${isDark
                    ? 'bg-zinc-800 border-zinc-700'
                    : 'bg-gray-50 border-gray-200'
                    }`}>
                    <Mail size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className={`ml-3 flex-1 ${isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      placeholder="Inserisci la tua email"
                      placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}



          {/* Stats Card */}
          <View className={`mx-4 mt-6 p-4 rounded-2xl ${isDark ? 'bg-zinc-900' : 'bg-white'
            } shadow-sm`}>
            <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Le tue statistiche
            </Text>

            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'
                  }`}>
                  12
                </Text>
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Obiettivi
                </Text>
              </View>

              <View className="items-center">
                <Text className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'
                  }`}>
                  8
                </Text>
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Completati
                </Text>
              </View>

              <View className="items-center">
                <Text className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                  €2.450
                </Text>
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Risparmiati
                </Text>
              </View>
            </View>
          </View>

          {/* Profile Actions */}
          <View className="px-0 mt-3">
            <Text className={`text-lg font-semibold mb-4 mx-4 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Account
            </Text>
            <MenuCard
              icon={LogOut}
              title="Logout"
              subtitle="Esci dal tuo account"
              onPress={handleLogout}
              danger={true}
            />
          </View>

          {/* Account info */}
          <View className={`mx-4 p-4 rounded-2xl ${isDark ? 'bg-zinc-900' : 'bg-white'
            } shadow-sm`}>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
              } text-center`}>
              Account creato il {user?.createdAt ?
                new Date(user.createdAt).toLocaleDateString('it-IT') :
                'Data non disponibile'
              }
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}