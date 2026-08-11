import { LAYOUT } from '@/declarations/ui/variants'
import type { Direction, Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface DividerProps extends Styleable {
  direction?: Direction
}

/**
 * Divider
 * @param {DividerProps} props - Divider props
 * @return {JSX.Element} - Rendered divider
 */

export const Divider = ({ direction = 'horizontal', className }: DividerProps) => (
  <span
    role="separator"
    aria-orientation={direction}
    className={cn(direction === 'horizontal' ? LAYOUT.divider : LAYOUT.dividerVertical, className)}
  />
)
