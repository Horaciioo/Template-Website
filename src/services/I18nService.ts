import { ConfigurationService } from '@/services/ConfigurationService'
import { Service } from '@/structures/Service'

const { locales, regions, defaultLocale, localePrefix } = ConfigurationService.localization

// Offset from ASCII letters to regional indicator symbols
const FLAG_CODE_POINT_OFFSET = 0x1f1e6 - 65

// Localization service
class I18nServiceClass extends Service {
  locales = locales as readonly string[]
  defaultLocale = defaultLocale
  localePrefix = localePrefix as 'as-needed' | 'always' | 'never'

  /**
   * Check locale
   * @param {string | undefined} value - Locale value
   * @return {boolean} - Supported flag
   */

  isSupported = (value: string | undefined): value is string =>
    typeof value === 'string' && locales.includes(value)

  /**
   * Resolve locale
   * @param {string | undefined} value - Locale candidate
   * @return {string} - Resolved locale
   */

  resolve = (value: string | undefined): string =>
    typeof value === 'string' && locales.includes(value) ? value : defaultLocale

  /**
   * Alternate locales
   * @param {string} current - Current locale
   * @return {string[]} - Alternatives
   */

  alternatesOf = (current: string): string[] => locales.filter((locale) => locale !== current)

  /**
   * Locale flag
   * @param {string} locale - Locale code
   * @return {string} - Flag emoji
   */

  flagOf = (locale: string): string =>
    String.fromCodePoint(
      ...Array.from(
        (regions as Record<string, string>)[locale] ?? '',
        (letter) => letter.charCodeAt(0) + FLAG_CODE_POINT_OFFSET
      )
    )

  /**
   * Locale endonym
   * @param {string} locale - Locale code
   * @return {string} - Language name
   */

  languageNameOf = (locale: string): string =>
    new Intl.DisplayNames([locale], { type: 'language' }).of(locale) ?? locale

  /**
   * Load messages
   * @param {string} locale - Locale to load
   * @return {Promise<Record<string, unknown>>} - Messages
   */

  loadMessages = async (locale: string): Promise<Record<string, unknown>> => {
    const resolved = locales.includes(locale) ? locale : defaultLocale
    const loaded = (await import(`../configurations/windows/messages/${resolved}.json`)) as {
      default: Record<string, unknown>
    }

    return loaded.default
  }
}

// Localization service
export const I18nService = new I18nServiceClass('i18n')
