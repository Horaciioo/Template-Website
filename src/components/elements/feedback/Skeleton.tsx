import { SKELETON_BASE, SKELETON_SHAPES } from '@/declarations/ui/variants'
import type { SkeletonShape } from '@/declarations/ui/variants'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface SkeletonProps extends Styleable {
  shape?: SkeletonShape
}

/**
 * Content placeholder
 * @param {SkeletonProps} props - Skeleton props
 * @return {JSX.Element} - Rendered placeholder
 */

export const Skeleton = ({ shape = 'line', className }: SkeletonProps) => (
  <div className={cn(SKELETON_BASE, SKELETON_SHAPES[shape], className)} aria-hidden="true" />
)

export interface SkeletonListProps extends Styleable {
  rows?: number
  shape?: SkeletonShape
}

/**
 * Skeleton list
 * @param {SkeletonListProps} props - List props
 * @return {JSX.Element} - Rendered placeholders
 */

export const SkeletonList = ({ rows = 3, shape = 'row', className }: SkeletonListProps) => (
  <div className="flex flex-col gap-2">
    {Array.from({ length: rows }, (_, index) => (
      <Skeleton key={index} shape={shape} className={className} />
    ))}
  </div>
)
