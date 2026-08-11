import type { ReactNode } from 'react'

import { HEADING_STYLES } from '@/declarations/ui/variants'
import type { HeadingLevel } from '@/declarations/ui/variants'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface HeadingProps extends Styleable {
  // Semantic level
  level: HeadingLevel
  // Visual level
  appearance?: HeadingLevel
  id?: string
  children: ReactNode
}

/**
 * Heading
 * @param {HeadingProps} props - Heading props
 * @return {JSX.Element} - Rendered heading
 */

export const Heading = ({ level, appearance, id, children, className }: HeadingProps) => {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4'

  return (
    <Tag id={id} className={cn(HEADING_STYLES[appearance ?? level], className)}>
      {children}
    </Tag>
  )
}
