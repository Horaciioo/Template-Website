import { ConfigurationService } from '@/services/ConfigurationService'
import { LoggerService } from '@/services/LoggerService'

export interface ScopedLogger {
  debug: (method: string, payload?: unknown) => void
  info: (method: string, payload?: unknown) => void
  warn: (method: string, payload?: unknown) => void
  error: (method: string, payload?: unknown) => void
}

// Service technical base
export abstract class Service {
  protected readonly scope: string

  /**
   * @param {string} scope - Logging scope
   */

  constructor(scope: string) {
    this.scope = scope
  }

  /**
   * Global configuration
   * @return {typeof ConfigurationService} - Configuration
   */

  protected get config(): typeof ConfigurationService {
    return ConfigurationService
  }

  /**
   * Scoped logger
   * @return {ScopedLogger} - Logger, prefixed by scope
   */

  protected get logger(): ScopedLogger {
    const prefixed = (method: string) => `${this.scope}.${method}`

    return {
      debug: (method, payload) => LoggerService.debug(prefixed(method), payload),
      info: (method, payload) => LoggerService.info(prefixed(method), payload),
      warn: (method, payload) => LoggerService.warn(prefixed(method), payload),
      error: (method, payload) => LoggerService.error(prefixed(method), payload),
    }
  }

  /**
   * Run a fallible operation
   * @param {string} method - Calling method
   * @param {T} fallback - Fallback value
   * @param {() => T} operation - Operation
   * @return {T} - Result or fallback
   */

  protected guard<T>(method: string, fallback: T, operation: () => T): T {
    try {
      return operation()
    } catch (error) {
      this.onError(method, error)

      return fallback
    }
  }

  /**
   * Error hook, override for custom recovery
   * @param {string} method - Failing method
   * @param {unknown} error - Caught error
   * @return {void}
   */

  protected onError(method: string, error: unknown): void {
    this.logger.warn(method, error)
  }
}
