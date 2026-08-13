import type { ConsentCategory } from '@/declarations/analytics'
import type { ConfigurationService } from '@/services/ConfigurationService'

/**
 * Cookie consent status
 * @typedef {'pending' | 'granted' | 'denied'} ConsentStatus
 */

export type ConsentStatus = 'pending' | 'granted' | 'denied'

/**
 * Cookie category declaration
 * @typedef ConsentCategoryDeclaration
 * @property {boolean} isRequired - Always on flag
 * @property {string} [feature] - Feature flag gating it
 */

export interface ConsentCategoryDeclaration {
  isRequired: boolean
  feature?: Parameters<typeof ConfigurationService.isEnabled>[0]
}

/**
 * Accepted categories
 * @typedef {Record<ConsentCategory, boolean>} ConsentPreferences
 */

export type ConsentPreferences = Record<ConsentCategory, boolean>

/**
 * Stored consent
 * @typedef ConsentState
 * @property {ConsentStatus} status - Choice made
 * @property {ConsentPreferences} preferences - Accepted categories
 */

export interface ConsentState {
  status: ConsentStatus
  preferences: ConsentPreferences
}
