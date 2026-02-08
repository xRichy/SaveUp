// app/(tabs)/settings.tsx
import { MenuCard } from '@/components/ui/MenuCard'; // Import MenuCard
import { ScreenLayout } from '@/components/ui/ScreenLayout'; // Import ScreenLayout
import { useAuthStore } from '@/store/auth';
import { useLanguage } from '@/store/language';
import { useThemeStore } from '@/store/theme';
import {
  Check,
  FileText,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  MessageCircle,
  Moon,
  Shield,
  Star,
  Sun,
  Trash2,
  X
} from 'lucide-react-native'; // Use Lucide icons
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Share,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

export default function SettingsPage() {
  const { theme, toggleTheme } = useThemeStore();
  const { logout, user } = useAuthStore();
  const { language, setLanguage, t } = useLanguage();
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);

  const isDark = theme === 'dark';

  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      t('logoutConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: logout
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('deleteAccount'),
      t('deleteAccountConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              t('confirm'),
              t('deleteAccountTypeVerify'),
              [
                { text: t('cancel'), style: 'cancel' },
                {
                  text: t('deleteAccount'),
                  style: 'destructive',
                  onPress: () => {
                    logout();
                    // Qui chiameresti l'API per eliminare l'account
                    Alert.alert(t('accountDeleted'), t('accountDeletedMsg'));
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleExportData = async () => {
    try {
      // Simula esportazione dati
      const userData = {
        user: user,
        exportDate: new Date().toISOString(),
        // Aggiungere qui altri dati da esportare (goals, etc.)
      };

      const dataString = JSON.stringify(userData, null, 2);

      await Share.share({
        message: 'I tuoi dati Goals App',
        title: 'Export Dati Goals App',
        // Su iOS potresti anche aggiungere un file
      });
    } catch (error) {
      Alert.alert('Errore', t('exportError'));
    }
  };

  const handleContactSupport = () => {
    Alert.alert(
      t('contactSupport'),
      t('contactMethod'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: 'Email',
          onPress: () => Linking.openURL('mailto:support@goalsapp.com?subject=Supporto Goals App')
        },
        {
          text: 'Website',
          onPress: () => Linking.openURL('https://goalsapp.com/support')
        },
      ]
    );
  };

  const handleRateApp = () => {
    const appStoreUrl = 'https://apps.apple.com/app/your-app-id';
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=your.package.name';

    Alert.alert(
      t('rateApp'),
      t('rateAppMsg'),
      [
        { text: t('maybeLater'), style: 'cancel' },
        {
          text: t('rateNow'),
          onPress: () => {
            const url = Platform.OS === 'ios' ? appStoreUrl : playStoreUrl;
            Linking.openURL(url);
          }
        },
      ]
    );
  };

  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mb-2">
      <Text className={`text-lg font-semibold mb-3 px-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {title}
      </Text>
      <View>
        {children}
      </View>
    </View>
  );

  const LanguageOption = ({ lang, label }: { lang: 'en' | 'it', label: string }) => (
    <TouchableOpacity
      onPress={() => {
        setLanguage(lang);
        setLanguageModalVisible(false);
      }}
      className={`flex-row items-center justify-between p-4 rounded-xl mb-2 ${language === lang
        ? (isDark ? 'bg-purple-900/30 border border-purple-500/50' : 'bg-purple-50 border border-purple-200')
        : (isDark ? 'bg-zinc-800' : 'bg-gray-50')
        }`}
    >
      <View className="flex-row items-center">
        <Text className={`text-2xl mr-3`}>
          {lang === 'it' ? '🇮🇹' : '🇬🇧'}
        </Text>
        <Text className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {label}
        </Text>
      </View>
      {language === lang && (
        <Check size={20} color="#7C3AED" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScreenLayout edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-4 py-4">
          <Text className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('settings')}
          </Text>

          {/* Preferenze App */}
          <SettingsSection title={t('appPreferences')}>
            <MenuCard
              icon={isDark ? Moon : Sun}
              title={t('theme')}
              subtitle={`${isDark ? 'Dark' : 'Light'} mode active`}
              rightElement={
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: isDark ? '#374151' : '#E5E7EB', true: '#7C3AED' }}
                  thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#9CA3AF')}
                />
              }
            />
            <MenuCard
              icon={Globe}
              title={t('language')}
              subtitle={language === 'it' ? 'Italiano' : 'English'}
              onPress={() => setLanguageModalVisible(true)}
            />
          </SettingsSection>

          {/* Dati & Privacy */}
          <SettingsSection title={t('dataPrivacy')}>
            <MenuCard
              icon={FileText}
              title={t('exportData')}
              subtitle={t('exportData')}
              onPress={handleExportData}
            />
            <MenuCard
              icon={Shield}
              title={t('privacyPolicy')}
              onPress={() => Linking.openURL('https://goalsapp.com/privacy')}
            />
            <MenuCard
              icon={Info}
              title={t('termsOfService')}
              onPress={() => Linking.openURL('https://goalsapp.com/terms')}
            />
          </SettingsSection>

          {/* Supporto */}
          <SettingsSection title={t('support')}>
            <MenuCard
              icon={HelpCircle}
              title={t('helpCenter')}
              subtitle="FAQ and guides"
              onPress={() => Linking.openURL('https://goalsapp.com/help')}
            />
            <MenuCard
              icon={MessageCircle}
              title={t('contactSupport')}
              subtitle="Need help?"
              onPress={handleContactSupport}
            />
            <MenuCard
              icon={Star}
              title={t('rateApp')}
              subtitle="Leave us a review"
              onPress={handleRateApp}
            />
            <MenuCard
              icon={Info}
              title={t('about')}
              subtitle="Version 1.0.0"
              onPress={() => Alert.alert('Goals App', 'Version 1.0.0\nMade with ❤️')}
            />
          </SettingsSection>

          {/* Zona Pericolosa */}
          <SettingsSection title={t('dangerZone')}>
            <MenuCard
              icon={LogOut}
              title={t('logout')}
              subtitle="Sign out of your account"
              onPress={handleLogout}
              danger
            />
            <MenuCard
              icon={Trash2}
              title={t('deleteAccount')}
              subtitle="Permanently delete account"
              onPress={handleDeleteAccount}
              danger
            />
          </SettingsSection>

          {/* Spazio in fondo */}
          <View className="h-8" />
        </View>

        {/* Language Selection Modal */}
        <Modal
          visible={isLanguageModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setLanguageModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setLanguageModalVisible(false)}>
            <View className="flex-1 justify-end bg-black/50">
              <TouchableWithoutFeedback>
                <View className={`rounded-t-3xl p-6 ${isDark ? 'bg-zinc-900 border-t border-zinc-800' : 'bg-white'}`}>
                  <View className="flex-row justify-between items-center mb-6">
                    <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t('language')}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setLanguageModalVisible(false)}
                      className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full"
                    >
                      <X size={20} color={isDark ? '#FFF' : '#000'} />
                    </TouchableOpacity>
                  </View>

                  <LanguageOption lang="en" label="English" />
                  <LanguageOption lang="it" label="Italiano" />

                  <View className="h-8" />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

      </ScrollView>
    </ScreenLayout>
  );
}