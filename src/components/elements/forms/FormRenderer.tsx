'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/elements/actions/Button'
import { Alert } from '@/components/elements/feedback/Alert'
import { Field } from '@/components/elements/forms/Field'
import { FieldControl } from '@/components/elements/forms/FieldControl'
import type { FormId } from '@/declarations/forms'
import { FIELD_STYLES } from '@/declarations/ui/variants'
import { useRouter } from '@/i18n/routing'
import { AnalyticsService } from '@/services/AnalyticsService'
import { FormService } from '@/services/FormService'
import { NamingService } from '@/services/NamingService'
import { NavigationService } from '@/services/NavigationService'
import { FormStatuses } from '@/structures/constants'
import type { FieldValue } from '@/types/form'
import { cn } from '@/utils/classnames'

export interface FormRendererProps {
  // Form identifier
  id: FormId
  className?: string
}

/**
 * Form renderer
 * @param {FormRendererProps} props - Form renderer props
 * @return {JSX.Element} - Form element
 */

export const FormRenderer = ({ id, className }: FormRendererProps) => {
  const form = FormService.declarationOf(id)
  const t = useTranslations(NamingService.toTranslationKey('forms', id))
  const actions = useTranslations('actions')
  const validation = useTranslations('validation')
  const router = useRouter()
  const [state, setState] = useState(() => FormService.buildInitialState(form))

  const change = (name: string, value: FieldValue) =>
    setState((current) => FormService.setValue(current, name, value))

  const blur = (name: string) => setState((current) => FormService.touchField(current, form, name))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setState((current) => ({ ...current, status: FormStatuses.Submitting }))

    const next = await FormService.submit({ ...state, status: FormStatuses.Submitting }, form)

    AnalyticsService.track(
      next.status === FormStatuses.Succeeded ? 'formSubmitted' : 'formFailed',
      {
        form: id,
      }
    )

    // Redirect instead of inline success
    if (next.status === FormStatuses.Succeeded && form.redirectRouteId) {
      router.push(NavigationService.pathOf(form.redirectRouteId))

      return
    }

    setState(next)
  }

  const optional = (key: string): string | undefined => (t.has(key) ? t(key) : undefined)

  return (
    <form noValidate onSubmit={submit} className={cn('flex flex-col gap-5', className)}>
      {state.status === FormStatuses.Succeeded && <Alert tone="success" title={t('success')} />}

      <div className={FIELD_STYLES.grid}>
        {form.fields.map((field) => {
          const fieldId = NamingService.toDomId(id, field.name)
          const base = `fields.${field.name}`
          const error = state.errors[field.name]

          return (
            <Field
              key={field.name}
              id={fieldId}
              label={t(`${base}.label`)}
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
                choiceLabel={optional(`${base}.choice`) ?? t(`${base}.label`)}
                optionLabels={Object.fromEntries(
                  (field.options ?? []).map((option) => [
                    option.value,
                    t(`${base}.options.${option.translationKey}`),
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
        icon="send"
        loading={state.status === FormStatuses.Submitting}
        disabled={state.status === FormStatuses.Submitting}>
        {actions(form.submitAction)}
      </Button>
    </form>
  )
}
