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
 * HTTP status codes
 * @type {Object}
 */

export const HTTP_STATUS = {
  ok: 200,
  created: 201,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  unprocessable: 422,
  tooManyRequests: 429,
  serverError: 500,
} as const

/**
 * Error status keys
 * @type {Record<number, string>}
 */

export const HTTP_ERROR_KEYS: Record<number, string> = {
  [HTTP_STATUS.badRequest]: 'badRequest',
  [HTTP_STATUS.unauthorized]: 'unauthorized',
  [HTTP_STATUS.forbidden]: 'forbidden',
  [HTTP_STATUS.notFound]: 'notFound',
  [HTTP_STATUS.conflict]: 'conflict',
  [HTTP_STATUS.unprocessable]: 'unprocessable',
  [HTTP_STATUS.tooManyRequests]: 'tooManyRequests',
  [HTTP_STATUS.serverError]: 'serverError',
}

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
