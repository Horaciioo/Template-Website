import type { ReactNode } from 'react'

import { Heading } from '@/components/elements/typography/Heading'
import { Text } from '@/components/elements/typography/Text'
import { Container } from '@/components/structures/layout/Container'
import { SECTION_SPACING } from '@/declarations/ui/tokens'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface PageHeaderProps extends Styleable {
  title: string
  description?: string
  breadcrumb?: ReactNode
  actions?: ReactNode
}

/**
 * Page header
 * @param {PageHeaderProps} props - Page header props
 * @return {JSX.Element} - Rendered page header
 */

export const PageHeader = ({
  title,
  description,
  breadcrumb,
  actions,
  className,
}: PageHeaderProps) => (
  <div className={cn('border-b border-border bg-surface', SECTION_SPACING.sm, className)}>
    <Container>
      <div className="flex flex-col gap-3">
        {breadcrumb}
        <Heading level={1}>{title}</Heading>
        {description && <Text appearance="lead">{description}</Text>}
        {actions && <div className="flex flex-wrap gap-3 pt-2">{actions}</div>}
      </div>
    </Container>
  </div>
)
