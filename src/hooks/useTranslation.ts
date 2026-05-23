import { useLanguageStore } from '@/store/useLanguageStore';
import { translations } from '@/locales';

type NestedKeyOf<ObjectType extends object> = 
{[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object 
? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
: `${Key}`
}[keyof ObjectType & (string | number)];

type TranslationKey = NestedKeyOf<typeof translations.id>;

export function useTranslation() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const dict = translations[language] || translations.id;

  // Provide a function to access nested keys like 'nav.dashboard'
  const t = (key: TranslationKey | string): string => {
    const keys = key.split('.');
    let current: any = dict;
    
    for (const k of keys) {
      if (current[k] === undefined) {
        console.warn(`Missing translation key: ${key}`);
        return key;
      }
      current = current[k];
    }
    
    return current;
  };

  return { t, language, setLanguage };
}
