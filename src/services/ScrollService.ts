import { ConfigurationService } from '@/services/ConfigurationService'
import { bindWindowEvent, createStore } from '@/services/core/StoreService'
import { isBrowser } from '@/utils/guards'

export interface ScrollState {
  offset: number
  // Scroll threshold flag
  isScrolled: boolean
  direction: 'up' | 'down'
}

const { scrollThresholdPx } = ConfigurationService.timings

const initialState: ScrollState = { offset: 0, isScrolled: false, direction: 'up' }

// Scroll lock count
let lockCount = 0

const store = createStore<ScrollState>(initialState, {
  activate: (setState) => {
    if (!isBrowser()) return () => undefined

    let previous = window.scrollY

    return bindWindowEvent('scroll', () => {
      const offset = window.scrollY
      const direction = offset > previous ? 'down' : 'up'
      previous = offset

      setState({ offset, isScrolled: offset > scrollThresholdPx, direction })
    })
  },
})

// Scroll position
export const ScrollService = {
  store,

  /**
   * Follow the scroll position
   * @return {ScrollState} - Offset, threshold flag and direction
   */

  use: (): ScrollState => store.use(),

  /**
   * Scroll back to the top of the page
   * @return {void}
   */

  toTop: (): void => {
    if (!isBrowser()) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },

  /**
   * Freeze the page behind an open overlay, nested overlays sharing one counter
   * @return {() => void} - Release, the page scrolling again once every holder released
   */

  lock: (): (() => void) => {
    if (!isBrowser()) return () => undefined

    lockCount += 1
    document.body.style.overflow = 'hidden'

    return () => {
      lockCount = Math.max(0, lockCount - 1)
      if (lockCount === 0) document.body.style.overflow = ''
    }
  },

  /**
   * Scroll to a section anchor declared in declarations/routes.ts
   * @param {string} anchor - Anchor id, without its hash
   * @return {boolean} - Found flag
   */

  toAnchor: (anchor: string): boolean => {
    if (!isBrowser()) return false
    const target = document.getElementById(anchor)
    if (!target) return false

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })

    return true
  },
} as const
