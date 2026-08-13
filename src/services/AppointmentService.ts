import { HTTP_METHODS } from '@/declarations/http'
import { ConfigurationService } from '@/services/ConfigurationService'
import { HttpService } from '@/services/HttpService'
import { Service } from '@/structures/Service'
import type { RequestResult } from '@/types/api'
import type {
  AppointmentConfirmation,
  AppointmentRequest,
  BusyRange,
  DayAvailability,
  OpeningHours,
  OpeningSchedule,
} from '@/types/booking'
import { MINUTE_IN_MS } from '@/utils/format/date'

// Availability endpoint
const AVAILABILITY_ENDPOINT = '/api/appointments'

const { slotMinutes, durationMinutes, minimumNoticeHours, horizonDays } =
  ConfigurationService.booking
const { timeZone, firstDayOfWeek } = ConfigurationService.localization
const openingHours = ConfigurationService.identity.openingHours as OpeningHours[]

const MINUTES_IN_HOUR = 60
const DAYS_IN_WEEK = 7
const TIME_PAD = 2

// Midday reading avoids every daylight saving edge
const middayOf = (date: string): Date => new Date(`${date}T12:00:00Z`)

const minutesOf = (time: string): number => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number)

  return hours * MINUTES_IN_HOUR + minutes
}

const timeOf = (minutes: number): string =>
  [Math.floor(minutes / MINUTES_IN_HOUR), minutes % MINUTES_IN_HOUR]
    .map((part) => String(part).padStart(TIME_PAD, '0'))
    .join(':')

// Local offset of that day
const offsetOf = (date: string): string => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'longOffset',
  }).formatToParts(middayOf(date))
  const zone = parts.find((part) => part.type === 'timeZoneName')?.value ?? ''

  return zone.replace('GMT', '') || '+00:00'
}

class AppointmentServiceClass extends Service {
  slotMinutes = slotMinutes
  durationMinutes = durationMinutes
  horizonDays = horizonDays

  /**
   * Today in the local time zone
   * @return {string} - ISO date
   */

  today = (): string => new Intl.DateTimeFormat('en-CA', { timeZone }).format(new Date())

  /**
   * Instant of a slot
   * @param {string} date - ISO date
   * @param {string} time - Start time, HH:MM
   * @return {Date} - Absolute instant
   */

  instantOf = (date: string, time: string): Date => new Date(`${date}T${time}:00${offsetOf(date)}`)

  /**
   * Weekday of a date
   * @param {string} date - ISO date
   * @return {number} - Weekday, 0 is Sunday
   */

  weekdayOf = (date: string): number => middayOf(date).getUTCDay()

  /**
   * Opening hours of a date
   * @param {string} date - ISO date
   * @return {OpeningHours | undefined} - Opening hours
   */

  hoursOf = (date: string): OpeningHours | undefined =>
    openingHours.find((entry) => entry.day === this.weekdayOf(date))

  /**
   * Weekdays in reading order
   * @return {number[]} - Weekdays
   */

  weekdayOrder = (): number[] =>
    Array.from({ length: DAYS_IN_WEEK }, (_, index) => (index + firstDayOfWeek) % DAYS_IN_WEEK)

  /**
   * Opening hours
   * @return {OpeningSchedule[]} - Schedules
   */

  openingSchedule = (): OpeningSchedule[] =>
    this.weekdayOrder().reduce<OpeningSchedule[]>((groups, day) => {
      const hours = openingHours.find((entry) => entry.day === day)
      const previous = groups.at(-1)

      // Consecutive days with identical hours read as one line
      if (
        previous &&
        previous.opensAt === hours?.opensAt &&
        previous.closesAt === hours?.closesAt
      ) {
        previous.days.push(day)

        return groups
      }

      return groups.concat({ days: [day], opensAt: hours?.opensAt, closesAt: hours?.closesAt })
    }, [])

  /**
   * Bookable date check
   * @param {string} date - ISO date
   * @return {boolean} - Open and inside the horizon
   */

  isBookable = (date: string): boolean => {
    if (!this.hoursOf(date)) return false

    const today = this.today()
    const horizon = this.lastBookableDate()

    return date >= today && date <= horizon
  }

  /**
   * Last date open to booking
   * @return {string} - ISO date
   */

  lastBookableDate = (): string => {
    const limit = middayOf(this.today())
    limit.setUTCDate(limit.getUTCDate() + horizonDays)

    return limit.toISOString().slice(0, 10)
  }

  /**
   * Every start time of a day
   * @param {string} date - ISO date
   * @return {string[]} - Start times, HH:MM
   */

  slotsOf = (date: string): string[] => {
    const hours = this.hoursOf(date)
    if (!hours) return []

    const opens = minutesOf(hours.opensAt)
    const closes = minutesOf(hours.closesAt)
    const earliest = Date.now() + minimumNoticeHours * MINUTES_IN_HOUR * MINUTE_IN_MS
    const slots: string[] = []

    // A slot only exists when the whole appointment fits before closing
    for (let start = opens; start + durationMinutes <= closes; start += slotMinutes) {
      const time = timeOf(start)
      if (this.instantOf(date, time).getTime() >= earliest) slots.push(time)
    }

    return slots
  }

  /**
   * Free start times of a day
   * @param {string} date - ISO date
   * @param {BusyRange[]} busy - Occupied ranges
   * @return {string[]} - Free start times, HH:MM
   */

  freeSlotsOf = (date: string, busy: BusyRange[]): string[] => {
    const ranges = busy.map((range) => ({
      start: new Date(range.start).getTime(),
      end: new Date(range.end).getTime(),
    }))

    return this.slotsOf(date).filter((time) => {
      const start = this.instantOf(date, time).getTime()
      const end = start + durationMinutes * MINUTE_IN_MS

      return !ranges.some((range) => start < range.end && end > range.start)
    })
  }

  /**
   * Calendar grid of a month
   * @param {number} year - Full year
   * @param {number} month - Month index, 0 is January
   * @return {(string | null)[]} - ISO dates, null for the leading blanks
   */

  monthGridOf = (year: number, month: number): (string | null)[] => {
    const first = new Date(Date.UTC(year, month, 1))
    const dayCount = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
    const offset = (first.getUTCDay() - firstDayOfWeek + DAYS_IN_WEEK) % DAYS_IN_WEEK
    const blanks: (string | null)[] = Array.from({ length: offset }, () => null)

    return blanks.concat(
      Array.from({ length: dayCount }, (_, index) =>
        new Date(Date.UTC(year, month, index + 1)).toISOString().slice(0, 10)
      )
    )
  }

  /**
   * Free slots of a day, read from the API
   * @param {string} date - ISO date
   * @param {AbortSignal} [signal] - Abort signal
   * @return {Promise<RequestResult<DayAvailability>>} - Availability
   */

  availabilityOf = (date: string, signal?: AbortSignal): Promise<RequestResult<DayAvailability>> =>
    HttpService.request<DayAvailability>(AVAILABILITY_ENDPOINT, { query: { date }, signal })

  /**
   * Book a slot
   * @param {AppointmentRequest} request - Chosen slot and form values
   * @return {Promise<RequestResult<AppointmentConfirmation>>} - Confirmation
   */

  book = (request: AppointmentRequest): Promise<RequestResult<AppointmentConfirmation>> =>
    HttpService.request<AppointmentConfirmation>(AVAILABILITY_ENDPOINT, {
      method: HTTP_METHODS.post,
      body: request,
    })
}

// Slot arithmetic and booking calls
export const AppointmentService = new AppointmentServiceClass('appointment')
