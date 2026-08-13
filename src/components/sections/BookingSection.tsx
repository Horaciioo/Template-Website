'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { ActionLink } from '@/components/elements/actions/ActionLink'
import { Button } from '@/components/elements/actions/Button'
import { IconButton } from '@/components/elements/actions/IconButton'
import { Alert } from '@/components/elements/feedback/Alert'
import { Spinner } from '@/components/elements/feedback/Spinner'
import { Field } from '@/components/elements/forms/Field'
import { FieldControl } from '@/components/elements/forms/FieldControl'
import { Text } from '@/components/elements/typography/Text'
import { Section } from '@/components/structures/layout/Section'
import { BOOKING_STYLES, FIELD_STYLES } from '@/declarations/ui/variants'
import { AnalyticsService } from '@/services/AnalyticsService'
import { AppointmentService } from '@/services/AppointmentService'
import { ConfigurationService } from '@/services/ConfigurationService'
import { FormatService } from '@/services/FormatService'
import { FormService } from '@/services/FormService'
import { NamingService } from '@/services/NamingService'
import { ValidationService } from '@/services/ValidationService'
import { FormStatuses } from '@/structures/constants'
import type { FieldValue } from '@/types/form'
import { cn } from '@/utils/classnames'

// Declared once in declarations/forms.ts
const FORM_ID = 'bookAppointment'

const MONTHS_IN_YEAR = 12

const monthOf = (date: string): { year: number; month: number } => ({
  year: Number(date.slice(0, 4)),
  month: Number(date.slice(5, 7)) - 1,
})

const shiftMonth = (cursor: { year: number; month: number }, step: number) => {
  const raw = cursor.month + step

  return {
    year: cursor.year + Math.floor(raw / MONTHS_IN_YEAR),
    month: ((raw % MONTHS_IN_YEAR) + MONTHS_IN_YEAR) % MONTHS_IN_YEAR,
  }
}

/**
 * Appointment booking
 * @return {JSX.Element} - Rendered section
 */

