import type { FIELD_TYPES } from '@/declarations/forms'
import type { ActionName } from '@/declarations/naming'
import type { IconName } from '@/declarations/ui/icons'
import type { FormStatuses } from '@/structures/constants'
import type { Dictionary, RegistryKey, TranslationKey } from '@/types/common'
import type { RouteId } from '@/types/navigation'

/**
 * Form field type
 * @typedef {RegistryKey<typeof FIELD_TYPES>} FieldType
 */

export type FieldType = RegistryKey<typeof FIELD_TYPES>

/**
 * Form field value
 * @typedef {string | number | boolean | null} FieldValue
 */

export type FieldValue = string | number | boolean | null

/**
 * Field select option
 * @typedef FieldOption
 * @property {string} value - Option value
 * @property {TranslationKey} translationKey - Label key
 */

export interface FieldOption {
  value: string
  translationKey: TranslationKey
}

/**
 * Form field declaration
 * @typedef FieldDeclaration
 * @property {string} name - Field translation key
 * @property {FieldType} type - Input type
 * @property {boolean} [required] - Required flag
 * @property {number} [minLength] - Min text length
 * @property {number} [maxLength] - Max text length
 * @property {number} [min] - Min value
 * @property {number} [max] - Max value
 * @property {string} [pattern] - Validation pattern
 * @property {FieldOption[]} [options] - Select options
 * @property {IconName} [icon] - Display icon
 * @property {FieldValue} [defaultValue] - Initial value
 * @property {string} [autoComplete] - Browser autoComplete
 * @property {boolean} [wide] - Full width
 */

export interface FieldDeclaration {
  // Field translation key
  name: string
  type: FieldType
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  // Validation pattern
  pattern?: string
  options?: FieldOption[]
  icon?: IconName
  defaultValue?: FieldValue
  autoComplete?: string
  // Full width
  wide?: boolean
}

/**
 * Form declaration
 * @typedef FormDeclaration
 * @property {string} id - Form translation key
 * @property {FieldDeclaration[]} fields - Form fields
 * @property {ActionName} submitAction - Submit button action
 * @property {RouteId} [redirectRouteId] - Route after success
 */

export interface FormDeclaration {
  // Form translation key
  id: string
  fields: FieldDeclaration[]
  submitAction: ActionName
  // Route after success
  redirectRouteId?: RouteId
}

/**
 * Form values mapping
 * @typedef {Dictionary<FieldValue>} FormValues
 */

export type FormValues = Dictionary<FieldValue>

/**
 * Violated validation rule
 * @typedef FieldError
 * @property {string} rule - Rule name
 * @property {Record<string, string | number>} [params] - Error params
 */

export interface FieldError {
  rule: string
  params?: Record<string, string | number>
}

/**
 * Field validation errors
 * @typedef {Dictionary<FieldError>} FormErrors
 */

export type FormErrors = Dictionary<FieldError>

/**
 * Form submission status
 * @typedef {(typeof FormStatuses)[Exclude<keyof typeof FormStatuses, number>]} FormStatus
 */

export type FormStatus = (typeof FormStatuses)[Exclude<keyof typeof FormStatuses, number>]

/**
 * Form state
 * @typedef FormState
 * @property {FormValues} values - Current values
 * @property {FormErrors} errors - Validation errors
 * @property {FormStatus} status - Submission status
 */

export interface FormState {
  values: FormValues
  errors: FormErrors
  status: FormStatus
}
