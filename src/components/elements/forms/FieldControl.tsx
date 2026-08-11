import { Icon } from '@/components/elements/media/Icon'
import { FIELD_INPUT_TYPES, FIELD_TYPES } from '@/declarations/forms'
import { FIELD_STYLES } from '@/declarations/ui/variants'
import type { FieldDeclaration, FieldValue } from '@/types/form'
import { cn } from '@/utils/classnames'

export interface FieldControlProps {
  id: string
  field: FieldDeclaration
  value: FieldValue
  // Placeholder text
  placeholder?: string
  optionLabels?: Record<string, string>
  choiceLabel?: string
  invalid?: boolean
  onChange: (value: FieldValue) => void
  onBlur?: () => void
}

/**
 * Field control
 * @param {FieldControlProps} props - Field control props
 * @return {JSX.Element} - Control element
 */

export const FieldControl = ({
  id,
  field,
  value,
  placeholder,
  optionLabels,
  choiceLabel,
  invalid = false,
  onChange,
  onBlur,
}: FieldControlProps) => {
  const element = FIELD_TYPES[field.type]
  const shared = {
    id,
    name: field.name,
    onBlur,
    'aria-invalid': invalid || undefined,
    'aria-describedby': invalid ? `${id}-error` : undefined,
    className: cn(FIELD_STYLES.control, invalid && FIELD_STYLES.invalid),
  }

  if (element === 'textarea') {
    return (
      <textarea
        {...shared}
        value={String(value ?? '')}
        placeholder={placeholder}
        maxLength={field.maxLength}
        required={field.required}
        className={cn(shared.className, FIELD_STYLES.textarea)}
        onChange={(event) => onChange(event.target.value)}
      />
    )
  }

  if (element === 'select') {
    return (
      <select
        {...shared}
        value={String(value ?? '')}
        required={field.required}
        className={cn(shared.className, FIELD_STYLES.controlHeight)}
        onChange={(event) => onChange(event.target.value)}>
        <option value="">{placeholder ?? ''}</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {optionLabels?.[option.value] ?? option.value}
          </option>
        ))}
      </select>
    )
  }

  if (element === 'checkbox' || element === 'radio') {
    return (
      <label className={FIELD_STYLES.choice}>
        <input
          id={id}
          name={field.name}
          type={element}
          checked={Boolean(value)}
          required={field.required}
          onBlur={onBlur}
          className={FIELD_STYLES.checkbox}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span>{choiceLabel}</span>
      </label>
    )
  }

  if (element === 'switch') {
    const checked = Boolean(value)

    return (
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={choiceLabel}
        data-checked={checked}
        onBlur={onBlur}
        className={FIELD_STYLES.switchTrack}
        onClick={() => onChange(!checked)}>
        <span data-checked={checked} className={FIELD_STYLES.switchThumb} />
      </button>
    )
  }

  return (
    <div className="relative">
      {field.icon && <Icon name={field.icon} size="sm" className={FIELD_STYLES.icon} />}
      <input
        {...shared}
        type={FIELD_INPUT_TYPES[field.type] ?? 'text'}
        value={String(value ?? '')}
        placeholder={placeholder}
        maxLength={field.maxLength}
        min={field.min}
        max={field.max}
        required={field.required}
        autoComplete={field.autoComplete}
        className={cn(
          shared.className,
          FIELD_STYLES.controlHeight,
          field.icon && FIELD_STYLES.controlWithIcon
        )}
        onChange={(event) =>
          onChange(field.type === 'number' ? event.target.valueAsNumber : event.target.value)
        }
      />
    </div>
  )
}
