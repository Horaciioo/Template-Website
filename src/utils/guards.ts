import type { Maybe } from '@/types/common'

/**
 * Null/undefined guard
 * @param {Maybe<T>} value - Candidate value
 * @return {boolean} - Defined flag
 */

export const isDefined = <T>(value: Maybe<T>): value is T => value !== null && value !== undefined

/**
 * Filled string check
 * @param {unknown} value - Candidate value
 * @return {boolean} - Non-empty flag
 */

export const isFilledString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

/**
 * Plain object check
 * @param {unknown} value - Candidate value
 * @return {boolean} - Plain object flag
 */

export const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * External link check
 * @param {string} href - Link target
 * @return {boolean} - External flag
 */

export const isExternalHref = (href: string): boolean => /^(https?:)?\/\/|^mailto:|^tel:/.test(href)

/**
 * Browser environment check
 * @return {boolean} - Browser flag
 */

export const isBrowser = (): boolean => typeof window !== 'undefined'
