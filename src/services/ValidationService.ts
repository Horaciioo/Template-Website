import { PATTERNS, VALIDATION_RULES } from '@/declarations/validation'
import type { PatternName } from '@/declarations/validation'
import type {
  FieldDeclaration,
  FieldError,
  FieldValue,
  FormDeclaration,
  FormErrors,
  FormValues,
} from '@/types/form'

const asText = (value: FieldValue): string => (typeof value === 'string' ? value.trim() : '')

const isEmpty = (value: FieldValue): boolean =>
  value === null || value === undefined || value === '' || value === false

// Validation engine
export const ValidationService = {
  /**
   * Validate one field against its own declaration
   * @param {FieldDeclaration} field - Field declared in declarations/forms.ts
   * @param {FieldValue} value - Current value
   * @return {FieldError | null} - Violated rule and its parameters, null when valid
   */

  validateField: (field: FieldDeclaration, value: FieldValue): FieldError | null => {
    if (field.required && isEmpty(value)) return { rule: VALIDATION_RULES.required }
    if (isEmpty(value)) return null

    const text = asText(value)

    if (field.minLength !== undefined && text.length < field.minLength) {
      return { rule: VALIDATION_RULES.minLength, params: { count: field.minLength } }
    }

    if (field.maxLength !== undefined && text.length > field.maxLength) {
      return { rule: VALIDATION_RULES.maxLength, params: { count: field.maxLength } }
    }

    if (typeof value === 'number') {
      if (field.min !== undefined && value < field.min) {
        return { rule: VALIDATION_RULES.min, params: { count: field.min } }
      }

      if (field.max !== undefined && value > field.max) {
        return { rule: VALIDATION_RULES.max, params: { count: field.max } }
      }
    }

    if (field.pattern && !PATTERNS[field.pattern as PatternName].test(text)) {
      return { rule: VALIDATION_RULES.pattern }
    }

    return null
  },

  /**
   * Validate every field of a form
   * @param {FormDeclaration} form - Form declared in declarations/forms.ts
   * @param {FormValues} values - Current values
   * @return {FormErrors} - Violated rules, keyed by field name, empty when the form is valid
   */

  validateForm: (form: FormDeclaration, values: FormValues): FormErrors =>
    form.fields.reduce<FormErrors>((errors, field) => {
      const error = ValidationService.validateField(field, values[field.name] ?? null)
      if (error) errors[field.name] = error

      return errors
    }, {}),

  /**
   * Build the value a form starts with, honouring the declared defaults
   * @param {FormDeclaration} form - Form declared in declarations/forms.ts
   * @return {FormValues} - Initial values
   */

  buildInitialValues: (form: FormDeclaration): FormValues =>
    form.fields.reduce<FormValues>((values, field) => {
      values[field.name] =
        field.defaultValue ?? (field.type === 'checkbox' || field.type === 'switch' ? false : '')

      return values
    }, {}),
} as const
