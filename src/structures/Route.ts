import { NextResponse } from 'next/server'

import { FALLBACK_ERROR_KEY } from '@/declarations/http'
import { LoggerService } from '@/services/LoggerService'
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
