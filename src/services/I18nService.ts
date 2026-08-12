import { ConfigurationService } from '@/services/ConfigurationService'
import { Service } from '@/structures/Service'

const { locales, defaultLocale, localePrefix } = ConfigurationService.localization

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
