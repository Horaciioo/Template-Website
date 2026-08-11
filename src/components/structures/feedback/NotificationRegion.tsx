'use client'

import { useTranslations } from 'next-intl'

import { IconButton } from '@/components/elements/actions/IconButton'
import { Icon } from '@/components/elements/media/Icon'
import { LAYERS, TONE_BORDER, TONE_SOFT } from '@/declarations/ui/tokens'
import { TOAST_STYLES } from '@/declarations/ui/variants'
import { NotificationService } from '@/services/NotificationService'
import { cn } from '@/utils/classnames'

/**
 * Notification region
 * @return {JSX.Element | null} - Rendered region
 */

export const NotificationRegion = () => {
  const notifications = NotificationService.use()
  const t = useTranslations()
  const actions = useTranslations('actions')

  if (notifications.length === 0) return null

  return (
    <div role="status" aria-live="polite" className={cn(TOAST_STYLES.region, LAYERS.toast)}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            TOAST_STYLES.toast,
            TONE_SOFT[notification.tone],
            TONE_BORDER[notification.tone]
          )}>
          <Icon name={notification.tone === 'danger' ? 'danger' : 'success'} size="sm" />
          <p className="flex-1 text-sm">{t(notification.translationKey, notification.params)}</p>
          <IconButton
            icon="close"
            size="sm"
            label={actions('close')}
            onClick={() => NotificationService.dismiss(notification.id)}
          />
        </div>
      ))}
    </div>
  )
}
