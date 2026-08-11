import { FORMS } from '@/declarations/forms'
import type { FormId } from '@/declarations/forms'
import { HttpService } from '@/services/HttpService'
import { ValidationService } from '@/services/ValidationService'
import type { FieldValue, FormDeclaration, FormState, FormValues } from '@/types/form'

// Form submission endpoint
const SUBMIT_ENDPOINT = '/api/forms'

/**
 * Form state machine
 */

export const FormService = {
  forms: FORMS,

  /**
   * Read a form declaration
   * @param {FormId} id - Form declared in declarations/forms.ts
   * @return {FormDeclaration} - Fields and submit action
   */

  declarationOf: (id: FormId): FormDeclaration => FORMS[id],

  /**
   * Build the state a form starts and resets to
   * @param {FormDeclaration} form - Form declared in declarations/forms.ts
   * @return {FormState} - Initial values, no error, idle status
   */

  buildInitialState: (form: FormDeclaration): FormState => ({
    values: ValidationService.buildInitialValues(form),
    errors: {},
    status: 'idle',
  }),

  /**
   * Apply a typed value and clear the error the field was carrying
   * @param {FormState} state - Current state
   * @param {string} name - Field name
   * @param {FieldValue} value - New value
   * @return {FormState} - Next state
   */

  setValue: (state: FormState, name: string, value: FieldValue): FormState => {
    const { [name]: _cleared, ...errors } = state.errors

    return { values: { ...state.values, [name]: value }, errors, status: 'idle' }
  },

  /**
   * Validate field on blur
   * @param {FormState} state - Current state
   * @param {FormDeclaration} form - Form declaration
   * @param {string} name - Field name
   * @return {FormState} - Updated state
   */

  touchField: (state: FormState, form: FormDeclaration, name: string): FormState => {
    const field = form.fields.find((candidate) => candidate.name === name)
    if (!field) return state

    const error = ValidationService.validateField(field, state.values[name] ?? null)
    const { [name]: _cleared, ...errors } = state.errors

    return { ...state, errors: error ? { ...errors, [name]: error } : errors }
  },

  /**
   * Validate then post a form, the caller only decides what to do with the resulting status
   * @param {FormState} state - Current state
   * @param {FormDeclaration} form - Form declared in declarations/forms.ts
   * @return {Promise<FormState>} - Next state, carrying the errors or the final status
   */

  submit: async (state: FormState, form: FormDeclaration): Promise<FormState> => {
    const errors = ValidationService.validateForm(form, state.values)
    if (Object.keys(errors).length > 0) return { ...state, errors, status: 'failed' }

    const result = await HttpService.post<{ received: boolean }>(
      `${SUBMIT_ENDPOINT}/${form.id}`,
      state.values
    )

    if (!result.success) return { ...state, status: 'failed' }

    return { ...FormService.buildInitialState(form), status: 'succeeded' }
  },

  /**
   * Validate a payload received by the API route, the same rules running on both sides
   * @param {FormId} id - Form declared in declarations/forms.ts
   * @param {FormValues} values - Received values
   * @return {boolean} - Valid flag
   */

  isPayloadValid: (id: FormId, values: FormValues): boolean =>
    Object.keys(ValidationService.validateForm(FORMS[id], values)).length === 0,
} as const
