import type { ReactNode } from 'react'

import { Text } from '@/components/elements/typography/Text'
import { SURFACES } from '@/declarations/ui/tokens'
import { TEXT_STYLES } from '@/declarations/ui/variants'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface ShowcaseBlockProps extends Styleable {
  title: string
  // Component path
  path: string
  description?: string
  children: ReactNode
}

/**
 * Showcase block
 * @param {ShowcaseBlockProps} props - Showcase block props
 * @return {JSX.Element} - Rendered block
 */

export const ShowcaseBlock = ({
  title,
  path,
  description,
  children,
  className,
}: ShowcaseBlockProps) => (
  <section className={cn(SURFACES.card, 'flex flex-col gap-4 p-5', className)}>
    <header className="flex flex-col gap-1">
      <h3 className={TEXT_STYLES.blockTitle}>{title}</h3>
      <code className={TEXT_STYLES.code}>{path}</code>
      {description && <Text appearance="description">{description}</Text>}
    </header>
    <div className="flex flex-wrap items-center gap-3">{children}</div>
  </section>
)
