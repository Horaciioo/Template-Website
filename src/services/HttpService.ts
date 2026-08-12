import {
  FALLBACK_ERROR_KEY,
  HTTP_METHODS,
  NETWORK_ERROR_KEY,
  TIMEOUT_ERROR_KEY,
} from '@/declarations/http'
import { Service } from '@/structures/Service'
import { HttpStatuses } from '@/structures/constants'
import type { RequestOptions, RequestResult } from '@/types/api'
import { compact } from '@/utils/object'

const buildUrl = (path: string, query: RequestOptions['query']): string => {
  if (!query) return path
  const search = new URLSearchParams(
    Object.entries(compact(query)).map(([key, value]) => [key, String(value)])
  )

  return search.size === 0 ? path : `${path}?${search.toString()}`
}

// Camel-case error key from status name
const toErrorKey = (status: number): string => {
  const name = (HttpStatuses as Record<number, string>)[status]

  return name ? `${name.charAt(0).toLowerCase()}${name.slice(1)}` : FALLBACK_ERROR_KEY
}

const failure = (status: number, translationKey: string): RequestResult<never> => ({
  success: false,
  error: { status, translationKey: `errors.${translationKey}` },
})

class HttpServiceClass extends Service {
  /**
   * Send request
   * @param {string} path - URL or path
   * @param {RequestOptions} [options] - Request options
   * @return {Promise<RequestResult<T>>} - Result
   */

  request = async <T>(path: string, options: RequestOptions = {}): Promise<RequestResult<T>> => {
    const {
      method = HTTP_METHODS.get,
      query,
      body,
      headers,
      signal,
      timeout = this.config.http.requestTimeoutMs,
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
        return failure(response.status, toErrorKey(response.status))
      }

      if (response.status === HttpStatuses.NoContent) {
        return { success: true, data: undefined as T }
      }

      return { success: true, data: (await response.json()) as T }
    } catch (error) {
      const isTimeout = error instanceof DOMException && error.name === 'AbortError'
      this.logger.warn('request', { path, error })

      return failure(0, isTimeout ? TIMEOUT_ERROR_KEY : NETWORK_ERROR_KEY)
    } finally {
      if (timer) clearTimeout(timer)
    }
  }

  /**
   * POST request
   * @param {string} path - URL or path
   * @param {unknown} body - Payload
   * @param {RequestOptions} [options] - Options
   * @return {Promise<RequestResult<T>>} - Result
   */

  post = <T>(
    path: string,
    body: unknown,
    options: RequestOptions = {}
  ): Promise<RequestResult<T>> =>
    this.request<T>(path, { ...options, method: HTTP_METHODS.post, body })
}

// HTTP requests
export const HttpService = new HttpServiceClass('http')
