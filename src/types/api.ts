import type { HTTP_METHODS } from '@/declarations/http'
import type { Dictionary, ValueOf } from '@/types/common'

/**
 * HTTP method
 * @typedef {ValueOf<typeof HTTP_METHODS>} HttpMethod
 */

export type HttpMethod = ValueOf<typeof HTTP_METHODS>

/**
 * Pagination query
 * @typedef PaginationQuery
 * @property {number} page - Page number
 * @property {number} perPage - Items per page
 */

export interface PaginationQuery {
  page: number
  perPage: number
}

/**
 * Pagination metadata
 * @typedef PaginationMeta
 * @property {number} total - Total items
 * @property {number} totalPages - Total pages
 * @property {boolean} hasPreviousPage - Previous page flag
 * @property {boolean} hasNextPage - Next page flag
 */

export interface PaginationMeta extends PaginationQuery {
  total: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

/**
 * Paginated response
 * @typedef Paginated
 * @template T - Item type
 * @property {T[]} items - Response items
 * @property {PaginationMeta} meta - Pagination info
 */

export interface Paginated<T> {
  items: T[]
  meta: PaginationMeta
}

/**
 * HTTP request options
 * @typedef RequestOptions
 * @property {HttpMethod} [method] - HTTP method
 * @property {Dictionary} [query] - Query parameters
 * @property {unknown} [body] - JSON request body
 * @property {Record<string, string>} [form] - Form encoded body
 * @property {Record<string, string>} [headers] - HTTP headers
 * @property {AbortSignal} [signal] - Abort signal
 * @property {number} [timeout] - Request timeout
 */

export interface RequestOptions {
  method?: HttpMethod
  // Query parameters
  query?: Dictionary<string | number | boolean | null | undefined>
  body?: unknown
  // Form encoded body
  form?: Record<string, string>
  headers?: Record<string, string>
  signal?: AbortSignal
  // Request timeout
  timeout?: number
}

/**
 * Request failure
 * @typedef RequestFailure
 * @property {number} status - HTTP status
 * @property {string} translationKey - Error message key
 * @property {Dictionary<string>} [details] - Error details
 */

export interface RequestFailure {
  status: number
  // Error message key
  translationKey: string
  details?: Dictionary<string>
}

/**
 * Request result
 * @typedef RequestResult
 * @template T - Success data type
 */

export type RequestResult<T> =
  { success: true; data: T } | { success: false; error: RequestFailure }
