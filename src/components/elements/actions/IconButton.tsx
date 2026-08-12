import type { ButtonHTMLAttributes } from 'react'

import { Icon } from '@/components/elements/media/Icon'
import type { IconName } from '@/declarations/ui/icons'
import {
  BUTTON_BASE,
  BUTTON_VARIANTS,
  ICON_BUTTON_ICON_SIZES,
  ICON_BUTTON_SIZES,
} from '@/declarations/ui/variants'
import type { ButtonVariant } from '@/declarations/ui/variants'
import type { Size } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName
  // Screen reader label
  label: string
  variant?: ButtonVariant
  size?: Size
}

/**
 * Icon button
 * @param {IconButtonProps} props - Icon button props
 * @return {JSX.Element} - Rendered button
 */

export const IconButton = ({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  className,
  type = 'button',
  ...rest
}: IconButtonProps) => (
  <button
    type={type}
    aria-label={label}
    title={label}
    className={cn(BUTTON_BASE, ICON_BUTTON_SIZES[size], BUTTON_VARIANTS[variant], className)}
    {...rest}>
    <Icon name={icon} size={ICON_BUTTON_ICON_SIZES[size]} />
  </button>
)
