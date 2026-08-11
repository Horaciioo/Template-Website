import { NextResponse } from 'next/server'

import { FORMS } from '@/declarations/forms'
import type { FormId } from '@/declarations/forms'
import { HTTP_ERROR_KEYS, HTTP_STATUS } from '@/declarations/http'
import { FormService } from '@/services/FormService'
import { LoggerService } from '@/services/LoggerService'
import { MailService } from '@/services/MailService'
import type { FormValues } from '@/types/form'

export interface FormRouteContext {
  params: Promise<{ formId: string }>
}

const isDeclared = (id: string): id is FormId => id in FORMS

/**
 * Single endpoint
 * @param {Request} request - Incoming request
 * @param {FormRouteContext} context - Route parameters
 * @return {Promise<NextResponse>} - Translation results
 */

export async function POST(request: Request, { params }: FormRouteContext): Promise<NextResponse> {
  const { formId } = await params

  if (!isDeclared(formId)) {
    return NextResponse.json(
      { error: HTTP_ERROR_KEYS[HTTP_STATUS.notFound] },
      { status: HTTP_STATUS.notFound }
    )
  }

  const values = (await request.json()) as FormValues

  if (!FormService.isPayloadValid(formId, values)) {
    return NextResponse.json(
      { error: HTTP_ERROR_KEYS[HTTP_STATUS.unprocessable] },
      { status: HTTP_STATUS.unprocessable }
    )
  }

  const result = await MailService.send(MailService.buildFormPayload(formId, values))

  if (!result.success) {
    LoggerService.error('forms.submit', { formId, error: result.error })

    return NextResponse.json(
      { error: result.error.translationKey },
      { status: HTTP_STATUS.serverError }
    )
  }

  return NextResponse.json({ received: true }, { status: HTTP_STATUS.ok })
}
