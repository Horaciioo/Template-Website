import { ConfigurationService } from '@/services/ConfigurationService'
import { createStore } from '@/services/core/StoreService'
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

// Notification queue
export const NotificationService = {
  store,
  dismiss,

  use: (): Notification[] => store.use(),

  success: (translationKey: string, params?: Record<string, string | number>): string =>
    push('success', translationKey, params),

  error: (translationKey: string, params?: Record<string, string | number>): string =>
    push('danger', translationKey, params),

  info: (translationKey: string, params?: Record<string, string | number>): string =>
    push('info', translationKey, params),

  warning: (translationKey: string, params?: Record<string, string | number>): string =>
    push('warning', translationKey, params),
} as const
