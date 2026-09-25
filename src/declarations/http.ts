/**
 * HTTP methods
 * @type {Object}
 */

export const HTTP_METHODS = {
  get: 'GET',
  post: 'POST',
  patch: 'PATCH',
  put: 'PUT',
  delete: 'DELETE',
} as const

/**
 * Fallback error key
 * @type {string}
 */

export const FALLBACK_ERROR_KEY = 'unknown'

/**
 * Network error key
 * @type {string}
 */

export const NETWORK_ERROR_KEY = 'network'

/**
 * Timeout error key
 * @type {string}
 */

export const TIMEOUT_ERROR_KEY = 'timeout'

/**
 * Honeypot field name
 * @type {string}
 */

export const HONEYPOT_FIELD = 'company_website'

/**
 * Honeypot field label
 * @type {string}
 */

export const HONEYPOT_LABEL = 'Website'

/**
 * Rate limit buckets
 * @type {Record<string, string>}
 */

export const RATE_LIMIT_BUCKETS = {
  forms: 'forms',
  reads: 'reads',
} as const

export type RateLimitBucket = keyof typeof RATE_LIMIT_BUCKETS
