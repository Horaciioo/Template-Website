import type { ReactNode } from 'react'

import { TOOLTIP_STYLES } from '@/declarations/ui/variants'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface TooltipProps extends Styleable {
  // Tooltip label
  label: string
  children: ReactNode
}

/**
 * Tooltip
 * @param {TooltipProps} props - Tooltip props
 * @return {JSX.Element} - Rendered wrapper
 */

export const Tooltip = ({ label, children, className }: TooltipProps) => (
  <span className={cn('group', TOOLTIP_STYLES.wrapper, className)}>
    {children}
    <span role="tooltip" className={TOOLTIP_STYLES.bubble}>
      {label}
    </span>
  </span>
)
