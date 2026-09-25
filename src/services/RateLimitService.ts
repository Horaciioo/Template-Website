import type { RateLimitBucket } from '@/declarations/http'
import { Service } from '@/structures/Service'

// Address window
interface RateWindow {
  count: number
  resetAt: number
}

class RateLimitServiceClass extends Service {
  // Per-instance memory store
  private windows = new Map<string, RateWindow>()

  /**
   * Request count
   * @param {RateLimitBucket} bucket - Budget name
   * @param {string} address - Caller
   * @return {{ allowed: boolean, retryAfterSeconds: number }} - Verdict
   */

  hit = (
    bucket: RateLimitBucket,
    address: string
  ): { allowed: boolean; retryAfterSeconds: number } => {
    const now = Date.now()
    const key = `${bucket}:${address}`
    const { windowSeconds } = this.config.rateLimit
    const limit = this.config.rateLimit[bucket]
    const current = this.windows.get(key)

    if (!current || current.resetAt <= now) {
      this.windows.set(key, { count: 1, resetAt: now + windowSeconds * 1000 })
      this.sweep(now)

      return { allowed: true, retryAfterSeconds: 0 }
    }

    current.count += 1
    if (current.count <= limit) return { allowed: true, retryAfterSeconds: 0 }

    this.logger.warn('hit', { bucket, address })

    return { allowed: false, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) }
  }

  /**
   * Caller address
   * @param {Request} request - Incoming request
   * @return {string} - Client IP
   */

  addressOf = (request: Request): string =>
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  /**
   * Expired windows purge
   * @param {number} now - Current time
   * @return {void}
   */

  private sweep = (now: number): void => {
    for (const [key, window] of this.windows) {
      if (window.resetAt <= now) this.windows.delete(key)
    }
  }
}

// Public route limiter
export const RateLimitService = new RateLimitServiceClass('rateLimit')
