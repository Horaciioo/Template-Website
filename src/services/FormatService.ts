import { ConfigurationService } from '@/services/ConfigurationService'
import { Service } from '@/structures/Service'
import {
  DATE_PRESETS,
  formatDate,
  formatRelative,
  monthLabels,
  weekdayLabels,
} from '@/utils/format/date'
import type { DatePreset } from '@/utils/format/date'
import {
  EMPTY_VALUE,
  formatBytes,
  formatCurrency,
  formatCurrencyParts,
  formatNumber,
  formatPercent,
} from '@/utils/format/number'

const { timeZone, currency, defaultLocale, firstDayOfWeek } = ConfigurationService.localization

export interface Formatter {
  locale: string
  number: (value: number | null | undefined, fractionDigits?: number) => string
  currency: (amountCents: number) => string
  currencyParts: (amountCents: number) => { amount: string; symbol: string }
  percent: (value: number, fractionDigits?: number) => string
  bytes: (bytes: number) => string
  date: (value: Date | string | null | undefined, preset?: DatePreset) => string
  relative: (value: Date) => string
  weekdays: (width?: 'long' | 'short' | 'narrow') => string[]
  months: (width?: 'long' | 'short') => string[]
}

const formatters = new Map<string, Formatter>()

class FormatServiceClass extends Service {
  presets = Object.keys(DATE_PRESETS) as DatePreset[]
  emptyValue = EMPTY_VALUE

  /**
   * Get formatter for locale
   * @param {string} [locale] - Active locale
   * @return {Formatter} - Formatter instance
   */

  for = (locale: string = defaultLocale): Formatter => {
    const existing = formatters.get(locale)
    if (existing) return existing

    const formatting = { locale, timeZone }
    const created: Formatter = {
      locale,
      number: (value, fractionDigits) => formatNumber(value, locale, fractionDigits),
      currency: (amountCents) => formatCurrency(amountCents, { locale, currency }),
      currencyParts: (amountCents) => formatCurrencyParts(amountCents, { locale, currency }),
      percent: (value, fractionDigits) => formatPercent(value, locale, fractionDigits),
      bytes: (bytes) => formatBytes(bytes, locale),
      date: (value, preset) => formatDate(value, formatting, preset),
      relative: (value) => formatRelative(value, formatting),
      weekdays: (width) => weekdayLabels(locale, firstDayOfWeek, width),
      months: (width) => monthLabels(locale, width),
    }

    formatters.set(locale, created)

    return created
  }
}

// Locale-aware formatters
export const FormatService = new FormatServiceClass('format')
