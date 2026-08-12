import { Service } from '@/structures/Service'
import { isBrowser } from '@/utils/guards'

class StorageServiceClass extends Service {
  /**
   * Storage key
   * @param {string} name - Name
   * @return {string} - Key
   */

  buildKey = (name: string): string => `${this.config.storage.prefix}:${name}`

  /**
   * Read value
   * @param {string} name - Name
   * @return {T | null} - Value
   */

  read = <T>(name: string): T | null => {
    if (!isBrowser()) return null

    try {
      const raw = window.localStorage.getItem(this.buildKey(name))

      return raw === null ? null : (JSON.parse(raw) as T)
    } catch (error) {
      this.logger.warn('read', { name, error })

      return null
    }
  }

  /**
   * Store value
   * @param {string} name - Name
   * @param {T} value - Value
   * @return {boolean} - Success
   */

  write = <T>(name: string, value: T): boolean => {
    if (!isBrowser()) return false

    try {
      window.localStorage.setItem(this.buildKey(name), JSON.stringify(value))

      return true
    } catch (error) {
      this.logger.warn('write', { name, error })

      return false
    }
  }

  /**
   * Drop a stored value
   * @param {string} name - Name declared in declarations/analytics.ts
   * @return {void}
   */

  clear = (name: string): void => {
    if (!isBrowser()) return
    window.localStorage.removeItem(this.buildKey(name))
  }
}

// Local storage
export const StorageService = new StorageServiceClass('storage')
