import { ConfigurationService } from '@/services/ConfigurationService'
import { LoggerService } from '@/services/LoggerService'
import { isBrowser } from '@/utils/guards'

// Local storage
export const StorageService = {
  /**
   * Build the stored key of a declared name
   * @param {string} name - Name declared in declarations/analytics.ts
   * @return {string} - Prefixed storage key
   */

  buildKey: (name: string): string => `${ConfigurationService.storage.prefix}:${name}`,

  /**
   * Read and parse a stored value
   * @param {string} name - Name declared in declarations/analytics.ts
   * @return {T | null} - Stored value, null when missing or unreadable
   */

  read: <T>(name: string): T | null => {
    if (!isBrowser()) return null

    try {
      const raw = window.localStorage.getItem(StorageService.buildKey(name))

      return raw === null ? null : (JSON.parse(raw) as T)
    } catch (error) {
      LoggerService.warn('storage.read', { name, error })

      return null
    }
  },

  /**
   * Serialise and store a value
   * @param {string} name - Name declared in declarations/analytics.ts
   * @param {T} value - Value to store
   * @return {boolean} - Written flag
   */

  write: <T>(name: string, value: T): boolean => {
    if (!isBrowser()) return false

    try {
      window.localStorage.setItem(StorageService.buildKey(name), JSON.stringify(value))

      return true
    } catch (error) {
      LoggerService.warn('storage.write', { name, error })

      return false
    }
  },

  /**
   * Drop a stored value
   * @param {string} name - Name declared in declarations/analytics.ts
   * @return {void}
   */

  clear: (name: string): void => {
    if (!isBrowser()) return
    window.localStorage.removeItem(StorageService.buildKey(name))
  },
} as const
