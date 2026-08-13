import type { ConsentCategoryDeclaration } from '@/types/consent'

/**
 * Analytics event IDs
 * @type {Object}
 */

export const ANALYTICS_EVENTS = {
  pageViewed: 'pageViewed',
  callToActionClicked: 'callToActionClicked',
  formSubmitted: 'formSubmitted',
  formFailed: 'formFailed',
  localeChanged: 'localeChanged',
  themeChanged: 'themeChanged',
  outboundLinkClicked: 'outboundLinkClicked',
} as const

/**
 * Analytics event name
 * @typedef {keyof typeof ANALYTICS_EVENTS} AnalyticsEvent
 */

export type AnalyticsEvent = keyof typeof ANALYTICS_EVENTS

/**
 * Log severity levels
 * @type {Object}
 */

export const LOG_LEVELS = {
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
} as const

/**
 * Log level name
 * @typedef {keyof typeof LOG_LEVELS} LogLevel
 */

export type LogLevel = keyof typeof LOG_LEVELS

/**
 * Cookie categories
 * @type {Record<string, ConsentCategoryDeclaration>}
 */

export const CONSENT_CATEGORIES = {
  necessary: { isRequired: true },
  analytics: { isRequired: false, feature: 'analytics' },
} as const satisfies Record<string, ConsentCategoryDeclaration>

/**
 * Cookie category name
 * @typedef {keyof typeof CONSENT_CATEGORIES} ConsentCategory
 */

export type ConsentCategory = keyof typeof CONSENT_CATEGORIES

/**
 * Storage key names
 * @type {Object}
 */

export const STORAGE_KEYS = {
  themeMode: 'theme-mode',
  consent: 'consent',
} as const

/**
 * Storage key name
 * @typedef {keyof typeof STORAGE_KEYS} StorageKey
 */

export type StorageKey = keyof typeof STORAGE_KEYS
