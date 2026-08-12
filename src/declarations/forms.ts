import { ConfigurationService } from '@/services/ConfigurationService'
import type { FormDeclaration } from '@/types/form'

const { limits: LIMITS } = ConfigurationService.validation

/**
 * Field element types
 * @type {Object}
 */

export const FIELD_TYPES = {
  text: 'input',
  email: 'input',
  phone: 'input',
  url: 'input',
  number: 'input',
  password: 'input',
  textarea: 'textarea',
  select: 'select',
  checkbox: 'checkbox',
  radio: 'radio',
  switch: 'switch',
} as const

/**
 * Native input types
 * @type {Partial<Record<keyof typeof FIELD_TYPES, string>>}
 */

export const FIELD_INPUT_TYPES: Partial<Record<keyof typeof FIELD_TYPES, string>> = {
  text: 'text',
  email: 'email',
  phone: 'tel',
  url: 'url',
  number: 'number',
  password: 'password',
}

/**
 * Form declarations
 * @type {Object}
 */

export const FORMS = {
  contact: {
    id: 'contact',
    submitAction: 'contact',
    redirectRouteId: 'thankYou',
    fields: [
      {
        name: 'fullName',
        type: 'text',
        required: true,
        minLength: LIMITS.name.min,
        maxLength: LIMITS.name.max,
        icon: 'user',
        autoComplete: 'name',
      },
      {
        name: 'email',
        type: 'email',
        required: true,
        pattern: 'email',
        maxLength: LIMITS.email.max,
        icon: 'mail',
        autoComplete: 'email',
      },
      {
        name: 'phone',
        type: 'phone',
        pattern: 'phone',
        maxLength: LIMITS.phone.max,
        icon: 'phone',
        autoComplete: 'tel',
      },
      {
        name: 'subject',
        type: 'select',
        required: true,
        icon: 'tag',
        options: [
          { value: 'information', translationKey: 'information' },
          { value: 'quote', translationKey: 'quote' },
          { value: 'partnership', translationKey: 'partnership' },
          { value: 'other', translationKey: 'other' },
        ],
      },
      {
        name: 'message',
        type: 'textarea',
        required: true,
        minLength: LIMITS.message.min,
        maxLength: LIMITS.message.max,
        wide: true,
      },
      {
        name: 'consent',
        type: 'checkbox',
        required: true,
        wide: true,
      },
    ],
  },
  newsletter: {
    id: 'newsletter',
    submitAction: 'subscribeNewsletter',
    fields: [
      {
        name: 'email',
        type: 'email',
        required: true,
        pattern: 'email',
        maxLength: LIMITS.email.max,
        icon: 'mail',
        autoComplete: 'email',
        wide: true,
      },
    ],
  },
} as const satisfies Record<string, FormDeclaration>

/**
 * Form identifier
 * @typedef {keyof typeof FORMS} FormId
 */

export type FormId = keyof typeof FORMS
