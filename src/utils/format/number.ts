// Number formatting context
export interface NumberFormatting {
  locale: string
  currency: string
}

/**
 * Empty value placeholder
 * @type {string}
 */

export const EMPTY_VALUE = '—'

/**
 * Format number for reading
 * @param {number | null | undefined} value - Raw value
 * @param {string} locale - BCP 47 tag
 * @param {number} [fractionDigits] - Max decimals
 * @return {string} - Formatted number
 */

export const formatNumber = (
  value: number | null | undefined,
  locale: string,
  fractionDigits = 1
): string =>
  value === null || value === undefined
    ? EMPTY_VALUE
    : new Intl.NumberFormat(locale, { maximumFractionDigits: fractionDigits }).format(value)

/**
 * Format amount in cents
 * @param {number} amountCents - Amount cents
 * @param {NumberFormatting} formatting - Locale context
 * @return {string} - Formatted amount
 */

export const formatCurrency = (amountCents: number, formatting: NumberFormatting): string =>
  new Intl.NumberFormat(formatting.locale, {
    style: 'currency',
    currency: formatting.currency,
    maximumFractionDigits: amountCents % 100 === 0 ? 0 : 2,
  }).format(amountCents / 100)

/**
 * Currency parts split
 * @param {number} amountCents - Amount cents
 * @param {NumberFormatting} formatting - Locale context
 * @return {Object} - Split amount
 * @return {string} return.amount - Digits
 * @return {string} return.symbol - Symbol
 */

export const formatCurrencyParts = (
  amountCents: number,
  formatting: NumberFormatting
): { amount: string; symbol: string } => {
  const parts = new Intl.NumberFormat(formatting.locale, {
    style: 'currency',
    currency: formatting.currency,
    maximumFractionDigits: amountCents % 100 === 0 ? 0 : 2,
  }).formatToParts(amountCents / 100)

  return {
    symbol: parts.find((part) => part.type === 'currency')?.value ?? '',
    amount: parts
      .filter((part) => part.type !== 'currency' && part.type !== 'literal')
      .map((part) => part.value)
      .join(''),
  }
}

/**
 * Format ratio as percentage
 * @param {number} value - 0-1 ratio
 * @param {string} locale - BCP 47 tag
 * @param {number} [fractionDigits] - Max decimals
 * @return {string} - Formatted percentage
 */

export const formatPercent = (value: number, locale: string, fractionDigits = 0): string =>
  new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: fractionDigits,
  }).format(value)

/**
 * Byte unit names
 * @type {readonly string[]}
 */

const BYTE_UNITS = ['B', 'kB', 'MB', 'GB', 'TB'] as const

/**
 * Format file size
 * @param {number} bytes - Byte count
 * @param {string} locale - BCP 47 tag
 * @return {string} - Formatted size
 */

export const formatBytes = (bytes: number, locale: string): string => {
  const index = Math.min(
    BYTE_UNITS.length - 1,
    bytes > 0 ? Math.floor(Math.log(bytes) / Math.log(1000)) : 0
  )

  return `${formatNumber(bytes / 1000 ** index, locale, 0)} ${BYTE_UNITS[index]}`
}

/**
 * Main unit to cents
 * @param {number | null | undefined} amount - Main unit
 * @return {number | null} - Cents
 */

export const toCents = (amount: number | null | undefined): number | null =>
  typeof amount === 'number' ? Math.round(amount * 100) : null

/**
 * Cents to main unit
 * @param {number | null | undefined} amountCents - Cents
 * @return {number | null} - Main unit
 */

export const fromCents = (amountCents: number | null | undefined): number | null =>
  typeof amountCents === 'number' ? amountCents / 100 : null

/**
 * Round to decimals
 * @param {number} value - Raw value
 * @param {number} [decimals] - Decimal places
 * @return {number} - Rounded value
 */

export const roundTo = (value: number, decimals = 2): number => {
  const factor = 10 ** decimals

  return Math.round(value * factor) / factor
}

/**
 * Average defined values
 * @param {(number | null | undefined)[]} values - Raw values
 * @param {number} [decimals] - Decimal places
 * @return {number | null} - Average value
 */

export const average = (values: (number | null | undefined)[], decimals = 1): number | null => {
  const defined = values.filter((value): value is number => typeof value === 'number')
  if (defined.length === 0) return null

  return roundTo(defined.reduce((total, value) => total + value, 0) / defined.length, decimals)
}

/**
 * Clamp value within bounds
 * @param {number} value - Raw value
 * @param {number} min - Lower bound
 * @param {number} max - Upper bound
 * @return {number} - Clamped value
 */

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

/**
 * SVG sparkline points
 * @param {number[]} points - Value points
 * @param {Object} geometry - Drawing box
 * @param {number} geometry.width - Box width
 * @param {number} geometry.height - Box height
 * @return {string} - Points attribute
 */

export const sparklinePoints = (
  points: number[],
  geometry: { width: number; height: number }
): string => {
  const values = points.length > 0 ? points : [0]
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const step = values.length > 1 ? geometry.width / (values.length - 1) : 0

  return values
    .map((value, index) => {
      const x = index * step
      const y = geometry.height - ((value - min) / span) * geometry.height

      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}
