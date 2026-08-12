import { FORMS } from '@/declarations/forms'
import type { FormId } from '@/declarations/forms'
import { HttpService } from '@/services/HttpService'
import { ValidationService } from '@/services/ValidationService'
import { FormStatuses } from '@/structures/constants'
import { Service } from '@/structures/Service'
import type { FieldValue, FormDeclaration, FormState, FormValues } from '@/types/form'

// Form submission endpoint
const SUBMIT_ENDPOINT = '/api/forms'

class FormServiceClass extends Service {
  forms = FORMS

  /**
   * Read a form declaration
   * @param {FormId} id - Form declared in declarations/forms.ts
   * @return {FormDeclaration} - Fields and submit action
   */

  declarationOf = (id: FormId): FormDeclaration => FORMS[id]

  /**
   * Initial form state
   * @param {FormDeclaration} form - Form declaration
   * @return {FormState} - Initial state
   */

  buildInitialState = (form: FormDeclaration): FormState => ({
    values: ValidationService.buildInitialValues(form),
    errors: {},
    status: FormStatuses.Idle,
  })

  /**
   * Set field value
   * @param {FormState} state - Current state
   * @param {string} name - Field name
   * @param {FieldValue} value - New value
   * @return {FormState} - Updated state
   */

  setValue = (state: FormState, name: string, value: FieldValue): FormState => {
    const { [name]: _cleared, ...errors } = state.errors

    return { values: { ...state.values, [name]: value }, errors, status: FormStatuses.Idle }
  }

  /**
   * Validate field on blur
   * @param {FormState} state - Current state
   * @param {FormDeclaration} form - Form declaration
   * @param {string} name - Field name
   * @return {FormState} - Updated state
   */

  touchField = (state: FormState, form: FormDeclaration, name: string): FormState => {
    const field = form.fields.find((candidate) => candidate.name === name)
    if (!field) return state

    const error = ValidationService.validateField(field, state.values[name] ?? null)
    const { [name]: _cleared, ...errors } = state.errors

    return { ...state, errors: error ? { ...errors, [name]: error } : errors }
  }

  /**
   * Submit form
   * @param {FormState} state - Current state
   * @param {FormDeclaration} form - Form declaration
   * @return {Promise<FormState>} - Result state
   */

  submit = async (state: FormState, form: FormDeclaration): Promise<FormState> => {
    const errors = ValidationService.validateForm(form, state.values)
    if (Object.keys(errors).length > 0) return { ...state, errors, status: FormStatuses.Failed }

    const result = await HttpService.post<{ received: boolean }>(
      `${SUBMIT_ENDPOINT}/${form.id}`,
      state.values
    )

    if (!result.success) return { ...state, status: FormStatuses.Failed }

    return { ...this.buildInitialState(form), status: FormStatuses.Succeeded }
  }

  /**
   * Validate payload
   * @param {FormId} id - Form ID
   * @param {FormValues} values - Values
   * @return {boolean} - Valid flag
   */

  isPayloadValid = (id: FormId, values: FormValues): boolean =>
    Object.keys(ValidationService.validateForm(FORMS[id], values)).length === 0
}

// Form state machine
export const FormService = new FormServiceClass('form')
