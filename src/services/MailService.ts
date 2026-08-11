import 'server-only'

import { HTTP_STATUS } from '@/declarations/http'
import { ConfigurationService } from '@/services/ConfigurationService'
import { EnvironmentService } from '@/services/EnvironmentService'
import { HttpService } from '@/services/HttpService'
import { LoggerService } from '@/services/LoggerService'
import type { RequestResult } from '@/types/api'
import type { FormValues } from '@/types/form'

// Provider endpoint
const PROVIDER_ENDPOINT = 'https://api.resend.com/emails'

export interface MailPayload {
  subject: string
  // HTML content
  html: string
  replyTo?: string
}

// Transactional mail
export const MailService = {
  isConfigured: (): boolean => EnvironmentService.mail.apiKey.length > 0,

  /**
   * Send mail
   * @param {MailPayload} payload - Mail payload
   * @return {Promise<RequestResult<{ id: string }>>} - Result
   */

  send: async (payload: MailPayload): Promise<RequestResult<{ id: string }>> => {
    if (!MailService.isConfigured()) {
      LoggerService.info('mail.dryRun', payload)

      return { success: true, data: { id: 'dry-run' } }
    }

    return HttpService.post<{ id: string }>(
      PROVIDER_ENDPOINT,
      {
        from: EnvironmentService.mail.from,
        to: EnvironmentService.mail.to,
        subject: payload.subject,
        html: payload.html,
        reply_to: payload.replyTo,
      },
      { headers: { Authorization: `Bearer ${EnvironmentService.mail.apiKey}` } }
    )
  },

  /**
   * Render the submitted values of a form as the body of a notification mail
   * @param {string} formId - Form declared in declarations/forms.ts
   * @param {FormValues} values - Submitted values
   * @return {MailPayload} - Subject and HTML body
   */

  buildFormPayload: (formId: string, values: FormValues): MailPayload => {
    const rows = Object.entries(values)
      .map(
        ([name, value]) =>
          `<tr><td><strong>${name}</strong></td><td>${String(value ?? '')}</td></tr>`
      )
      .join('')

    return {
      subject: `[${ConfigurationService.site.shortName}] ${formId}`,
      html: `<table>${rows}</table>`,
      replyTo: typeof values.email === 'string' ? values.email : undefined,
    }
  },

  successStatus: HTTP_STATUS.ok,
} as const
