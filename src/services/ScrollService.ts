import { ConfigurationService } from '@/services/ConfigurationService'
import { bindWindowEvent, createStore } from '@/services/core/StoreService'
import { Service } from '@/structures/Service'
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

class ScrollServiceClass extends Service {
  store = store

  /**
   * Follow the scroll position
   * @return {ScrollState} - Offset, threshold flag and direction
   */

  use = (): ScrollState => store.use()

  /**
   * Scroll to top
   * @return {void}
   */

  toTop = (): void => {
    if (!isBrowser()) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /**
   * Lock scroll
   * @return {() => void} - Release
   */

  lock = (): (() => void) => {
    if (!isBrowser()) return () => undefined

    lockCount += 1
    document.body.style.overflow = 'hidden'

    return () => {
      lockCount = Math.max(0, lockCount - 1)
      if (lockCount === 0) document.body.style.overflow = ''
    }
  }

  /**
   * Scroll to anchor
   * @param {string} anchor - Anchor ID
   * @return {boolean} - Found
   */

  toAnchor = (anchor: string): boolean => {
    if (!isBrowser()) return false
    const target = document.getElementById(anchor)
    if (!target) return false

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })

    return true
  }
}

// Scroll position
export const ScrollService = new ScrollServiceClass('scroll')
