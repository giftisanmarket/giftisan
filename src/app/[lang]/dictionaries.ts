import 'server-only'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  ar: () => import('./dictionaries/ar.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries

export const hasLocale = (locale?: string | null): locale is Locale =>
  typeof locale === 'string' && locale in dictionaries

export const getDictionary = async (locale?: Locale | string | null) => {
  const safeLocale: Locale = (locale && hasLocale(locale)) ? locale : 'en';
  return dictionaries[safeLocale]();
}
