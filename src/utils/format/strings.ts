/**
 * Strip accents
 * @param {string} value - Raw text
 * @return {string} - No diacritics
 */

export const deaccent = (value: string): string => value.normalize('NFD').replace(/[̀-ͯ]/g, '')

/**
 * URL slug
 * @param {string} value - Raw label
 * @return {string} - Slugified text
 */

export const slugify = (value: string): string =>
  deaccent(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * camelCase to kebab-case
 * @param {string} value - camelCase identifier
 * @return {string} - kebab-case result
 */

export const toKebabCase = (value: string): string =>
  value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

/**
 * camelCase to snake_case
 * @param {string} value - camelCase identifier
 * @return {string} - snake_case result
 */

export const toSnakeCase = (value: string): string => toKebabCase(value).replace(/-/g, '_')

/**
 * kebab/snake to camelCase
 * @param {string} value - kebab or snake
 * @return {string} - camelCase result
 */

export const toCamelCase = (value: string): string =>
  value.replace(/[-_]([a-z0-9])/g, (_, character: string) => character.toUpperCase())

/**
 * Uppercase first character
 * @param {string} value - Raw text
 * @return {string} - Capitalized text
 */

export const capitalize = (value: string): string =>
  value.length === 0 ? value : `${value.charAt(0).toUpperCase()}${value.slice(1)}`

/**
 * Truncate with ellipsis
 * @param {string} value - Raw text
 * @param {number} limit - Max characters
 * @return {string} - Truncated text
 */

export const truncate = (value: string, limit: number): string =>
  value.length <= limit ? value : `${value.slice(0, limit - 1).trimEnd()}…`

/**
 * Extract name initials
 * @param {string} value - Full name
 * @param {number} [count] - Initials count
 * @return {string} - Uppercase initials
 */

export const initials = (value: string, count = 2): string =>
  value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, count)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

/**
 * Fill template placeholders
 * @param {string} template - Template text
 * @param {Record<string, string | number | null | undefined>} variables - Injection values
 * @return {string} - Interpolated text
 */

export const interpolate = (
  template: string,
  variables: Record<string, string | number | null | undefined>
): string =>
  template.replace(/\{(\w+)\}/g, (match, token: string) => {
    const value = variables[token]

    return value === null || value === undefined ? match : String(value)
  })

// Text segment
export interface TextSegment {
  text: string
  isValue: boolean
}

/**
 * Interpolate segments
 * @param {string} template - Template
 * @param {Record<string, string | number | null | undefined>} variables - Variables
 * @return {TextSegment[]} - Segments
 */

export const interpolateSegments = (
  template: string,
  variables: Record<string, string | number | null | undefined>
): TextSegment[] => {
  const segments: TextSegment[] = []
  const pattern = /\{(\w+)\}/g

  let cursor = 0
  let match = pattern.exec(template)

  while (match) {
    if (match.index > cursor) {
      segments.push({ text: template.slice(cursor, match.index), isValue: false })
    }

    const value = variables[match[1] ?? '']
    const printed = value === null || value === undefined ? match[0] : String(value)

    segments.push({ text: printed, isValue: value !== null && value !== undefined })
    cursor = match.index + match[0].length
    match = pattern.exec(template)
  }

  if (cursor < template.length) segments.push({ text: template.slice(cursor), isValue: false })

  return segments
}

/**
 * Case-insensitive match
 * @param {string} haystack - Searched text
 * @param {string} needle - Query text
 * @return {boolean} - Match flag
 */

export const matches = (haystack: string, needle: string): boolean =>
  deaccent(haystack).toLowerCase().includes(deaccent(needle).toLowerCase().trim())
