import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

import { I18nService } from '@/services/I18nService'

// i18n routing config
export const routing = defineRouting({
  locales: I18nService.locales as [string, ...string[]],
  defaultLocale: I18nService.defaultLocale,
  localePrefix: I18nService.localePrefix,
})

/**
 * i18n navigation helpers
 */

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
