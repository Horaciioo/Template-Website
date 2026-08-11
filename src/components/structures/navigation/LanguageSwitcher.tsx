'use client'

import { useLocale, useTranslations } from 'next-intl'

import { Icon } from '@/components/elements/media/Icon'
import { NAVIGATION_STYLES } from '@/declarations/ui/variants'
import { Link, usePathname } from '@/i18n/routing'
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
  const t = useTranslations('navigation')
  const alternates = I18nService.alternatesOf(locale)

  if (alternates.length === 0) return null

  return (
    <div className={cn('flex items-center gap-1', className)} aria-label={t('language')}>
      <Icon name="language" size="sm" className="text-foreground-subtle" />
      {alternates.map((alternate) => (
        <Link
          key={alternate}
          href={pathname}
          locale={alternate}
          hrefLang={alternate}
          className={cn(NAVIGATION_STYLES.link, 'uppercase')}
          onClick={() => AnalyticsService.track('localeChanged', { locale: alternate })}>
          {alternate}
        </Link>
      ))}
    </div>
  )
}
