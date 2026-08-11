import { ConfigurationService } from '@/services/ConfigurationService'

const { locales, defaultLocale, localePrefix } = ConfigurationService.localization

// Localization service
export const I18nService = {
  locales: locales as readonly string[],
  defaultLocale,
  localePrefix: localePrefix as 'as-needed' | 'always' | 'never',

  /**
   * Check that a segment of the URL is a supported locale
   * @param {string | undefined} value - Candidate segment
   * @return {boolean} - Supported locale flag
   */

  isSupported: (value: string | undefined): value is string =>
    typeof value === 'string' && locales.includes(value),

  /**
   * Resolve the locale to render, falling back to the configured default
   * @param {string | undefined} value - Candidate locale
   * @return {string} - Locale to render
   */

  resolve: (value: string | undefined): string =>
    typeof value === 'string' && locales.includes(value) ? value : defaultLocale,

  /**
   * Locales other than the current one, the list a language switcher offers
   * @param {string} current - Active locale
   * @return {string[]} - Remaining locales
   */

  alternatesOf: (current: string): string[] => locales.filter((locale) => locale !== current),

  /**
   * Load the messages of a locale, the single import path of messages/<locale>.json
   * @param {string} locale - Locale to load
   * @return {Promise<Record<string, unknown>>} - Message tree
   */

  loadMessages: async (locale: string): Promise<Record<string, unknown>> => {
    const resolved = locales.includes(locale) ? locale : defaultLocale
    const loaded = (await import(`../../messages/${resolved}.json`)) as {
      default: Record<string, unknown>
    }

    return loaded.default
  },
} as const
