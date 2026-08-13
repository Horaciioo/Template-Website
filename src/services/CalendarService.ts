import 'server-only'

import { createSign } from 'node:crypto'

import { HTTP_METHODS } from '@/declarations/http'
import { HttpService } from '@/services/HttpService'
import { Service } from '@/structures/Service'
import type { BusyRange } from '@/types/booking'

// Google endpoints
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
const CALENDAR_ENDPOINT = 'https://www.googleapis.com/calendar/v3'
const SCOPE = 'https://www.googleapis.com/auth/calendar'
const GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:jwt-bearer'

const TOKEN_LIFETIME_SECONDS = 3600
const TOKEN_MARGIN_MS = 60_000
const MILLISECONDS_IN_SECOND = 1000

export interface CalendarEvent {
  summary: string
  description: string
  // ISO start instant
  startsAt: string
  endsAt: string
  timeZone: string
}

interface TokenResponse {
  access_token: string
  expires_in: number
}

interface FreeBusyResponse {
  calendars?: Record<string, { busy?: BusyRange[] }>
}

const encode = (value: object): string => Buffer.from(JSON.stringify(value)).toString('base64url')

// Cached across requests, a token outlives a single booking
let cachedToken: { value: string; expiresAt: number } | null = null

class CalendarServiceClass extends Service {
  /**
   * Configured flag
   * @return {boolean} - Every credential present
   */

  isConfigured = (): boolean => {
    const { calendarId, clientEmail, privateKey } = this.config.environment.calendar

    return calendarId.length > 0 && clientEmail.length > 0 && privateKey.length > 0
  }

  /**
   * Signed service account assertion
   * @return {string} - JWT
   */

  private buildAssertion = (): string => {
    const { clientEmail, privateKey } = this.config.environment.calendar
    const issuedAt = Math.floor(Date.now() / MILLISECONDS_IN_SECOND)
    const input = [
      encode({ alg: 'RS256', typ: 'JWT' }),
      encode({
        iss: clientEmail,
        scope: SCOPE,
        aud: TOKEN_ENDPOINT,
        iat: issuedAt,
        exp: issuedAt + TOKEN_LIFETIME_SECONDS,
      }),
    ].join('.')

    const signature = createSign('RSA-SHA256').update(input).sign(privateKey, 'base64url')

    return `${input}.${signature}`
  }

  /**
   * Access token, cached until it expires
   * @return {Promise<string | null>} - Token
   */

  private accessToken = async (): Promise<string | null> => {
    if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value

    const result = await HttpService.request<TokenResponse>(TOKEN_ENDPOINT, {
      method: HTTP_METHODS.post,
      form: { grant_type: GRANT_TYPE, assertion: this.buildAssertion() },
    })

    if (!result.success) {
      this.logger.error('accessToken', result.error)

      return null
    }

    cachedToken = {
      value: result.data.access_token,
      expiresAt: Date.now() + result.data.expires_in * MILLISECONDS_IN_SECOND - TOKEN_MARGIN_MS,
    }

    return cachedToken.value
  }

  /**
   * Occupied ranges of a period
   * @param {string} from - ISO start instant
   * @param {string} to - ISO end instant
   * @return {Promise<BusyRange[]>} - Busy ranges, empty when unconfigured
   */

  busyRangesOf = async (from: string, to: string): Promise<BusyRange[]> => {
    if (!this.isConfigured()) return []

    const token = await this.accessToken()
    if (!token) return []

    const { calendarId } = this.config.environment.calendar
    const result = await HttpService.post<FreeBusyResponse>(
      `${CALENDAR_ENDPOINT}/freeBusy`,
      { timeMin: from, timeMax: to, items: [{ id: calendarId }] },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (!result.success) {
      this.logger.error('busyRangesOf', result.error)

      return []
    }

    return result.data.calendars?.[calendarId]?.busy ?? []
  }

  /**
   * Write an appointment in the calendar
   * @param {CalendarEvent} event - Appointment
   * @return {Promise<boolean>} - Written flag, false in dry run
   */

  createEvent = async (event: CalendarEvent): Promise<boolean> => {
    if (!this.isConfigured()) {
      this.logger.info('dryRun', event)

      return false
    }

    const token = await this.accessToken()
    if (!token) return false

    const { calendarId } = this.config.environment.calendar
    const result = await HttpService.post<{ id: string }>(
      `${CALENDAR_ENDPOINT}/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        summary: event.summary,
        description: event.description,
        start: { dateTime: event.startsAt, timeZone: event.timeZone },
        end: { dateTime: event.endsAt, timeZone: event.timeZone },
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (!result.success) {
      this.logger.error('createEvent', result.error)

      return false
    }

    return true
  }
}

// Google Calendar synchronisation
export const CalendarService = new CalendarServiceClass('calendar')
