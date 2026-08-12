/**
 * Canonical action names
 * @type {string[]}
 */

export const ACTIONS = [
  'signUp',
  'signIn',
  'signOut',
  'resetPassword',
  'updateProfile',
  'deleteAccount',
  'contact',
  'subscribeNewsletter',
  'requestQuote',
  'bookAppointment',
  'getDirections',
  'showcase',
  'accept',
  'decline',
  'manageCookies',
  'create',
  'update',
  'delete',
  'duplicate',
  'search',
  'filter',
  'sort',
  'export',
  'share',
  'download',
  'upload',
  'copy',
  'confirm',
  'cancel',
  'retry',
  'submit',
  'open',
  'close',
  'toggle',
  'next',
  'previous',
  'loadMore',
  'scrollToTop',
] as const

/**
 * Canonical entity names
 * @type {string[]}
 */

export const ENTITIES = [
  'user',
  'account',
  'profile',
  'session',
  'message',
  'article',
  'category',
  'media',
  'offer',
  'testimonial',
  'question',
  'plan',
] as const

/**
 * Boolean property prefixes
 * @type {string[]}
 */

export const BOOLEAN_PREFIXES = ['is', 'has', 'can', 'should', 'will'] as const

/**
 * Event handler prefixes
 * @type {string[]}
 */

export const HANDLER_PREFIXES = ['on', 'handle'] as const

/**
 * Action name
 * @typedef {(typeof ACTIONS)[number]} ActionName
 */

export type ActionName = (typeof ACTIONS)[number]

/**
 * Entity name
 * @typedef {(typeof ENTITIES)[number]} EntityName
 */

export type EntityName = (typeof ENTITIES)[number]

/**
 * Translation namespaces
 * @type {Object}
 */

export const TRANSLATION_NAMESPACES = {
  actions: 'actions',
  routes: 'routes',
  navigation: 'navigation',
  sections: 'sections',
  forms: 'forms',
  validation: 'validation',
  errors: 'errors',
  feedback: 'feedback',
  formats: 'formats',
  legal: 'legal',
  showcase: 'showcase',
  consent: 'consent',
} as const
