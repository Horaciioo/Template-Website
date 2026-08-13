import type { CONFIG_SUBJECTS, ENVIRONMENT_REGISTRY } from '@/declarations/environments'
import type { RegistryKey } from '@/types/common'

/**
 * Declared environment identifier
 * @typedef {RegistryKey<typeof ENVIRONMENT_REGISTRY>} EnvironmentKey
 */

export type EnvironmentKey = RegistryKey<typeof ENVIRONMENT_REGISTRY>

/**
 * Config subject
 * @typedef {typeof CONFIG_SUBJECTS[number]} ConfigSubject
 */

export type ConfigSubject = (typeof CONFIG_SUBJECTS)[number]

/**
 * Environment manifest
 * @typedef EnvironmentManifest
 * @property {EnvironmentKey} key - Key
 * @property {string} branch - Branch
 * @property {string} label - Label
 * @property {boolean} debug - Debug
 * @property {boolean} strict - Strict
 * @property {ConfigSubject[]} required - Required
 */

export interface EnvironmentManifest {
  key: EnvironmentKey
  branch: string
  label: string
  debug: boolean
  strict: boolean
  required: ConfigSubject[]
}

/**
 * Resolved "site" subject
 * @typedef SiteEnvironmentConfig
 * @property {string} url - Canonical site URL
 */

export interface SiteEnvironmentConfig {
  url: string
}

/**
 * Resolved "analytics" subject
 * @typedef AnalyticsEnvironmentConfig
 * @property {boolean} enabled - Tracking activation
 * @property {string} googleAnalyticsId - GA4 measurement ID
 */

export interface AnalyticsEnvironmentConfig {
  enabled: boolean
  // GA4 measurement ID
  googleAnalyticsId: string
}

/**
 * Resolved "mail" subject
 * @typedef MailEnvironmentConfig
 * @property {string} apiKey - Provider API key
 * @property {string} from - Sender address
 * @property {string} to - Recipient address
 */

export interface MailEnvironmentConfig {
  apiKey: string
  from: string
  to: string
}

/**
 * Resolved "seo" subject
 * @typedef SeoEnvironmentConfig
 * @property {boolean} noindex - Forced deindexing outside production
 */

export interface SeoEnvironmentConfig {
  noindex: boolean
}

/**
 * Resolved "calendar" subject
 * @typedef CalendarEnvironmentConfig
 * @property {string} calendarId - Target Google calendar
 * @property {string} clientEmail - Service account address
 * @property {string} privateKey - Service account key
 */

export interface CalendarEnvironmentConfig {
  calendarId: string
  clientEmail: string
  privateKey: string
}
