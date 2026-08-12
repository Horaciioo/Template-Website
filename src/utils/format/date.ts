/**
 * Milliseconds in a day
 * @type {number}
 */

export const DAY_IN_MS = 86_400_000

/**
 * Milliseconds in an hour
 * @type {number}
 */

export const HOUR_IN_MS = 3_600_000

/**
 * Milliseconds in a minute
 * @type {number}
 */

export const MINUTE_IN_MS = 60_000

// Locale and timezone context
export interface DateFormatting {
  locale: string
  timeZone: string
}

/**
 * Date format presets
 * @type {Object}
 */

export const DATE_PRESETS = {
  short: { day: '2-digit', month: '2-digit', year: 'numeric' },
  long: { day: 'numeric', month: 'long', year: 'numeric' },
  monthYear: { month: 'long', year: 'numeric' },
  dayMonth: { day: 'numeric', month: 'short' },
  weekday: { weekday: 'long', day: 'numeric', month: 'long' },
  time: { hour: '2-digit', minute: '2-digit' },
  dateTime: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>

export type DatePreset = keyof typeof DATE_PRESETS

/**
 * Date to UTC midnight
 * @param {Date} date - Source date
 * @return {Date} - UTC midnight
 */

export const startOfUtcDay = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))

/**
 * Date to ISO string
 * @param {Date} date - Source date
 * @return {string} - YYYY-MM-DD format
 */

export const toISODate = (date: Date): string => startOfUtcDay(date).toISOString().slice(0, 10)

/**
 * ISO string to date
 * @param {string} value - YYYY-MM-DD string
 * @return {Date | null} - Parsed date
 */

export const parseISODate = (value: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const parsed = new Date(`${value}T00:00:00.000Z`)

  return Number.isNaN(parsed.getTime()) ? null : parsed
}

/**
 * Format date by preset
 * @param {Date | string | null | undefined} value - Date
 * @param {DateFormatting} formatting - Locale context
 * @param {DatePreset} [preset] - Format preset
 * @return {string} - Formatted date
 */

export const formatDate = (
  value: Date | string | null | undefined,
  formatting: DateFormatting,
  preset: DatePreset = 'short'
): string => {
  const date = typeof value === 'string' ? (parseISODate(value) ?? new Date(value)) : value
  if (!date || Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(formatting.locale, {
    ...DATE_PRESETS[preset],
    timeZone: formatting.timeZone,
  }).format(date)
}

/**
 * Distance between dates
 * @param {Date} date - Target date
 * @param {DateFormatting} formatting - Locale context
 * @param {Date} [reference] - Comparison date
 * @return {string} - Relative description
 */

export const formatRelative = (
  date: Date,
  formatting: DateFormatting,
  reference: Date = new Date()
): string => {
  const elapsed = date.getTime() - reference.getTime()
  const formatter = new Intl.RelativeTimeFormat(formatting.locale, { numeric: 'auto' })
  const thresholds: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', DAY_IN_MS * 365],
    ['month', DAY_IN_MS * 30],
    ['week', DAY_IN_MS * 7],
    ['day', DAY_IN_MS],
    ['hour', HOUR_IN_MS],
    ['minute', MINUTE_IN_MS],
  ]

  const match = thresholds.find(([, span]) => Math.abs(elapsed) >= span)
  if (!match) return formatter.format(0, 'second')

  return formatter.format(Math.round(elapsed / match[1]), match[0])
}

/**
 * Add days to date
 * @param {Date} date - Source date
 * @param {number} days - Days offset
 * @return {Date} - Shifted date
 */

export const addDays = (date: Date, days: number): Date =>
  new Date(date.getTime() + days * DAY_IN_MS)

/**
 * Days between dates
 * @param {Date} from - Start date
 * @param {Date} to - End date
 * @return {number} - Day count
 */

export const differenceInDays = (from: Date, to: Date): number =>
  Math.round((startOfUtcDay(to).getTime() - startOfUtcDay(from).getTime()) / DAY_IN_MS)

/**
 * Same day check
 * @param {Date} left - First date
 * @param {Date} right - Second date
 * @return {boolean} - Same day flag
 */

export const isSameDay = (left: Date, right: Date): boolean =>
  startOfUtcDay(left).getTime() === startOfUtcDay(right).getTime()

/**
 * Weekday labels for locale
 * @param {string} locale - BCP 47 tag
 * @param {number} [firstDayOfWeek] - Starting day
 * @param {'long' | 'short' | 'narrow'} [width] - Label width
 * @return {string[]} - Weekday names
 */

export const weekdayLabels = (
  locale: string,
  firstDayOfWeek = 1,
  width: 'long' | 'short' | 'narrow' = 'short'
): string[] => {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: width, timeZone: 'UTC' })

  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(new Date(Date.UTC(2024, 0, 7 + ((index + firstDayOfWeek) % 7))))
  )
}

/**
 * Month labels for locale
 * @param {string} locale - BCP 47 tag
 * @param {'long' | 'short'} [width] - Label width
 * @return {string[]} - Month names
 */

export const monthLabels = (locale: string, width: 'long' | 'short' = 'long'): string[] => {
  const formatter = new Intl.DateTimeFormat(locale, { month: width, timeZone: 'UTC' })

  return Array.from({ length: 12 }, (_, index) =>
    formatter.format(new Date(Date.UTC(2024, index, 1)))
  )
}
