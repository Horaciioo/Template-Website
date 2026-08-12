import { track } from '@vercel/analytics'

import { ANALYTICS_EVENTS } from '@/declarations/analytics'
import type { AnalyticsEvent } from '@/declarations/analytics'
import { NamingService } from '@/services/NamingService'
import { Service } from '@/structures/Service'

export type AnalyticsProperties = Record<string, string | number | boolean | null>

class AnalyticsServiceClass extends Service {
  events = ANALYTICS_EVENTS

  /**
   * Send a declared event
   * @param {AnalyticsEvent} event - Declared event name
   * @param {AnalyticsProperties} [properties] - Event payload
   * @return {void}
   */

  track = (event: AnalyticsEvent, properties?: AnalyticsProperties): void => {
    const name = NamingService.toEventName(ANALYTICS_EVENTS[event])

    if (!this.config.isEnabled('analytics') || !this.config.environment.analytics.enabled) {
      this.logger.debug('skipped', { name, properties })

      return
    }

    track(name, properties)
  }
}

// Analytics tracking
export const AnalyticsService = new AnalyticsServiceClass('analytics')
