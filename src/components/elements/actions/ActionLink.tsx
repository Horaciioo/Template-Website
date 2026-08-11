import type { ReactNode } from 'react'

import { Icon } from '@/components/elements/media/Icon'
import type { IconName } from '@/declarations/ui/icons'
import { ACTION_ICON_SIZES, buttonClass } from '@/declarations/ui/variants'
import type { ButtonVariant } from '@/declarations/ui/variants'
import { Link } from '@/i18n/routing'
import { NavigationService } from '@/services/NavigationService'
import type { Size } from '@/types/common'
import type { RouteId } from '@/types/navigation'
import { cn } from '@/utils/classnames'
import { isExternalHref } from '@/utils/guards'

export interface ActionLinkProps {
  // Declared route
  route?: RouteId
  href?: string
  variant?: ButtonVariant
  size?: Size
  icon?: IconName
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  children: ReactNode
  className?: string
}

/**
 * Styled link
 * @param {ActionLinkProps} props - Link props
 * @return {JSX.Element} - Rendered link
 */

export const ActionLink = ({
  route,
  href,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className,
}: ActionLinkProps) => {
  const target = route ? NavigationService.pathOf(route) : (href ?? '/')
  const classes = cn(buttonClass({ variant, size, fullWidth }), className)
  const glyph = icon ? <Icon name={icon} size={ACTION_ICON_SIZES[size]} /> : null
  const content = (
    <>
      {iconPosition === 'left' && glyph}
      {children}
      {iconPosition === 'right' && glyph}
    </>
  )

  if (isExternalHref(target) || target.startsWith('#')) {
    return (
      <a
        href={target}
        className={classes}
        rel={isExternalHref(target) ? 'noopener noreferrer' : undefined}
        target={isExternalHref(target) ? '_blank' : undefined}>
        {content}
      </a>
    )
  }

  return (
    <Link href={target} className={classes}>
      {content}
    </Link>
  )
}
