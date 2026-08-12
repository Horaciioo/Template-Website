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
