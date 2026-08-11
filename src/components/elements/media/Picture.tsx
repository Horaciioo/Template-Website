import Image from 'next/image'

import { ConfigurationService } from '@/services/ConfigurationService'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

// Predefined aspect ratios
export const ASPECT_RATIOS = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-video',
  banner: 'aspect-[21/9]',
} as const

export type AspectRatio = keyof typeof ASPECT_RATIOS

const { md } = ConfigurationService.viewport.breakpoints

export interface PictureProps extends Styleable {
  src: string
  // Alternative text
  alt: string
  ratio?: AspectRatio
  priority?: boolean
  // Image widths
  sizes?: string
}

/**
 * Responsive picture
 * @param {PictureProps} props - Picture props
 * @return {JSX.Element} - Rendered picture
 */

export const Picture = ({
  src,
  alt,
  ratio = 'landscape',
  priority = false,
  sizes = `(max-width: ${md}px) 100vw, 33vw`,
  className,
}: PictureProps) => (
  <div
    className={cn(
      'relative w-full overflow-hidden bg-surface-strong',
      ASPECT_RATIOS[ratio],
      className
    )}>
    <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
  </div>
)
