import { useAuthStore } from '@/store/auth';
import { useThemeStore } from '@/store/theme';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  Share,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsPage() {
  const { theme, toggleTheme } = useThemeStore();
  const { logout, user } = useAuthStore();
  const systemScheme = useColorScheme();
  const isDark = theme === 'dark';
  
  // Stati per le varie opzioni
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Sei sicuro di voler uscire dal tuo account?',
      [
        { text: 'Annulla', style: 'cancel' },
        { 
          text: 'Esci', 
          style: 'destructive',
          onPress: logout 
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Elimina Account',
      'Questa azione eliminerà permanentemente il tuo account e tutti i tuoi dati. Questa operazione non può essere annullata.',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Conferma',
              'Scrivi "ELIMINA" per confermare l\'eliminazione del tuo account',
              [
                { text: 'Annulla', style: 'cancel' },
                {
                  text: 'Elimina Account',
                  style: 'destructive',
                  onPress: () => {
                    logout();
                    // Qui chiameresti l'API per eliminare l'account
                    Alert.alert('Account eliminato', 'Il tuo account è stato eliminato con successo.');
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
      Alert.alert('Errore', 'Impossibile esportare i dati');
    }
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contatta Supporto',
      'Come preferisci contattarci?',
      [
        { text: 'Annulla', style: 'cancel' },
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
    // Sostituisci con il tuo app store link
    const appStoreUrl = 'https://apps.apple.com/app/your-app-id';
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=your.package.name';
    
    Alert.alert(
      'Valuta l\'App',
      'Ti piace Goals App? Lasciaci una recensione!',
      [
        { text: 'Forse dopo', style: 'cancel' },
        { 
          text: 'Valuta ora', 
          onPress: () => {
            // Determina quale store aprire basato sulla piattaforma
            const url = Platform.OS === 'ios' ? appStoreUrl : playStoreUrl;
            Linking.openURL(url);
          }
        },
      ]
    );
  };

  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mb-6">
      <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {title}
      </Text>
      <View className={`rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        {children}
      </View>
    </View>
  );

  const SettingsRow = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement, 
    isLast = false,
    danger = false 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    isLast?: boolean;
    danger?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-4 flex-row items-center ${!isLast ? 'border-b' : ''} ${
        isDark ? 'border-gray-700' : 'border-gray-100'
      }`}
      disabled={!onPress}
    >
      <Text className="text-2xl mr-4">{icon}</Text>
      <View className="flex-1">
        <Text className={`text-base font-medium ${
          danger 
            ? 'text-red-500' 
            : isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </Text>
        {subtitle && (
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement && (
        <View className="ml-2">
          {rightElement}
        </View>
      )}
      {onPress && !rightElement && (
        <Text className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          <Text className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Impostazioni
          </Text>

          {/* Account */}
          <SettingsSection title="Account">
            <SettingsRow
              icon="👤"
              title="Profilo"
              subtitle={user?.email || 'Gestisci il tuo profilo'}
              onPress={() => {/* Naviga al profilo */}}
            />
            <SettingsRow
              icon="🔐"
              title="Privacy & Sicurezza"
              subtitle="Gestisci la privacy del tuo account"
              onPress={() => {/* Naviga alle impostazioni privacy */}}
            />
            <SettingsRow
              icon="☁️"
              title="Backup & Sync"
              subtitle="Backup automatico abilitato"
              rightElement={
                <Switch
                  value={autoBackup}
                  onValueChange={setAutoBackup}
                  trackColor={{ false: isDark ? '#374151' : '#E5E7EB', true: '#3B82F6' }}
                  thumbColor={autoBackup ? '#FFFFFF' : '#9CA3AF'}
                />
              }
              isLast
            />
          </SettingsSection>

          {/* Preferenze App */}
          <SettingsSection title="Preferenze App">
            <SettingsRow
              icon={isDark ? "🌙" : "☀️"}
              title="Tema"
              subtitle={`Modalità ${isDark ? 'scura' : 'chiara'} attiva`}
              rightElement={
                <TouchableOpacity
                  onPress={toggleTheme}
                  className={`px-3 py-1 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}
                >
                  <Text className="text-lg">{isDark ? "🌙" : "☀️"}</Text>
                </TouchableOpacity>
              }
            />
            <SettingsRow
              icon="🔔"
              title="Notifiche"
              subtitle="Ricevi promemoria per i tuoi obiettivi"
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: isDark ? '#374151' : '#E5E7EB', true: '#3B82F6' }}
                  thumbColor={notificationsEnabled ? '#FFFFFF' : '#9CA3AF'}
                />
              }
            />
            <SettingsRow
              icon="👆"
              title="Autenticazione Biometrica"
              subtitle="Usa Face ID o impronte digitali"
              rightElement={
                <Switch
                  value={biometricsEnabled}
                  onValueChange={setBiometricsEnabled}
                  trackColor={{ false: isDark ? '#374151' : '#E5E7EB', true: '#3B82F6' }}
                  thumbColor={biometricsEnabled ? '#FFFFFF' : '#9CA3AF'}
                />
              }
              isLast
            />
          </SettingsSection>

          {/* Dati & Privacy */}
          <SettingsSection title="Dati & Privacy">
            <SettingsRow
              icon="📊"
              title="Analisi Utilizzo"
              subtitle="Aiutaci a migliorare l'app"
              rightElement={
                <Switch
                  value={analyticsEnabled}
                  onValueChange={setAnalyticsEnabled}
                  trackColor={{ false: isDark ? '#374151' : '#E5E7EB', true: '#3B82F6' }}
                  thumbColor={analyticsEnabled ? '#FFFFFF' : '#9CA3AF'}
                />
              }
            />
            <SettingsRow
              icon="📁"
              title="Esporta Dati"
              subtitle="Scarica tutti i tuoi dati"
              onPress={handleExportData}
            />
            <SettingsRow
              icon="🔒"
              title="Privacy Policy"
              onPress={() => Linking.openURL('https://goalsapp.com/privacy')}
            />
            <SettingsRow
              icon="📜"
              title="Termini di Servizio"
              onPress={() => Linking.openURL('https://goalsapp.com/terms')}
              isLast
            />
          </SettingsSection>

          {/* Supporto */}
          <SettingsSection title="Supporto">
            <SettingsRow
              icon="❓"
              title="Centro Assistenza"
              subtitle="FAQ e guide"
              onPress={() => Linking.openURL('https://goalsapp.com/help')}
            />
            <SettingsRow
              icon="💬"
              title="Contatta Supporto"
              subtitle="Hai bisogno di aiuto?"
              onPress={handleContactSupport}
            />
            <SettingsRow
              icon="⭐"
              title="Valuta l'App"
              subtitle="Lasciaci una recensione"
              onPress={handleRateApp}
            />
            <SettingsRow
              icon="ℹ️"
              title="Informazioni"
              subtitle="Versione 1.0.0"
              onPress={() => Alert.alert('Goals App', 'Versione 1.0.0\nSviluppata con ❤️')}
              isLast
            />
          </SettingsSection>

          {/* Zona Pericolosa */}
          <SettingsSection title="Zona Pericolosa">
            <SettingsRow
              icon="🚪"
              title="Logout"
              subtitle="Esci dal tuo account"
              onPress={handleLogout}
              danger
            />
            <SettingsRow
              icon="🗑️"
              title="Elimina Account"
              subtitle="Elimina permanentemente il tuo account"
              onPress={handleDeleteAccount}
              danger
              isLast
            />
          </SettingsSection>

          {/* Spazio in fondo */}
          <View className="h-8" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}