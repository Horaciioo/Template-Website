import { ConfigurationService } from '@/services/ConfigurationService'
import { createStore } from '@/services/core/StoreService'
import type { Store } from '@/services/core/StoreService'
import { Service } from '@/structures/Service'
import type { BreakpointName, MediaQueryName } from '@/types/viewport'
import { isBrowser } from '@/utils/guards'

const { breakpoints, mediaQueries } = ConfigurationService.viewport

// Breakpoint stores
const stores = new Map<string, Store<boolean>>()

const observe = (query: string): Store<boolean> => {
  const existing = stores.get(query)
  if (existing) return existing

  const created = createStore(false, {
    activate: (setState) => {
      if (!isBrowser()) return () => undefined

      const media = window.matchMedia(query)
      const onChange = () => setState(media.matches)

      onChange()
      media.addEventListener('change', onChange)

      return () => media.removeEventListener('change', onChange)
    },
  })

  stores.set(query, created)

  return created
}

const orderedBreakpoints = Object.entries(breakpoints).sort(([, a], [, b]) => b - a) as [
  BreakpointName,
  number,
][]

class ViewportServiceClass extends Service {
  /**
   * Media query
   * @param {BreakpointName} name - Breakpoint
   * @return {string} - Query
   */

  queryOf = (name: BreakpointName): string => `(min-width: ${breakpoints[name]}px)`

  /**
   * Breakpoint match
   * @param {BreakpointName} name - Breakpoint
   * @return {boolean} - Match
   */

  useIsAbove = (name: BreakpointName): boolean => observe(this.queryOf(name)).use()

  /**
   * Preference match
   * @param {MediaQueryName} name - Query
   * @return {boolean} - Match
   */

  usePrefers = (name: MediaQueryName): boolean => observe(mediaQueries[name]).use()

  /**
   * Custom query
   * @param {string} query - Query
   * @return {boolean} - Match
   */

  useMatches = (query: string): boolean => observe(query).use()

  /**
   * Current breakpoint
   * @return {BreakpointName | null} - Breakpoint
   */

  current = (): BreakpointName | null => {
    if (!isBrowser()) return null
    const found = orderedBreakpoints.find(([, width]) => window.innerWidth >= width)

    return found ? found[0] : null
  }
}

// Viewport breakpoints
export const ViewportService = new ViewportServiceClass('viewport')
