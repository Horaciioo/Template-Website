import type { ReactNode } from 'react'

import { Heading } from '@/components/elements/typography/Heading'
import { Text } from '@/components/elements/typography/Text'
import { Container } from '@/components/structures/layout/Container'
import { SECTION_ANCHORS } from '@/declarations/routes'
import { SECTION_SPACING } from '@/declarations/ui/tokens'
import type { ContainerWidth } from '@/declarations/ui/tokens'
import { SECTION_STYLES } from '@/declarations/ui/variants'
import type { Size, Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface SectionProps extends Styleable {
  // Section anchor
  anchor?: keyof typeof SECTION_ANCHORS
  overline?: string
  title?: string
  description?: string
  centered?: boolean
  spacing?: Size
  width?: ContainerWidth
  actions?: ReactNode
  children: ReactNode
}

/**
 * Section
 * @param {SectionProps} props - Section props
 * @return {JSX.Element} - Rendered section
 */

export const Section = ({
  anchor,
  overline,
  title,
  description,
  centered = false,
  spacing = 'md',
  width = 'default',
  actions,
  children,
  className,
}: SectionProps) => {
  const hasHeader = Boolean(overline || title || description || actions)

  return (
    <section
      id={anchor ? SECTION_ANCHORS[anchor] : undefined}
      className={cn(SECTION_SPACING[spacing], className)}>
      <Container width={width}>
        {hasHeader && (
          <div className={cn(SECTION_STYLES.header, centered && SECTION_STYLES.headerCentered)}>
            {overline && (
              <Text appearance="overline" as="p">
                {overline}
              </Text>
            )}
            {title && <Heading level={2}>{title}</Heading>}
            {description && <Text appearance="lead">{description}</Text>}
            {actions && <div className="flex flex-wrap gap-3 pt-2">{actions}</div>}
          </div>
        )}
        <div className={cn(hasHeader && SECTION_STYLES.body)}>{children}</div>
      </Container>
    </section>
  )
}
