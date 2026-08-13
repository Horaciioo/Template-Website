import type { FormValues } from '@/types/form'

/**
 * Opening hours of one weekday
 * @typedef OpeningHours
 * @property {number} day - Weekday, 0 is Sunday
 * @property {string} opensAt - Opening time, HH:MM
 * @property {string} closesAt - Closing time, HH:MM
 */

export interface OpeningHours {
  // Weekday, 0 is Sunday
  day: number
  opensAt: string
  closesAt: string
}

/**
 * Consecutive days sharing the same hours
 * @typedef OpeningSchedule
 * @property {number[]} days - Weekdays of the group
 * @property {string} [opensAt] - Opening time
 * @property {string} [closesAt] - Closing time
 */

export interface OpeningSchedule {
  days: number[]
  opensAt?: string
  closesAt?: string
}

/**
 * Occupied slice of the calendar
 * @typedef BusyRange
 * @property {string} start - ISO start instant
 * @property {string} end - ISO end instant
 */

export interface BusyRange {
  start: string
  end: string
}

/**
 * Bookable day
 * @typedef DayAvailability
 * @property {string} date - ISO date, YYYY-MM-DD
 * @property {string[]} slots - Free start times, HH:MM
 */

export interface DayAvailability {
  // ISO date, YYYY-MM-DD
  date: string
  // Free start times, HH:MM
  slots: string[]
}

/**
 * Booking request sent to the API
 * @typedef AppointmentRequest
 * @property {string} date - ISO date, YYYY-MM-DD
 * @property {string} slot - Start time, HH:MM
 * @property {FormValues} values - Declared form values
 */

export interface AppointmentRequest {
  date: string
  slot: string
  values: FormValues
}

/**
 * Booking confirmation
 * @typedef AppointmentConfirmation
 * @property {string} date - ISO date, YYYY-MM-DD
 * @property {string} slot - Start time, HH:MM
 * @property {boolean} isSynchronised - Landed in the calendar
 */

export interface AppointmentConfirmation {
  date: string
  slot: string
  // Landed in the calendar
  isSynchronised: boolean
}