export const BookingSection = () => {
  const t = useTranslations('sections.booking')
  const forms = useTranslations(NamingService.toTranslationKey('forms', FORM_ID))
  const actions = useTranslations('actions')
  const validation = useTranslations('validation')
  const feedback = useTranslations('feedback')
  const format = FormatService.for(useLocale())

  const form = FormService.declarationOf(FORM_ID)
  const today = AppointmentService.today()

  const [cursor, setCursor] = useState(() => monthOf(today))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [slots, setSlots] = useState<string[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [confirmation, setConfirmation] = useState<{ date: string; slot: string } | null>(null)
  const [hasFailed, setHasFailed] = useState(false)
  const [state, setState] = useState(() => FormService.buildInitialState(form))

  // Free slots follow the picked day
  useEffect(() => {
    if (!selectedDate) return undefined

    const controller = new AbortController()
    setIsLoadingSlots(true)

    AppointmentService.availabilityOf(selectedDate, controller.signal).then((result) => {
      if (controller.signal.aborted) return

      setSlots(result.success ? result.data.slots : [])
      setIsLoadingSlots(false)
    })

    return () => controller.abort()
  }, [selectedDate])

  const selectDate = (date: string) => {
    setSelectedDate(date)
    setSelectedSlot(null)
    setConfirmation(null)
    setHasFailed(false)
  }

  const change = (name: string, value: FieldValue) =>
    setState((current) => FormService.setValue(current, name, value))

  const blur = (name: string) => setState((current) => FormService.touchField(current, form, name))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedDate || !selectedSlot) return

    const errors = ValidationService.validateForm(form, state.values)

    if (Object.keys(errors).length > 0) {
      setState((current) => ({ ...current, errors, status: FormStatuses.Failed }))

      return
    }

    setHasFailed(false)
    setState((current) => ({ ...current, status: FormStatuses.Submitting }))

    const result = await AppointmentService.book({
      date: selectedDate,
      slot: selectedSlot,
      values: state.values,
    })

    AnalyticsService.track(result.success ? 'formSubmitted' : 'formFailed', { form: FORM_ID })

    if (!result.success) {
      setHasFailed(true)
      setState((current) => ({ ...current, status: FormStatuses.Failed }))

      return
    }

    setConfirmation({ date: result.data.date, slot: result.data.slot })
    setState(FormService.buildInitialState(form))
    setSelectedSlot(null)
    setSlots((current) => current.filter((slot) => slot !== result.data.slot))
  }

  const optional = (key: string): string | undefined => (forms.has(key) ? forms(key) : undefined)
  const monthStart = new Date(Date.UTC(cursor.year, cursor.month, 1))
  const isSameMonth = (date: string): boolean =>
    monthOf(date).year === cursor.year && monthOf(date).month === cursor.month
  const isFirstMonth = isSameMonth(today)
  const isLastMonth = isSameMonth(AppointmentService.lastBookableDate())

  // Booking off falls back to the contact form, the project may not run a shared diary
  if (!ConfigurationService.isEnabled('appointmentBooking')) {
    return (
      <Section anchor="booking" title={t('title')}>
        <Alert tone="info" icon="phone" title={t('disabled')} />
      </Section>
    )
  }

  return (
    <Section anchor="booking" title={t('title')} description={t('description')}>
      <div className={BOOKING_STYLES.frame}>
        <div className={BOOKING_STYLES.calendar}>
          <div className={BOOKING_STYLES.panel}>
            <div className={BOOKING_STYLES.monthBar}>
              <IconButton
                icon="chevronLeft"
                variant="ghost"
                size="sm"
                label={actions('previous')}
                disabled={isFirstMonth}
                onClick={() => setCursor((current) => shiftMonth(current, -1))}
              />
              <p className={BOOKING_STYLES.monthLabel}>{format.date(monthStart, 'monthYear')}</p>
              <IconButton
                icon="chevronRight"
                variant="ghost"
                size="sm"
                label={actions('next')}
                disabled={isLastMonth}
                onClick={() => setCursor((current) => shiftMonth(current, 1))}
              />
            </div>

            <div className={BOOKING_STYLES.weekdays} aria-hidden="true">
              {format.weekdays('narrow').map((name, index) => (
                <span key={index} className={BOOKING_STYLES.weekday}>
                  {name}
                </span>
              ))}
            </div>

            <div className={BOOKING_STYLES.days}>
              {AppointmentService.monthGridOf(cursor.year, cursor.month).map((date, index) => {
                if (!date) return <span key={`blank-${index}`} />

                const isOpen = AppointmentService.isBookable(date)

                return (
                  <button
                    key={date}
                    type="button"
                    disabled={!isOpen}
                    aria-pressed={date === selectedDate}
                    aria-label={format.date(date, 'weekday')}
                    className={cn(
                      BOOKING_STYLES.day,
                      !isOpen && BOOKING_STYLES.dayClosed,
                      date === today && BOOKING_STYLES.dayToday,
                      date === selectedDate && BOOKING_STYLES.daySelected
                    )}
                    onClick={() => selectDate(date)}>
                    {Number(date.slice(8))}
                  </button>
                )
              })}
            </div>
          </div>

          <ActionLink
            route="contact"
            variant="outline"
            size="md"
            icon="mail"
            className="self-center">
            {t('contactPrompt')}
          </ActionLink>
        </div>

        <div className="flex flex-col gap-6">
          {!selectedDate && <Text appearance="description">{t('pickDate')}</Text>}

          {selectedDate && (
            <div className="flex flex-col gap-3">
              <p className={BOOKING_STYLES.summary}>{format.date(selectedDate, 'weekday')}</p>

              {isLoadingSlots && <Spinner label={feedback('loading')} />}

              {!isLoadingSlots && slots.length === 0 && (
                <Text appearance="description">{t('noSlot')}</Text>
              )}

              {!isLoadingSlots && slots.length > 0 && (
                <div className={BOOKING_STYLES.slots}>
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      aria-pressed={slot === selectedSlot}
                      className={cn(
                        BOOKING_STYLES.slot,
                        slot === selectedSlot && BOOKING_STYLES.slotSelected
                      )}
                      onClick={() => setSelectedSlot(slot)}>
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {confirmation && (
            <Alert
              tone="success"
              title={t('success.title')}
              description={t('success.description', {
                date: format.date(confirmation.date, 'weekday'),
                slot: confirmation.slot,
              })}
            />
          )}

          {hasFailed && <Alert tone="danger" title={t('failure')} />}

          {selectedSlot && (
            <form noValidate onSubmit={submit} className="flex flex-col gap-5">
              <div className={FIELD_STYLES.grid}>
                {form.fields.map((field) => {
                  const fieldId = NamingService.toDomId(FORM_ID, field.name)
                  const base = `fields.${field.name}`
                  const error = state.errors[field.name]

                  return (
                    <Field
                      key={field.name}
                      id={fieldId}
                      label={forms(`${base}.label`)}
                      required={field.required}
                      hint={optional(`${base}.hint`)}
                      error={error ? validation(error.rule, error.params) : undefined}
                      className={cn(field.wide && FIELD_STYLES.wide)}>
                      <FieldControl
                        id={fieldId}
                        field={field}
                        value={state.values[field.name] ?? null}
                        invalid={Boolean(error)}
                        placeholder={optional(`${base}.placeholder`)}
                        choiceLabel={optional(`${base}.choice`) ?? forms(`${base}.label`)}
                        optionLabels={Object.fromEntries(
                          (field.options ?? []).map((option) => [
                            option.value,
                            forms(`${base}.options.${option.translationKey}`),
                          ])
                        )}
                        onChange={(value) => change(field.name, value)}
                        onBlur={() => blur(field.name)}
                      />
                    </Field>
                  )
                })}
              </div>

              <Button
                type="submit"
                icon="calendar"
                loading={state.status === FormStatuses.Submitting}
                disabled={state.status === FormStatuses.Submitting}>
                {actions(form.submitAction)}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Section>
  )
}
