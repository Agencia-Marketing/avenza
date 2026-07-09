import es from './es.json';
import en from './en.json';

export const languages = ['es', 'en'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'es';

const dict = { es, en } as const;

// Runtime type: the ES dictionary is the source of truth for available keys.
export type UIKey = keyof typeof es;

export function isLang(value: string | undefined): value is Lang {
  return value === 'es' || value === 'en';
}

/** Returns a translator bound to `lang`, falling back to Spanish for any missing key. */
export function useTranslations(lang: Lang) {
  const table = dict[lang] as Record<string, string>;
  const fallback = dict.es as Record<string, string>;
  return function t(key: UIKey): string {
    return table[key] ?? fallback[key] ?? String(key);
  };
}

/** Localised label for the "other" language, used by the language switcher. */
export const langLabels: Record<Lang, string> = { es: 'ES', en: 'EN' };
