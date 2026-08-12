import mainManifest from '@/configurations/admins/environments/main.json'
import devManifest from '@/configurations/admins/environments/dev.json'
import releaseManifest from '@/configurations/admins/environments/release.json'
import stagingManifest from '@/configurations/admins/environments/staging.json'

import analyticsDevelopmentDefaults from '@/configurations/admins/defaults/analytics/analytics.development.json'
import analyticsProductionDefaults from '@/configurations/admins/defaults/analytics/analytics.production.json'
import analyticsReleaseDefaults from '@/configurations/admins/defaults/analytics/analytics.release.json'
import analyticsStagingDefaults from '@/configurations/admins/defaults/analytics/analytics.staging.json'
import analyticsDevelopmentTemplate from '@/configurations/admins/templates/analytics/analytics.development.json'
import analyticsProductionTemplate from '@/configurations/admins/templates/analytics/analytics.production.json'
import analyticsReleaseTemplate from '@/configurations/admins/templates/analytics/analytics.release.json'
import analyticsStagingTemplate from '@/configurations/admins/templates/analytics/analytics.staging.json'

import mailDevelopmentDefaults from '@/configurations/admins/defaults/mail/mail.development.json'
import mailProductionDefaults from '@/configurations/admins/defaults/mail/mail.production.json'
import mailReleaseDefaults from '@/configurations/admins/defaults/mail/mail.release.json'
import mailStagingDefaults from '@/configurations/admins/defaults/mail/mail.staging.json'
import mailDevelopmentTemplate from '@/configurations/admins/templates/mail/mail.development.json'
import mailProductionTemplate from '@/configurations/admins/templates/mail/mail.production.json'
import mailReleaseTemplate from '@/configurations/admins/templates/mail/mail.release.json'
import mailStagingTemplate from '@/configurations/admins/templates/mail/mail.staging.json'

import seoDevelopmentDefaults from '@/configurations/admins/defaults/seo/seo.development.json'
import seoProductionDefaults from '@/configurations/admins/defaults/seo/seo.production.json'
import seoReleaseDefaults from '@/configurations/admins/defaults/seo/seo.release.json'
import seoStagingDefaults from '@/configurations/admins/defaults/seo/seo.staging.json'

import siteDevelopmentDefaults from '@/configurations/admins/defaults/site/site.development.json'
import siteProductionDefaults from '@/configurations/admins/defaults/site/site.production.json'
import siteReleaseDefaults from '@/configurations/admins/defaults/site/site.release.json'
import siteStagingDefaults from '@/configurations/admins/defaults/site/site.staging.json'
import siteDevelopmentTemplate from '@/configurations/admins/templates/site/site.development.json'
import siteProductionTemplate from '@/configurations/admins/templates/site/site.production.json'
import siteReleaseTemplate from '@/configurations/admins/templates/site/site.release.json'
import siteStagingTemplate from '@/configurations/admins/templates/site/site.staging.json'

import features from '@/configurations/features.json'
import identity from '@/configurations/identity.json'
import localization from '@/configurations/localization.json'
import navigation from '@/configurations/navigation.json'
import seo from '@/configurations/seo.json'
import site from '@/configurations/site.json'
import social from '@/configurations/social.json'
import httpTimings from '@/configurations/system/http.json'
import storageSettings from '@/configurations/system/storage.json'
import timings from '@/configurations/system/timings.json'
import validation from '@/configurations/system/validation.json'
import viewport from '@/configurations/system/viewport.json'
import theme from '@/configurations/theme.json'
import { EnvironmentService } from '@/services/EnvironmentService'
import { LoggerService } from '@/services/LoggerService'
import type {
  AnalyticsEnvironmentConfig,
  EnvironmentKey,
  EnvironmentManifest,
  MailEnvironmentConfig,
  SeoEnvironmentConfig,
  SiteEnvironmentConfig,
} from '@/types/environment'
import { isDefined } from '@/utils/guards'

const MANIFESTS: Record<EnvironmentKey, EnvironmentManifest> = {
  development: devManifest as EnvironmentManifest,
  staging: stagingManifest as EnvironmentManifest,
  release: releaseManifest as EnvironmentManifest,
  production: mainManifest as EnvironmentManifest,
}

const ANALYTICS_DEFAULTS: Record<EnvironmentKey, AnalyticsEnvironmentConfig> = {
  development: analyticsDevelopmentDefaults,
  staging: analyticsStagingDefaults,
  release: analyticsReleaseDefaults,
  production: analyticsProductionDefaults,
}

const ANALYTICS_TEMPLATES: Record<EnvironmentKey, { enabled: string; googleAnalyticsId: string }> =
  {
    development: analyticsDevelopmentTemplate,
    staging: analyticsStagingTemplate,
    release: analyticsReleaseTemplate,
    production: analyticsProductionTemplate,
  }

const MAIL_DEFAULTS: Record<EnvironmentKey, MailEnvironmentConfig> = {
  development: mailDevelopmentDefaults,
  staging: mailStagingDefaults,
  release: mailReleaseDefaults,
  production: mailProductionDefaults,
}

const MAIL_TEMPLATES: Record<EnvironmentKey, { apiKey: string; from: string; to: string }> = {
  development: mailDevelopmentTemplate,
  staging: mailStagingTemplate,
  release: mailReleaseTemplate,
  production: mailProductionTemplate,
}

