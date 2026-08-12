import 'server-only'

import { Service } from '@/structures/Service'
import { HttpStatuses } from '@/structures/constants'
import type { RequestResult } from '@/types/api'
import type { FormValues } from '@/types/form'
import { HttpService } from '@/services/HttpService'

// Provider endpoint
const PROVIDER_ENDPOINT = 'https://api.resend.com/emails'

export interface MailPayload {
  subject: string
  // HTML content
  html: string
  replyTo?: string
}

class MailServiceClass extends Service {
  successStatus = HttpStatuses.Ok

  /**
   * Configured flag
   * @return {boolean} - Configured
   */

  isConfigured = (): boolean => this.config.environment.mail.apiKey.length > 0

  /**
   * Send mail
   * @param {MailPayload} payload - Mail payload
   * @return {Promise<RequestResult<{ id: string }>>} - Result
   */

  send = async (payload: MailPayload): Promise<RequestResult<{ id: string }>> => {
    if (!this.isConfigured()) {
      this.logger.info('dryRun', payload)

      return { success: true, data: { id: 'dry-run' } }
    }

    return HttpService.post<{ id: string }>(
      PROVIDER_ENDPOINT,
      {
        from: this.config.environment.mail.from,
        to: this.config.environment.mail.to,
        subject: payload.subject,
        html: payload.html,
        reply_to: payload.replyTo,
      },
      { headers: { Authorization: `Bearer ${this.config.environment.mail.apiKey}` } }
    )
  }

  /**
   * Form payload
   * @param {string} formId - Form ID
   * @param {FormValues} values - Values
   * @return {MailPayload} - Payload
   */

  buildFormPayload = (formId: string, values: FormValues): MailPayload => {
    const rows = Object.entries(values)
      .map(
        ([name, value]) =>
          `<tr><td><strong>${name}</strong></td><td>${String(value ?? '')}</td></tr>`
      )
      .join('')

    return {
      subject: `[${this.config.site.shortName}] ${formId}`,
      html: `<table>${rows}</table>`,
      replyTo: typeof values.email === 'string' ? values.email : undefined,
    }
  }
}

// Transactional mail
export const MailService = new MailServiceClass('mail')
