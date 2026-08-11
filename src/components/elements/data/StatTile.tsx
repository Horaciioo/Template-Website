import { Icon } from '@/components/elements/media/Icon'
import { Text } from '@/components/elements/typography/Text'
import type { IconName } from '@/declarations/ui/icons'
import { TONE_SOFT } from '@/declarations/ui/tokens'
import { STAT_STYLES } from '@/declarations/ui/variants'
import type { Styleable, Tone } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface StatTileProps extends Styleable {
  label: string
  // Value display
  value: string
  description?: string
  icon?: IconName
  tone?: Tone
}

/**
 * Stat tile
 * @param {StatTileProps} props - Stat tile props
 * @return {JSX.Element} - Rendered tile
 */

export const StatTile = ({
  label,
  value,
  description,
  icon,
  tone = 'primary',
  className,
}: StatTileProps) => (
  <div className={cn(STAT_STYLES.frame, className)}>
    {icon && (
      <span className={cn(STAT_STYLES.iconTile, TONE_SOFT[tone])}>
        <Icon name={icon} size="sm" />
      </span>
    )}
    <p className={STAT_STYLES.value}>{value}</p>
    <Text appearance="label">{label}</Text>
    {description && <Text appearance="meta">{description}</Text>}
  </div>
)
