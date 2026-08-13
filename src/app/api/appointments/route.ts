import type { NextResponse } from 'next/server'

import { AppointmentService } from '@/services/AppointmentService'
import { CalendarService } from '@/services/CalendarService'
import { ConfigurationService } from '@/services/ConfigurationService'
import { FormService } from '@/services/FormService'
import { MailService } from '@/services/MailService'
import { Route } from '@/structures/Route'
import { HttpStatuses } from '@/structures/constants'
import type { AppointmentRequest } from '@/types/booking'
import type { FormValues } from '@/types/form'
import { MINUTE_IN_MS, parseISODate } from '@/utils/format/date'

// Booked form
const FORM_ID = 'bookAppointment'

const DAY_START = '00:00'

const { timeZone } = ConfigurationService.localization
const { durationMinutes } = ConfigurationService.booking

const nextDayOf = (date: string): string => {
  const parsed = parseISODate(date)
  if (!parsed) return date

  parsed.setUTCDate(parsed.getUTCDate() + 1)

  return parsed.toISOString().slice(0, 10)
}

// Free slots of a day, calendar included
const freeSlotsOf = async (date: string): Promise<string[]> => {
  const busy = await CalendarService.busyRangesOf(
    AppointmentService.instantOf(date, DAY_START).toISOString(),
    AppointmentService.instantOf(nextDayOf(date), DAY_START).toISOString()
  )

  return AppointmentService.freeSlotsOf(date, busy)
}

class AppointmentRoute extends Route {
  /**
   * Free slots of one day
   * @param {Request} request - Incoming request
   * @return {Promise<NextResponse>} - Availability
   */

  async availability(request: Request): Promise<NextResponse> {
    const date = new URL(request.url).searchParams.get('date') ?? ''

    if (!parseISODate(date)) return this.fail(HttpStatuses.BadRequest)
    if (!AppointmentService.isBookable(date)) return this.respond({ date, slots: [] })

    return this.respond({ date, slots: await freeSlotsOf(date) })
  }

  /**
   * Book a slot
   * @param {Request} request - Incoming request
   * @return {Promise<NextResponse>} - Confirmation
   */

  async handle(request: Request): Promise<NextResponse> {
    const { date, slot, values } = (await request.json()) as AppointmentRequest

    // Shape first, availability second
    if (!parseISODate(date) || !AppointmentService.isBookable(date)) {
      return this.fail(HttpStatuses.BadRequest)
    }

    if (!values || !FormService.isPayloadValid(FORM_ID, values)) {
      return this.fail(HttpStatuses.Unprocessable)
    }

    const free = await freeSlotsOf(date)
    if (!free.includes(slot)) return this.fail(HttpStatuses.Conflict)

    const startsAt = AppointmentService.instantOf(date, slot)
    const endsAt = new Date(startsAt.getTime() + durationMinutes * MINUTE_IN_MS)
    const isSynchronised = await CalendarService.createEvent({
      summary: `${ConfigurationService.site.shortName} · ${String(values.fullName ?? '')}`,
      description: this.describe({ ...values, date, slot }),
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      timeZone,
    })

    const mail = await MailService.send(
      MailService.buildFormPayload(FORM_ID, { ...values, date, slot })
    )

    if (!mail.success) {
      this.logger.error('appointments.book', { date, slot, error: mail.error })

      return this.fail(HttpStatuses.ServerError, mail.error.translationKey)
    }

    return this.respond({ date, slot, isSynchronised })
  }

  /**
   * Calendar event body
   * @param {FormValues} values - Submitted values
   * @return {string} - One field per line
   */

  private describe(values: FormValues): string {
    return Object.entries(values)
      .map(([name, value]) => `${name}: ${String(value ?? '')}`)
      .join('\n')
  }
}

const route = new AppointmentRoute()

/**
 * Read availability
 * @param {Request} request - Incoming request
 * @return {Promise<NextResponse>} - Free slots
 */

export async function GET(request: Request): Promise<NextResponse> {
  return route.availability(request)
}

/**
 * Book a slot
 * @param {Request} request - Incoming request
 * @return {Promise<NextResponse>} - Confirmation
 */

export async function POST(request: Request): Promise<NextResponse> {
  return route.handle(request)
}
