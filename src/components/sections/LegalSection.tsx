'use client'

import { useTranslations } from 'next-intl'

import { Heading } from '@/components/elements/typography/Heading'
import { Text } from '@/components/elements/typography/Text'
import { Container } from '@/components/structures/layout/Container'
import { LEGAL_SECTIONS } from '@/declarations/content'
import type { LegalPage } from '@/declarations/content'
import { SECTION_SPACING } from '@/declarations/ui/tokens'
import { ConfigurationService } from '@/services/ConfigurationService'

export interface LegalSectionProps {
  page: LegalPage
}

const { identity } = ConfigurationService

// Interpolation variables
const VARIABLES = {
  legalName: identity.legalName,
  email: identity.email,
  phone: identity.phone,
  address: `${identity.address.street}, ${identity.address.postalCode} ${identity.address.city}`,
  registration: identity.registration.number,
  vat: identity.registration.vat,
  hostingName: identity.hosting.name,
  hostingAddress: identity.hosting.address,
  publisherName: identity.publisher.name,
  publisherEmail: identity.publisher.email,
}

/**
 * Legal section
 * @param {LegalSectionProps} props - Legal section props
 * @return {JSX.Element} - Rendered body
 */

export const LegalSection = ({ page }: LegalSectionProps) => {
  const t = useTranslations(`legal.${page}.sections`)

  return (
    <div className={SECTION_SPACING.sm}>
      <Container width="prose">
        <div className="flex flex-col gap-8">
          {LEGAL_SECTIONS[page].map((id) => (
            <section key={id} className="flex flex-col gap-2">
              <Heading level={2} appearance={3}>
                {t(`${id}.title`)}
              </Heading>
              <Text appearance="description">{t(`${id}.body`, VARIABLES)}</Text>
            </section>
          ))}
        </div>
      </Container>
    </div>
  )
}
