import type { ReactNode } from 'react'

import { Text } from '@/components/elements/typography/Text'
import { FIELD_STYLES } from '@/declarations/ui/variants'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface FieldProps extends Styleable {
  // DOM identifier
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
}

/**
 * Form field
 * @param {FieldProps} props - Field props
 * @return {JSX.Element} - Rendered field
 */

export const Field = ({
  id,
  label,
  required = false,
  hint,
  error,
  children,
  className,
}: FieldProps) => (
  <div className={cn(FIELD_STYLES.wrapper, className)}>
    <label htmlFor={id} className={FIELD_STYLES.label}>
      {label}
      {required && (
        <span className={FIELD_STYLES.required} aria-hidden="true">
          *
        </span>
      )}
    </label>
    {children}
    {hint && !error && (
      <Text appearance="meta" as="span" className={FIELD_STYLES.hint}>
        {hint}
      </Text>
    )}
    {error && (
      <span id={`${id}-error`} role="alert" className={FIELD_STYLES.error}>
        {error}
      </span>
    )}
  </div>
)
