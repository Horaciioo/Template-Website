import type { ReactNode } from 'react'

import { Picture } from '@/components/elements/media/Picture'
import type { AspectRatio } from '@/components/elements/media/Picture'
import { CARD_STYLES } from '@/declarations/ui/variants'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface CardProps extends Styleable {
  media?: { src: string; alt: string; ratio?: AspectRatio }
  // Interactive hover effect
  interactive?: boolean
  children: ReactNode
}

/**
 * Card
 * @param {CardProps} props - Card props
 * @return {JSX.Element} - Rendered card
 */

export const Card = ({ media, interactive = false, children, className }: CardProps) => (
  <article
    className={cn('group', CARD_STYLES.frame, interactive && CARD_STYLES.interactive, className)}>
    {media && (
      <Picture src={media.src} alt={media.alt} ratio={media.ratio} className={CARD_STYLES.media} />
    )}
    <div className={CARD_STYLES.body}>{children}</div>
  </article>
)
