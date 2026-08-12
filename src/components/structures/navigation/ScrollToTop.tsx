'use client'

import { useTranslations } from 'next-intl'

import { IconButton } from '@/components/elements/actions/IconButton'
import { LAYERS } from '@/declarations/ui/tokens'
import { SCROLL_TO_TOP_STYLES } from '@/declarations/ui/variants'
import { ConfigurationService } from '@/services/ConfigurationService'
import { ScrollService } from '@/services/ScrollService'
import { cn } from '@/utils/classnames'

// Minimum scroll threshold
const VISIBLE_FROM = ConfigurationService.viewport.breakpoints.sm

/**
 * Scroll-to-top
 * @return {JSX.Element} - Rendered button
 */

export const ScrollToTop = () => {
  const { offset } = ScrollService.use()
  const t = useTranslations('actions')
  const isVisible = offset > VISIBLE_FROM

  return (
    <IconButton
      icon="arrowUp"
      variant="secondary"
      label={t('scrollToTop')}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      onClick={ScrollService.toTop}
      className={cn(
        SCROLL_TO_TOP_STYLES.button,
        LAYERS.dropdown,
        !isVisible && SCROLL_TO_TOP_STYLES.hidden
      )}
    />
  )
}
