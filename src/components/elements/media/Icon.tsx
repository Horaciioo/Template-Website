import { ICONS, ICON_SIZES } from '@/declarations/ui/icons'
import type { IconName, IconSize } from '@/declarations/ui/icons'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface IconProps extends Styleable {
  name: IconName
  size?: IconSize
  // Accessible label
  label?: string
}

/**
 * Icon
 * @param {IconProps} props - Icon props
 * @return {JSX.Element} - Rendered glyph
 */

export const Icon = ({ name, size = 'md', label, className }: IconProps) => {
  const Glyph = ICONS[name]

  return (
    <Glyph
      className={cn(ICON_SIZES[size], 'shrink-0', className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    />
  )
}
