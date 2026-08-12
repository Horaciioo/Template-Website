import type { NextResponse } from 'next/server'

import { FORMS } from '@/declarations/forms'
import type { FormId } from '@/declarations/forms'
import { FormService } from '@/services/FormService'
import { MailService } from '@/services/MailService'
import { Route } from '@/structures/Route'
import { HttpStatuses } from '@/structures/constants'
import type { FormValues } from '@/types/form'

export interface FormRouteContext {
  params: Promise<{ formId: string }>
}

const isDeclared = (id: string): id is FormId => id in FORMS

class FormRoute extends Route {
  /**
   * Submit a declared form
   * @param {Request} request - Incoming request
   * @param {Record<string, string>} params - Dynamic route params
   * @return {Promise<NextResponse>} - Response
   */

  async handle(request: Request, params: Record<string, string> = {}): Promise<NextResponse> {
    const { formId } = params

    if (!formId || !isDeclared(formId)) return this.fail(HttpStatuses.NotFound)

    const values = (await request.json()) as FormValues

    if (!FormService.isPayloadValid(formId, values)) return this.fail(HttpStatuses.Unprocessable)

    const result = await MailService.send(MailService.buildFormPayload(formId, values))

    if (!result.success) {
      this.logger.error('forms.submit', { formId, error: result.error })

      return this.fail(HttpStatuses.ServerError, result.error.translationKey)
    }

    return this.respond({ received: true })
  }
}

const route = new FormRoute()

/**
 * Single endpoint
 * @param {Request} request - Incoming request
 * @param {FormRouteContext} context - Route parameters
 * @return {Promise<NextResponse>} - Translation results
 */

export async function POST(request: Request, { params }: FormRouteContext): Promise<NextResponse> {
  return route.handle(request, await params)
}
