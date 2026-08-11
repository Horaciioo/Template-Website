import type { ElementType, ReactNode } from 'react'

import { TEXT_STYLES } from '@/declarations/ui/variants'
import type { TextStyle } from '@/declarations/ui/variants'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface TextProps extends Styleable {
  // Named style
  appearance?: TextStyle
  as?: ElementType
  children: ReactNode
}

/**
 * Text
 * @param {TextProps} props - Text props
 * @return {JSX.Element} - Rendered text
 */

export const Text = ({ appearance = 'body', as: Tag = 'p', children, className }: TextProps) => (
  <Tag className={cn(TEXT_STYLES[appearance], className)}>{children}</Tag>
)