const SEO_DEFAULTS: Record<EnvironmentKey, SeoEnvironmentConfig> = {
  development: seoDevelopmentDefaults,
  staging: seoStagingDefaults,
  release: seoReleaseDefaults,
  production: seoProductionDefaults,
}

const SITE_DEFAULTS: Record<EnvironmentKey, SiteEnvironmentConfig> = {
  development: siteDevelopmentDefaults,
  staging: siteStagingDefaults,
  release: siteReleaseDefaults,
  production: siteProductionDefaults,
}

const SITE_TEMPLATES: Record<EnvironmentKey, { url: string }> = {
  development: siteDevelopmentTemplate,
  staging: siteStagingTemplate,
  release: siteReleaseTemplate,
  production: siteProductionTemplate,
}

/**
 * Type-check field
 * @param {string} subject - Configuration subject
 * @param {string} path - Field path
 * @param {T} fallback - Default value
 * @param {unknown} raw - Raw value
 * @return {T} - Typed value
 */

function readField<T extends string | number | boolean>(
  subject: string,
  path: string,
  fallback: T,
  raw: unknown
): T {
  if (raw === undefined) return fallback

  if (typeof fallback === 'number') {
    const parsed = Number(raw)

    if (Number.isNaN(parsed)) {
      LoggerService.warn('configuration.invalidField', { subject, path, fallback })

      return fallback
    }

    return parsed as T
  }

  if (typeof fallback === 'boolean') {
    if (raw === 'true' || raw === true) return true as T
    if (raw === 'false' || raw === false) return false as T

    LoggerService.warn('configuration.invalidField', { subject, path, fallback })

    return fallback
  }

  if (typeof raw !== typeof fallback) {
    LoggerService.warn('configuration.invalidField', { subject, path, fallback })

    return fallback
  }

  return raw as T
}

const TEMPLATE_VARIABLE = /^\$\{(.+)\}$/

/**
 * Resolve template
 * @param {string} [template] - Template value
 * @return {string | undefined} - Resolved value
 */

const resolveTemplate = (template?: string): string | undefined => {
  const name = template?.match(TEMPLATE_VARIABLE)?.[1]

  return name ? EnvironmentService.read(name) : undefined
}

const readSiteConfig = (env: EnvironmentKey): SiteEnvironmentConfig => {
  const defaults = SITE_DEFAULTS[env]
  const template = SITE_TEMPLATES[env]
  const url = readField('site', 'url', defaults.url, resolveTemplate(template.url))

  // Domain fallback
  return { url: url || `https://${site.domain}` }
}

const readAnalyticsConfig = (env: EnvironmentKey): AnalyticsEnvironmentConfig => {
  const defaults = ANALYTICS_DEFAULTS[env]
  const template = ANALYTICS_TEMPLATES[env]

  return {
    enabled: readField('analytics', 'enabled', defaults.enabled, resolveTemplate(template.enabled)),
    googleAnalyticsId: readField(
      'analytics',
      'googleAnalyticsId',
      defaults.googleAnalyticsId,
      resolveTemplate(template.googleAnalyticsId)
    ),
  }
}

const readMailConfig = (env: EnvironmentKey): MailEnvironmentConfig => {
  const defaults = MAIL_DEFAULTS[env]
  const template = MAIL_TEMPLATES[env]
  const from = readField('mail', 'from', defaults.from, resolveTemplate(template.from))
  const to = readField('mail', 'to', defaults.to, resolveTemplate(template.to))

  return {
    apiKey: readField('mail', 'apiKey', defaults.apiKey, resolveTemplate(template.apiKey)),
    // Email fallback
    from: from || identity.email,
    to: to || identity.email,
  }
}

const readSeoConfig = (env: EnvironmentKey): SeoEnvironmentConfig => {
  const defaults = SEO_DEFAULTS[env]

  return { noindex: readField('seo', 'noindex', defaults.noindex, defaults.noindex) }
}

const currentEnvironment = EnvironmentService.current
const siteEnvironment = readSiteConfig(currentEnvironment)

// Configuration access
export const ConfigurationService = {
  site,
  identity,
  localization,
  navigation,
  seo,
  social,
  theme,
  features,
  viewport,
  http: httpTimings,
  storage: storageSettings,
  validation,
  timings,

  // Environment values
  environment: {
    current: currentEnvironment,
    manifest: MANIFESTS[currentEnvironment],
    site: siteEnvironment,
    analytics: readAnalyticsConfig(currentEnvironment),
    mail: readMailConfig(currentEnvironment),
    seo: readSeoConfig(currentEnvironment),

    /**
     * Absolute URL builder
     * @param {string} path - Pathname
     * @return {string} - URL
     */

    absoluteUrl: (path: string): string => new URL(path, siteEnvironment.url).toString(),
  },

  /**
   * Read a feature flag
   * @param {keyof typeof features} name - Declared flag
   * @return {boolean} - Enabled flag
   */

  isEnabled: (name: keyof typeof features): boolean => features[name],

  /**
   * Social links
   * @return {Object[]} - Networks
   */

  socialLinks: (): { id: keyof typeof social; href: string }[] =>
    Object.entries(social)
      .filter(([, href]) => isDefined(href))
      .map(([id, href]) => ({ id: id as keyof typeof social, href: href as string })),

  /**
   * Copyright years
   * @param {number} [currentYear] - Close year
   * @return {string} - Year range
   */

  copyrightYears: (currentYear: number = new Date().getFullYear()): string =>
    currentYear <= site.launchYear ? `${site.launchYear}` : `${site.launchYear}–${currentYear}`,
} as const
