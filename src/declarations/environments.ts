/**
 * Environment registry
 * @type {Object}
 */

export const ENVIRONMENT_REGISTRY = {
  development: { branch: 'dev', label: 'Developpement' },
  staging: { branch: 'staging', label: 'Recette' },
  release: { branch: 'release', label: 'Preproduction' },
  production: { branch: 'main', label: 'Production' },
} as const

/**
 * Config subjects
 * @type {string[]}
 */

export const CONFIG_SUBJECTS = ['site', 'analytics', 'mail', 'seo', 'calendar'] as const
