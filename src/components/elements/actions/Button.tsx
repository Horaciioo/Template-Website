import type { ButtonHTMLAttributes } from 'react'

import { Icon } from '@/components/elements/media/Icon'
import type { IconName } from '@/declarations/ui/icons'
import { ACTION_ICON_SIZES, buttonClass } from '@/declarations/ui/variants'
import type { ButtonVariant } from '@/declarations/ui/variants'
import type { Size } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: Size
  icon?: IconName
  iconPosition?: 'left' | 'right'
  loading?: boolean
  fullWidth?: boolean
}

/**
 * Action button
 * @param {ButtonProps} props - Button props
 * @return {JSX.Element} - Rendered button
 */

export const Button = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) => {
  const iconSize = ACTION_ICON_SIZES[size]

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonClass({ variant, size, fullWidth }), className)}
      {...rest}>
      {loading && <Icon name="spinner" size={iconSize} className="animate-spin" />}
      {!loading && icon && iconPosition === 'left' && <Icon name={icon} size={iconSize} />}
      {children}
      {!loading && icon && iconPosition === 'right' && <Icon name={icon} size={iconSize} />}
    </button>
  )
}
