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
import { isDefined } from '@/utils/guards'

/**
 * Configuration access
 */

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

  /**
   * Read a feature flag
   * @param {keyof typeof features} name - Flag declared in configurations/features.json
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
   * Build the copyright range, the launch year alone when the site is younger than a year
   * @param {number} [currentYear] - Year to close the range on
   * @return {string} - Year or year range
   */

  copyrightYears: (currentYear: number = new Date().getFullYear()): string =>
    currentYear <= site.launchYear ? `${site.launchYear}` : `${site.launchYear}–${currentYear}`,
} as const
