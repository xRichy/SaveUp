// app/(tabs)/profile.tsx
import { Card } from '@/components/ui/Card';
import { MenuCard } from '@/components/ui/MenuCard'; // Import MenuCard
import { ScreenLayout } from '@/components/ui/ScreenLayout';
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
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuthStore } from '../../store/auth';
import { useThemeStore } from '../../store/theme';

export default function ProfileScreen() {
  const { user, updateProfile, logout } = useAuthStore();
  const { theme } = useThemeStore();
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

  return (
    <ScreenLayout edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-4"
      >
        {/* Header con gradiente */}
        <Card className="mt-4 mb-6 p-0 rounded-3xl overflow-hidden shadow-lg border-0">
          <LinearGradient
            colors={['#7C3AED', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl p-3"
          >
            <View className="flex-row justify-between items-center mb-8 p-3">
              <Text className="text-2xl font-bold text-white">My Profile</Text>

              {!isEditing ? (
                <TouchableOpacity
                  onPress={handleStartEdit}
                  className="bg-white/20 p-2 rounded-xl"
                >
                  <Edit3 size={20} color="white" />
                </TouchableOpacity>
              ) : (
                <View className="flex-row space-x-2 gap-2">
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
                <View className="w-32 h-32 rounded-full overflow-hidden bg-white/20 items-center justify-center border-4 border-white/10">
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
                {user?.name || 'Utente'}
              </Text>
              <Text className="text-purple-100 opacity-90">
                {user?.email || 'email@example.com'}
              </Text>
            </View>
          </LinearGradient>
        </Card>

        {/* Form di modifica (se in modalità editing) */}
        {isEditing && (
          <View className="mx-1 mb-6">
            <View className={`p-4 rounded-3xl ${isDark ? 'bg-zinc-900/50' : 'bg-white'} border border-gray-100 dark:border-zinc-800`}>
              <Text className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Edit Profile
              </Text>

              {/* Nome */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Name
                </Text>
                <View className={`flex-row items-center border rounded-xl px-4 py-3 ${isDark
                  ? 'bg-zinc-800 border-zinc-700'
                  : 'bg-gray-50 border-gray-200'
                  }`}>
                  <User size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    className={`ml-3 flex-1 ${isDark ? 'text-white' : 'text-gray-900'}`}
                    placeholder="Your Name"
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  />
                </View>
              </View>

              {/* Email */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-gray-700 dark:text-gray-300">
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
                    className={`ml-3 flex-1 ${isDark ? 'text-white' : 'text-gray-900'}`}
                    placeholder="Your Email"
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Account info */}
        <View className="px-1 mb-4">
          <MenuCard
            icon={LogOut}
            title="Logout"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            danger={true}
          />
        </View>

        <View className="items-center mt-2 mb-8">
          <Text className="text-sm text-gray-400 dark:text-gray-600">
            Member since {user?.createdAt ?
              new Date(user.createdAt).toLocaleDateString() :
              'Unknown'
            }
          </Text>
        </View>

      </ScrollView>
    </ScreenLayout>
  );
}