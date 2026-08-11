import { track } from '@vercel/analytics'

import { ANALYTICS_EVENTS } from '@/declarations/analytics'
import type { AnalyticsEvent } from '@/declarations/analytics'
import { EnvironmentService } from '@/services/EnvironmentService'
import { LoggerService } from '@/services/LoggerService'
import { NamingService } from '@/services/NamingService'

export type AnalyticsProperties = Record<string, string | number | boolean | null>

// Analytics tracking
export const AnalyticsService = {
  events: ANALYTICS_EVENTS,

  /**
   * Send a declared event
   * @param {AnalyticsEvent} event - Declared event name
   * @param {AnalyticsProperties} [properties] - Event payload
   * @return {void}
   */

  track: (event: AnalyticsEvent, properties?: AnalyticsProperties): void => {
    const name = NamingService.toEventName(ANALYTICS_EVENTS[event])

    if (!EnvironmentService.analytics.isEnabled) {
      LoggerService.debug('analytics.skipped', { name, properties })

      return
    }

    track(name, properties)
  },
} as const
