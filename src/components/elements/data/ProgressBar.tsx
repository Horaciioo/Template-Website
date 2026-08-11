import { TONE_SOLID } from '@/declarations/ui/tokens'
import { PROGRESS_STYLES } from '@/declarations/ui/variants'
import type { Styleable, Tone } from '@/types/common'
import { cn } from '@/utils/classnames'
import { clamp } from '@/utils/format/number'

export interface ProgressBarProps extends Styleable {
  // Ratio of the bar
  value: number
  tone?: Tone
  label: string
}

/**
 * Progress bar
 * @param {ProgressBarProps} props - Progress bar props
 * @return {JSX.Element} - Rendered bar
 */

export const ProgressBar = ({ value, tone = 'primary', label, className }: ProgressBarProps) => {
  const ratio = clamp(value, 0, 1)

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(ratio * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(PROGRESS_STYLES.track, className)}>
      <div
        className={cn(PROGRESS_STYLES.bar, TONE_SOLID[tone])}
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  )
}
