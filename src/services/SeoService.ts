import type { Metadata } from 'next'

import { ConfigurationService } from '@/services/ConfigurationService'
import { EnvironmentService } from '@/services/EnvironmentService'
import { I18nService } from '@/services/I18nService'
import { NavigationService } from '@/services/NavigationService'
import type { Translate } from '@/services/NavigationService'
import type { RouteId } from '@/types/navigation'

const { seo, site, identity } = ConfigurationService

// Verification tokens
const bingToken: string | null = seo.verification.bing
const googleToken: string | null = seo.verification.google
const twitterHandle: string | null = seo.twitterHandle

// Localized path
const localizedPath = (locale: string, path: string): string =>
  locale === I18nService.defaultLocale ? path : `${`/${locale}`}${path === '/' ? '' : path}`

/**
 * Page metadata builder
 */

export const SeoService = {
  /**
   * Route metadata
   * @param {Object} input - Page context
   * @param {RouteId} input.routeId - Route ID
   * @param {string} input.locale - Locale
   * @param {Translate} input.translate - Translate function
   * @return {Metadata} - Metadata
   */

  buildMetadata: ({
    routeId,
    locale,
    translate,
  }: {
    routeId: RouteId
    locale: string
    translate: Translate
  }): Metadata => {
    const key = NavigationService.keyOf(routeId)
    const path = NavigationService.pathOf(routeId)
    const title = translate(`${key}.metaTitle`)
    const description = translate(`${key}.metaDescription`)
    const canonical = EnvironmentService.absoluteUrl(localizedPath(locale, path))
    const isIndexable =
      NavigationService.declarationOf(routeId).indexable !== false && seo.robots.index

    return {
      title,
      description,
      metadataBase: new URL(EnvironmentService.siteUrl),
      alternates: {
        canonical,
        languages: Object.fromEntries(
          I18nService.locales.map((alternate) => [
            alternate,
            EnvironmentService.absoluteUrl(localizedPath(alternate, path)),
          ])
        ),
      },
      openGraph: {
        type: 'website',
        siteName: site.name,
        locale,
        title,
        description,
        url: canonical,
        images: [EnvironmentService.absoluteUrl(seo.defaultImage)],
      },
      twitter: {
        card: 'summary_large_image',
        site: twitterHandle ?? undefined,
        title,
        description,
      },
      robots: { index: isIndexable, follow: seo.robots.follow },
      verification: {
        google: googleToken ?? undefined,
        other: bingToken ? { 'msvalidate.01': bingToken } : undefined,
      },
    }
  },

  /**
   * Build the root title template, applied to every page title of the site
   * @return {Metadata} - Metadata shared by the whole tree
   */

  buildRootMetadata: (): Metadata => ({
    title: { default: site.name, template: seo.titleTemplate },
    applicationName: site.name,
    metadataBase: new URL(EnvironmentService.siteUrl),
  }),

  /**
   * Build the organisation structured data injected once in the layout
   * @param {string} locale - Active locale
   * @return {Record<string, unknown>} - JSON-LD payload
   */

  buildOrganizationSchema: (locale: string): Record<string, unknown> => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: identity.legalName,
    alternateName: identity.tradeName,
    url: EnvironmentService.absoluteUrl(localizedPath(locale, NavigationService.pathOf('home'))),
    email: identity.email,
    telephone: identity.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: identity.address.street,
      postalCode: identity.address.postalCode,
      addressLocality: identity.address.city,
      addressCountry: identity.address.country,
    },
    sameAs: ConfigurationService.socialLinks().map((link) => link.href),
  }),

  /**
   * Build the localised URL of a route, shared by the metadata, the sitemap and the switcher
   * @param {string} locale - Target locale
   * @param {string} path - Pathname without the locale prefix
   * @return {string} - Absolute URL
   */

  absoluteUrlOf: (locale: string, path: string): string =>
    EnvironmentService.absoluteUrl(localizedPath(locale, path)),
} as const
