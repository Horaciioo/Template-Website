import type { ElementType, ReactNode } from 'react'

import { CONTAINER_WIDTHS } from '@/declarations/ui/tokens'
import type { ContainerWidth } from '@/declarations/ui/tokens'
import { LAYOUT } from '@/declarations/ui/variants'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface ContainerProps extends Styleable {
  width?: ContainerWidth
  as?: ElementType
  children: ReactNode
}

/**
 * Container
 * @param {ContainerProps} props - Container props
 * @return {JSX.Element} - Rendered container
 */

export const Container = ({
  width = 'default',
  as: Tag = 'div',
  children,
  className,
}: ContainerProps) => (
  <Tag className={cn(LAYOUT.container, CONTAINER_WIDTHS[width], className)}>{children}</Tag>
)
