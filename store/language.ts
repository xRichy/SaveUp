import { TRANSLATIONS } from '@/constants/translations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Language = 'en' | 'it';

interface LanguageState {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof TRANSLATIONS['en']) => string;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set, get) => ({
            language: 'en', // Default fallback
            setLanguage: (language) => set({ language }),
            t: (key) => {
                const lang = get().language;
                return TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key] || key;
            },
        }),
        {
            name: 'language-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                // Optional: Auto-detect language on first load if not set
                if (state) {
                    // Logic if needed, but persist handles restoration
                }
            }
        }
    )
);

// Helper hook for cleaner usage in components
export const useLanguage = () => {
    const { language, setLanguage, t } = useLanguageStore();
    return { language, setLanguage, t };
};
