import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { CallToActionSection } from '@/components/sections/CallToActionSection'
import { FaqSection } from '@/components/sections/FaqSection'
import { FeatureSection } from '@/components/sections/FeatureSection'
import { GallerySection } from '@/components/sections/GallerySection'
import { HeroSection } from '@/components/sections/HeroSection'
import { PricingSection } from '@/components/sections/PricingSection'
import { StatsSection } from '@/components/sections/StatsSection'
import { TestimonialSection } from '@/components/sections/TestimonialSection'
import { Page } from '@/structures/Page'

export interface HomePageProps {
  params: Promise<{ locale: string }>
}

class HomePage extends Page {
  constructor() {
    super('home')
  }

  render(): ReactNode {
    return (
      <>
        <HeroSection secondaryRoute="showcase" />
        <StatsSection />
        <FeatureSection />
        <GallerySection />
        <PricingSection />
        <TestimonialSection />
        <FaqSection />
        <CallToActionSection />
      </>
    )
  }
}

const page = new HomePage()

/**
 * Generate page metadata
 * @param {HomePageProps} props - Page props
 * @return {Promise<Metadata>} - Metadata for the page
 */

export const generateMetadata = async ({ params }: HomePageProps): Promise<Metadata> => {
  const { locale } = await params

  return page.metadata({ locale, translate: await getTranslations() })
}

/**
 * Landing page
 * @return {ReactNode} - Page
 */

export default function HomePageRoute() {
  return page.render()
}
