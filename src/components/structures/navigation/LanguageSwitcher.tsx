'use client'

import { useLocale, useTranslations } from 'next-intl'

import { Icon } from '@/components/elements/media/Icon'
import { LANGUAGE_SWITCHER_STYLES } from '@/declarations/ui/variants'
import { usePathname, useRouter } from '@/i18n/routing'
import { AnalyticsService } from '@/services/AnalyticsService'
import { I18nService } from '@/services/I18nService'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

/**
 * Language switcher
 * @param {Styleable} props - Language switcher props
 * @return {JSX.Element | null} - Rendered switcher
 */

export const LanguageSwitcher = ({ className }: Styleable) => {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('navigation')

  if (I18nService.locales.length < 2) return null

  // Swap locale on the very same route
  const handleChange = (next: string) => {
    AnalyticsService.track('localeChanged', { locale: next })
    router.replace(pathname, { locale: next })
  }

  return (
    <div className={cn(LANGUAGE_SWITCHER_STYLES.frame, className)}>
      <span className={LANGUAGE_SWITCHER_STYLES.flag} aria-hidden="true">
        {I18nService.flagOf(locale)}
      </span>

      <select
        value={locale}
        aria-label={t('language')}
        onChange={(event) => handleChange(event.target.value)}
        className={LANGUAGE_SWITCHER_STYLES.select}>
        {I18nService.locales.map((option) => (
          <option key={option} value={option}>
            {I18nService.languageNameOf(option)}
          </option>
        ))}
      </select>

      <Icon name="chevronDown" size="xs" className={LANGUAGE_SWITCHER_STYLES.indicator} />
    </div>
  )
}
