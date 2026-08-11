import type { ReactNode } from 'react'

import { EMPTY_STATE_FIGURES } from '@/components/elements/feedback/EmptyStateFigure'
import type { EmptyStateFigureName } from '@/components/elements/feedback/EmptyStateFigure'
import { Icon } from '@/components/elements/media/Icon'
import { Text } from '@/components/elements/typography/Text'
import type { IconName } from '@/declarations/ui/icons'
import { EMPTY_STATE_STYLES } from '@/declarations/ui/variants'
import type { EmptyStateVariant } from '@/declarations/ui/variants'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface EmptyStateProps extends Styleable {
  // Empty state variants
  variant?: EmptyStateVariant
  figure?: EmptyStateFigureName
  icon?: IconName
  title: string
  description?: string
  action?: ReactNode
}

const VARIANT_ICONS: Record<EmptyStateVariant, IconName> = { start: 'inbox', filter: 'searchEmpty' }

/**
 * Empty state
 * @param {EmptyStateProps} props - Empty state props
 * @return {JSX.Element} - Rendered empty state
 */

export const EmptyState = ({
  variant = 'start',
  figure,
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  const styles = EMPTY_STATE_STYLES[variant]
  const Figure = figure ? EMPTY_STATE_FIGURES[figure] : null

  return (
    <div className={cn(EMPTY_STATE_STYLES.frame, styles.frame, className)}>
      {Figure ? (
        <Figure className={styles.figure} />
      ) : (
        <span className={styles.iconTile}>
          <Icon name={icon ?? VARIANT_ICONS[variant]} className={styles.icon} />
        </span>
      )}
      <Text appearance="blockTitle" as="p">
        {title}
      </Text>
      {description && (
        <Text appearance="description" className="max-w-sm">
          {description}
        </Text>
      )}
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}
