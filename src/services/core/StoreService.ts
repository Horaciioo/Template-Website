import { useSyncExternalStore } from 'react'

export interface Store<T> {
  getState: () => T
  setState: (updater: T | ((current: T) => T)) => void
  subscribe: (listener: () => void) => () => void
  // React hook
  use: () => T
}

export interface StoreOptions<T> {
  // Subscription callbacks
  activate?: (setState: Store<T>['setState']) => () => void
}

/**
 * Create observable state
 * @param {T} initialState - Initial state
 * @param {StoreOptions<T>} [options] - Activation callbacks
 * @return {Store<T>} - Store instance
 */

export const createStore = <T>(initialState: T, options: StoreOptions<T> = {}): Store<T> => {
  const listeners = new Set<() => void>()
  let state = initialState
  let deactivate: (() => void) | null = null

  const getState = () => state

  const setState = (updater: T | ((current: T) => T)) => {
    const next = typeof updater === 'function' ? (updater as (current: T) => T)(state) : updater
    if (Object.is(next, state)) return

    state = next
    listeners.forEach((listener) => listener())
  }

  const subscribe = (listener: () => void) => {
    if (listeners.size === 0 && options.activate) deactivate = options.activate(setState)
    listeners.add(listener)

    return () => {
      listeners.delete(listener)

      if (listeners.size === 0 && deactivate) {
        deactivate()
        deactivate = null
      }
    }
  }

  return {
    getState,
    setState,
    subscribe,
    // Server snapshot
    use: () => useSyncExternalStore(subscribe, getState, () => initialState),
  }
}

/**
 * Bind window event
 * @param {string} event - Event name
 * @param {() => void} onEvent - Handler
 * @return {() => void} - Unsubscribe
 */

export const bindWindowEvent = (event: string, onEvent: () => void): (() => void) => {
  onEvent()
  window.addEventListener(event, onEvent, { passive: true })

  return () => window.removeEventListener(event, onEvent)
}
