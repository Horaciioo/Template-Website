import { ConfigurationService } from '@/services/ConfigurationService'
import { createStore } from '@/services/core/StoreService'
import { Service } from '@/structures/Service'
import type { Tone } from '@/types/common'

export interface Notification {
  id: string
  tone: Tone
  // Message key
  translationKey: string
  params?: Record<string, string | number>
}

const { notificationLifetimeMs } = ConfigurationService.timings

const store = createStore<Notification[]>([])

const dismiss = (id: string) =>
  store.setState((current) => current.filter((item) => item.id !== id))

const push = (tone: Tone, translationKey: string, params?: Record<string, string | number>) => {
  const id = `${translationKey}-${Date.now()}`

  store.setState((current) => [...current, { id, tone, translationKey, params }])
  setTimeout(() => dismiss(id), notificationLifetimeMs)

  return id
}

class NotificationServiceClass extends Service {
  store = store
  dismiss = dismiss

  /**
   * Active notifications
   * @return {Notification[]} - Queue
   */

  use = (): Notification[] => store.use()

  /**
   * Push a success notification
   * @param {string} translationKey - Message key
   * @param {Record<string, string | number>} [params] - Message params
   * @return {string} - Notification ID
   */

  success = (translationKey: string, params?: Record<string, string | number>): string =>
    push('success', translationKey, params)

  /**
   * Push an error notification
   * @param {string} translationKey - Message key
   * @param {Record<string, string | number>} [params] - Message params
   * @return {string} - Notification ID
   */

  error = (translationKey: string, params?: Record<string, string | number>): string =>
    push('danger', translationKey, params)

  /**
   * Push an info notification
   * @param {string} translationKey - Message key
   * @param {Record<string, string | number>} [params] - Message params
   * @return {string} - Notification ID
   */

  info = (translationKey: string, params?: Record<string, string | number>): string =>
    push('info', translationKey, params)

  /**
   * Push a warning notification
   * @param {string} translationKey - Message key
   * @param {Record<string, string | number>} [params] - Message params
   * @return {string} - Notification ID
   */

  warning = (translationKey: string, params?: Record<string, string | number>): string =>
    push('warning', translationKey, params)
}

// Notification queue
export const NotificationService = new NotificationServiceClass('notification')
