import type { ReactNode } from 'react'

import { ALIGNMENTS, GAPS } from '@/declarations/ui/tokens'
import type { Alignment, Direction, Size, Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface StackProps extends Styleable {
  direction?: Direction
  gap?: Size
  align?: Alignment
  wrap?: boolean
  children: ReactNode
}

const DIRECTIONS: Record<Direction, string> = {
  vertical: 'flex-col',
  horizontal: 'flex-row',
}

/**
 * Stack
 * @param {StackProps} props - Stack props
 * @return {JSX.Element} - Rendered stack
 */

export const Stack = ({
  direction = 'vertical',
  gap = 'md',
  align,
  wrap = false,
  children,
  className,
}: StackProps) => (
  <div
    className={cn(
      'flex',
      DIRECTIONS[direction],
      GAPS[gap],
      align && ALIGNMENTS[align],
      wrap && 'flex-wrap',
      className
    )}>
    {children}
  </div>
)
