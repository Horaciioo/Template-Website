import { ConfigurationService } from '@/services/ConfigurationService'
import { isFilledString } from '@/utils/guards'

// Environment variables
const read = (value: string | undefined, fallback = ''): string =>
  isFilledString(value) ? value.trim() : fallback

export const EnvironmentService = {
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',

  siteUrl: read(process.env.NEXT_PUBLIC_SITE_URL, `https://${ConfigurationService.site.domain}`),

  analytics: {
    isEnabled:
      ConfigurationService.isEnabled('analytics') &&
      read(process.env.NEXT_PUBLIC_ANALYTICS_ENABLED) === 'true',
  },

  mail: {
    apiKey: read(process.env.MAIL_API_KEY),
    from: read(process.env.MAIL_FROM, ConfigurationService.identity.email),
    to: read(process.env.MAIL_TO, ConfigurationService.identity.email),
  },

  /**
   * Absolute URL builder
   * @param {string} path - Pathname
   * @return {string} - URL
   */

  absoluteUrl: (path: string): string => new URL(path, EnvironmentService.siteUrl).toString(),
} as const
