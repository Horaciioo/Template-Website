import type { ReactNode } from 'react'

import { GAPS, GRID_COLUMNS } from '@/declarations/ui/tokens'
import type { GridColumnCount } from '@/declarations/ui/tokens'
import type { Size, Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface GridProps extends Styleable {
  // Column count
  columns?: GridColumnCount
  gap?: Size
  children: ReactNode
}

/**
 * Responsive grid
 * @param {GridProps} props - Grid props
 * @return {JSX.Element} - Rendered grid
 */

export const Grid = ({ columns = 3, gap = 'md', children, className }: GridProps) => (
  <div className={cn('grid', GRID_COLUMNS[columns], GAPS[gap], className)}>{children}</div>
)
