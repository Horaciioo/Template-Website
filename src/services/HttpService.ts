import {
  FALLBACK_ERROR_KEY,
  HTTP_ERROR_KEYS,
  HTTP_METHODS,
  HTTP_STATUS,
  NETWORK_ERROR_KEY,
  TIMEOUT_ERROR_KEY,
} from '@/declarations/http'
import { ConfigurationService } from '@/services/ConfigurationService'
import { LoggerService } from '@/services/LoggerService'
import type { RequestOptions, RequestResult } from '@/types/api'
import { compact } from '@/utils/object'

const buildUrl = (path: string, query: RequestOptions['query']): string => {
  if (!query) return path
  const search = new URLSearchParams(
    Object.entries(compact(query)).map(([key, value]) => [key, String(value)])
  )

  return search.size === 0 ? path : `${path}?${search.toString()}`
}

const failure = (status: number, translationKey: string): RequestResult<never> => ({
  success: false,
  error: { status, translationKey: `errors.${translationKey}` },
})

// HTTP requests
export const HttpService = {
  /**
   * Send request
   * @param {string} path - URL or path
   * @param {RequestOptions} [options] - Request options
   * @return {Promise<RequestResult<T>>} - Result
   */

  request: async <T>(path: string, options: RequestOptions = {}): Promise<RequestResult<T>> => {
    const {
      method = HTTP_METHODS.get,
      query,
      body,
      headers,
      signal,
      timeout = ConfigurationService.http.requestTimeoutMs,
    } = options
    const controller = new AbortController()
    const timer = timeout > 0 ? setTimeout(() => controller.abort(), timeout) : null

    signal?.addEventListener('abort', () => controller.abort())

    try {
      const response = await fetch(buildUrl(path, query), {
        method,
        signal: controller.signal,
        headers: {
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
          ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      })

      if (!response.ok) {
        return failure(response.status, HTTP_ERROR_KEYS[response.status] ?? FALLBACK_ERROR_KEY)
      }

      if (response.status === HTTP_STATUS.noContent) {
        return { success: true, data: undefined as T }
      }

      return { success: true, data: (await response.json()) as T }
    } catch (error) {
      const isTimeout = error instanceof DOMException && error.name === 'AbortError'
      LoggerService.warn('http.request', { path, error })

      return failure(0, isTimeout ? TIMEOUT_ERROR_KEY : NETWORK_ERROR_KEY)
    } finally {
      if (timer) clearTimeout(timer)
    }
  },

  /**
   * Send a JSON body with the post method
   * @param {string} path - Absolute URL or path of the same origin
   * @param {unknown} body - Payload to serialise
   * @param {RequestOptions} [options] - Remaining request options
   * @return {Promise<RequestResult<T>>} - Decoded body or a translatable failure
   */

  post: <T>(path: string, body: unknown, options: RequestOptions = {}): Promise<RequestResult<T>> =>
    HttpService.request<T>(path, { ...options, method: HTTP_METHODS.post, body }),
} as const
