import type { ReactNode } from 'react'

import { Icon } from '@/components/elements/media/Icon'
import type { IconName } from '@/declarations/ui/icons'
import { TONE_BORDER, TONE_SOFT } from '@/declarations/ui/tokens'
import { ALERT_STYLES } from '@/declarations/ui/variants'
import type { Styleable, Tone } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface AlertProps extends Styleable {
  tone?: Tone
  title: string
  description?: string
  icon?: IconName
  action?: ReactNode
}

// Default icons
const TONE_ICONS: Record<Tone, IconName> = {
  neutral: 'info',
  primary: 'info',
  accent: 'sparkles',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
}

/**
 * Alert
 * @param {AlertProps} props - Alert props
 * @return {JSX.Element} - Rendered alert
 */

export const Alert = ({
  tone = 'info',
  title,
  description,
  icon,
  action,
  className,
}: AlertProps) => (
  <div
    role="alert"
    className={cn(ALERT_STYLES.frame, TONE_SOFT[tone], TONE_BORDER[tone], className)}>
    <Icon name={icon ?? TONE_ICONS[tone]} className={ALERT_STYLES.icon} />
    <div className={ALERT_STYLES.content}>
      <p className={ALERT_STYLES.title}>{title}</p>
      {description && <p className={ALERT_STYLES.description}>{description}</p>}
      {action}
    </div>
  </div>
)
