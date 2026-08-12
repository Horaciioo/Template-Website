import { ENVIRONMENT_REGISTRY } from '@/declarations/environments'
import type { EnvironmentKey } from '@/types/environment'
import { isFilledString } from '@/utils/guards'

/**
 * Match environment key
 * @param {string} candidate - APP_ENV value
 * @return {EnvironmentKey | undefined} - Matching key
 */

const keyOf = (candidate: string): EnvironmentKey | undefined => {
  if (candidate in ENVIRONMENT_REGISTRY) return candidate as EnvironmentKey

  const entries = Object.entries(ENVIRONMENT_REGISTRY) as [EnvironmentKey, { branch: string }][]

  return entries.find(([, meta]) => meta.branch === candidate)?.[0]
}

/**
 * Resolve environment
 * @return {EnvironmentKey} - Resolved key
 */

const resolveEnvironment = (): EnvironmentKey => {
  const explicit = process.env.APP_ENV ?? process.env.NEXT_PUBLIC_APP_ENV
  const resolved = isFilledString(explicit) ? keyOf(explicit.trim()) : undefined

  if (resolved) return resolved

  // Fall back to NODE_ENV
  return process.env.NODE_ENV === 'production' ? 'production' : 'development'
}

const current = resolveEnvironment()

// Process.env reader
export const EnvironmentService = {
  current,
  isProduction: current === 'production',
  isDevelopment: current === 'development',

  /**
   * Read variable
   * @param {string} name - Name
   * @return {string | undefined} - Value
   */

  read: (name: string): string | undefined => {
    const value = process.env[name]

    return isFilledString(value) ? value.trim() : undefined
  },
} as const
