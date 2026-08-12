'use client'

import { useTranslations } from 'next-intl'

import { ActionLink } from '@/components/elements/actions/ActionLink'
import { LAYERS } from '@/declarations/ui/tokens'
import { STICKY_ACTION_BAR_STYLES } from '@/declarations/ui/variants'
import { NavigationService } from '@/services/NavigationService'
import { cn } from '@/utils/classnames'

/**
 * Sticky mobile CTA bar
 * @return {JSX.Element} - Rendered bar
 */

export const StickyActionBar = () => {
  const actions = useTranslations('actions')
  const target = NavigationService.callToActionRoute()

  return (
    <div className={cn(STICKY_ACTION_BAR_STYLES.frame, LAYERS.header)}>
      <ActionLink route={target} fullWidth icon="arrowRight" iconPosition="right">
        {actions(NavigationService.ctaActionOf(target))}
      </ActionLink>
    </div>
  )
}
