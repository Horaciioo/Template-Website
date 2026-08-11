import Image from 'next/image'

import { AVATAR_PIXELS, AVATAR_SIZES, AVATAR_STYLES } from '@/declarations/ui/variants'
import type { Size, Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'
import { initials } from '@/utils/format/strings'

export interface AvatarProps extends Styleable {
  // Displayed name
  name: string
  src?: string | null
  size?: Size
}

/**
 * Avatar
 * @param {AvatarProps} props - Avatar props
 * @return {JSX.Element} - Rendered avatar
 */

export const Avatar = ({ name, src, size = 'md', className }: AvatarProps) => (
  <span className={cn(AVATAR_STYLES.frame, AVATAR_SIZES[size], className)}>
    {src ? (
      <Image
        src={src}
        alt={name}
        width={AVATAR_PIXELS[size]}
        height={AVATAR_PIXELS[size]}
        className={AVATAR_STYLES.image}
      />
    ) : (
      initials(name)
    )}
  </span>
)
