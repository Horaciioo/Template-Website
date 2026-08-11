import { ConfigurationService } from '@/services/ConfigurationService'
import { createStore } from '@/services/core/StoreService'
import type { Store } from '@/services/core/StoreService'
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

// Viewport breakpoints
export const ViewportService = {
  /**
   * Build the media query of a breakpoint
   * @param {BreakpointName} name - Breakpoint declared in configurations/system/viewport.json
   * @return {string} - Media query
   */

  queryOf: (name: BreakpointName): string => `(min-width: ${breakpoints[name]}px)`,

  /**
   * Follow a breakpoint, true once the viewport is at least that wide
   * @param {BreakpointName} name - Breakpoint declared in configurations/system/viewport.json
   * @return {boolean} - Match flag, false on the server render
   */

  useIsAbove: (name: BreakpointName): boolean => observe(ViewportService.queryOf(name)).use(),

  /**
   * Follow one of the named preference queries, motion or colour scheme
   * @param {MediaQueryName} name - Query declared in configurations/system/viewport.json
   * @return {boolean} - Match flag, false on the server render
   */

  usePrefers: (name: MediaQueryName): boolean => observe(mediaQueries[name]).use(),

  /**
   * Follow an arbitrary media query, for the rare case no declared name fits
   * @param {string} query - Media query
   * @return {boolean} - Match flag, false on the server render
   */

  useMatches: (query: string): boolean => observe(query).use(),

  /**
   * Resolve the widest matching breakpoint, used when a component needs the name and not a boolean
   * @return {BreakpointName | null} - Active breakpoint, null below the smallest one
   */

  current: (): BreakpointName | null => {
    if (!isBrowser()) return null
    const found = orderedBreakpoints.find(([, width]) => window.innerWidth >= width)

    return found ? found[0] : null
  },
} as const
