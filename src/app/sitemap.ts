import type { MetadataRoute } from 'next'

import { I18nService } from '@/services/I18nService'
import { NavigationService } from '@/services/NavigationService'
import { SeoService } from '@/services/SeoService'

/**
 * Sitemap metadata
 * @return {MetadataRoute.Sitemap} - Sitemap config
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return NavigationService.indexableRoutes().flatMap((routeId) => {
    const path = NavigationService.pathOf(routeId)

    return I18nService.locales.map((locale) => ({
      url: SeoService.absoluteUrlOf(locale, path),
      lastModified,
      alternates: {
        languages: Object.fromEntries(
          I18nService.locales.map((alternate) => [
            alternate,
            SeoService.absoluteUrlOf(alternate, path),
          ])
        ),
      },
    }))
  })
}
