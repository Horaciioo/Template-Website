import type { ReactNode } from 'react'

import { Icon } from '@/components/elements/media/Icon'
import type { IconName } from '@/declarations/ui/icons'
import { BADGE_BASE, BADGE_SIZES, BADGE_VARIANTS } from '@/declarations/ui/variants'
import type { BadgeVariant } from '@/declarations/ui/variants'
import type { Size, Styleable, Tone } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface BadgeProps extends Styleable {
  tone?: Tone
  variant?: BadgeVariant
  size?: Size
  icon?: IconName
  children: ReactNode
}

/**
 * Badge
 * @param {BadgeProps} props - Badge props
 * @return {JSX.Element} - Rendered badge
 */

export const Badge = ({
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  icon,
  children,
  className,
}: BadgeProps) => (
  <span className={cn(BADGE_BASE, BADGE_SIZES[size], BADGE_VARIANTS[variant][tone], className)}>
    {icon && <Icon name={icon} size="xs" />}
    {children}
  </span>
)
