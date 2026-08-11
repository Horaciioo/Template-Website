/**
 * Validation patterns
 * @type {Object}
 */

export const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i,
  phone: /^\+?[0-9 ().-]{6,20}$/,
  url: /^https?:\/\/[^\s]+$/i,
  postalCode: /^[0-9A-Z -]{3,10}$/i,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const

/**
 * Validation rule keys
 * @type {Object}
 */

export const VALIDATION_RULES = {
  required: 'required',
  minLength: 'minLength',
  maxLength: 'maxLength',
  min: 'min',
  max: 'max',
  pattern: 'pattern',
  mismatch: 'mismatch',
} as const

/**
 * Pattern name
 * @typedef {keyof typeof PATTERNS} PatternName
 */

export type PatternName = keyof typeof PATTERNS
