import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'id' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'id', // Default language is Indonesian
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () => set((state) => ({ language: state.language === 'id' ? 'en' : 'id' })),
    }),
    {
      name: 'stockmate-language-storage',
    }
  )
);
