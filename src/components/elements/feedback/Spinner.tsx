import { SPINNER_SIZES } from '@/declarations/ui/variants'
import type { Size, Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface SpinnerProps extends Styleable {
  size?: Size
  // Accessible label
  label: string
}

/**
 * Spinner
 * @param {SpinnerProps} props - Spinner props
 * @return {JSX.Element} - Rendered spinner
 */

export const Spinner = ({ size = 'md', label, className }: SpinnerProps) => (
  <span role="status" aria-label={label} className={cn('inline-flex', className)}>
    <span
      className={cn(
        SPINNER_SIZES[size],
        'block animate-spin rounded-pill border-2 border-border border-t-primary'
      )}
    />
  </span>
)
