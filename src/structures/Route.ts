import { NextResponse } from 'next/server'

import { FALLBACK_ERROR_KEY, HONEYPOT_FIELD } from '@/declarations/http'
import type { RateLimitBucket } from '@/declarations/http'
import { LoggerService } from '@/services/LoggerService'
import { RateLimitService } from '@/services/RateLimitService'
import { HttpStatuses } from '@/structures/constants'

// API route technical base
export abstract class Route {
  /**
   * Scoped logger
   * @return {typeof LoggerService} - Logger
   */

  protected get logger(): typeof LoggerService {
    return LoggerService
  }

  /**
   * JSON success response
   * @param {T} data - Payload
   * @param {number} [status] - HTTP status
   * @return {NextResponse} - Response
   */

  protected respond<T>(data: T, status: number = HttpStatuses.Ok): NextResponse {
    return NextResponse.json(data, { status })
  }

  /**
   * JSON error response
   * @param {number} status - HTTP status
   * @param {string} [translationKey] - Error key
   * @return {NextResponse} - Response
   */

  protected fail(status: number, translationKey: string = this.errorKeyFor(status)): NextResponse {
    return NextResponse.json({ error: translationKey }, { status })
  }

  /**
   * Error key from status
   * @param {number} status - HTTP status
   * @return {string} - Camel-cased key
   */

  protected errorKeyFor(status: number): string {
    const name = (HttpStatuses as Record<number, string>)[status]

    return name ? `${name.charAt(0).toLowerCase()}${name.slice(1)}` : FALLBACK_ERROR_KEY
  }

  /**
   * Rate limit guard
   * @param {Request} request - Incoming request
   * @param {RateLimitBucket} bucket - Budget name
   * @return {NextResponse | null} - 429 or null
   */

  protected limit(request: Request, bucket: RateLimitBucket): NextResponse | null {
    const verdict = RateLimitService.hit(bucket, RateLimitService.addressOf(request))
    if (verdict.allowed) return null

    const response = this.fail(HttpStatuses.TooManyRequests)
    response.headers.set('Retry-After', String(verdict.retryAfterSeconds))

    return response
  }

  /**
   * Honeypot check
   * @param {Record<string, unknown>} values - Submitted values
   * @return {boolean} - Robot detected
   */

  protected isTrapped(values: Record<string, unknown>): boolean {
    return typeof values[HONEYPOT_FIELD] === 'string' && values[HONEYPOT_FIELD] !== ''
  }

  /**
   * Honeypot removal
   * @param {T} values - Submitted values
   * @return {T} - Clean values
   */

  protected withoutTrap<T extends Record<string, unknown>>(values: T): T {
    const { [HONEYPOT_FIELD]: _trap, ...rest } = values

    return rest as T
  }

  /**
   * Request handler, override per route
   * @param {Request} _request - Incoming request
   * @param {Record<string, string>} [_params] - Dynamic route params
   * @return {Promise<NextResponse>} - Response
   */

  async handle(_request: Request, _params: Record<string, string> = {}): Promise<NextResponse> {
    this.logger.warn('route.handle', 'not implemented')

    return this.fail(HttpStatuses.ServerError, 'unknown')
  }
}
