import type {
  FaqItem,
  FeatureItem,
  MediaItem,
  PricingItem,
  StatItem,
  TestimonialItem,
} from '@/types/content'

/**
 * Placeholder image
 * @type {string}
 */

export const PLACEHOLDER_IMAGE = '/images/placeholder.svg'

/**
 * Features
 * @type {FeatureItem[]}
 */

export const FEATURES: FeatureItem[] = [
  { id: 'quality', translationKey: 'quality', icon: 'sparkles', tone: 'primary' },
  { id: 'speed', translationKey: 'speed', icon: 'zap', tone: 'accent' },
  { id: 'support', translationKey: 'support', icon: 'users', tone: 'info' },
  { id: 'security', translationKey: 'security', icon: 'shield', tone: 'success' },
  { id: 'flexibility', translationKey: 'flexibility', icon: 'trend', tone: 'warning' },
  { id: 'transparency', translationKey: 'transparency', icon: 'scale', tone: 'neutral' },
]

/**
 * Statistics
 * @type {StatItem[]}
 */

export const STATS: StatItem[] = [
  { id: 'clients', translationKey: 'clients', value: 240, format: 'count', icon: 'users' },
  { id: 'projects', translationKey: 'projects', value: 128, format: 'count', icon: 'sparkles' },
  {
    id: 'satisfaction',
    translationKey: 'satisfaction',
    value: 0.98,
    format: 'percent',
    icon: 'heart',
  },
  { id: 'experience', translationKey: 'experience', value: 12, format: 'count', icon: 'clock' },
]

/**
 * Response and delivery promises
 * @type {FeatureItem[]}
 */

export const PROMISES: FeatureItem[] = [
  { id: 'response', translationKey: 'response', icon: 'clock', tone: 'primary' },
  { id: 'delivery', translationKey: 'delivery', icon: 'send', tone: 'accent' },
]

/**
 * Testimonials
 * @type {TestimonialItem[]}
 */

export const TESTIMONIALS: TestimonialItem[] = [
  { id: 'first', translationKey: 'first', rating: 5 },
  { id: 'second', translationKey: 'second', rating: 5 },
  { id: 'third', translationKey: 'third', rating: 4 },
]

/**
 * FAQ items
 * @type {FaqItem[]}
 */

export const FAQ: FaqItem[] = [
  { id: 'delay', translationKey: 'delay' },
  { id: 'price', translationKey: 'price' },
  { id: 'process', translationKey: 'process' },
  { id: 'support', translationKey: 'support' },
  { id: 'cancel', translationKey: 'cancel' },
]

/**
 * Pricing plans
 * @type {PricingItem[]}
 */

export const PRICING: PricingItem[] = [
  {
    id: 'starter',
    translationKey: 'starter',
    amountCents: 49000,
    period: 'once',
    includedKeys: ['scope', 'revisions', 'delivery'],
  },
  {
    id: 'standard',
    translationKey: 'standard',
    amountCents: 129000,
    period: 'once',
    featured: true,
    includedKeys: ['scope', 'revisions', 'delivery', 'support'],
  },
  {
    id: 'premium',
    translationKey: 'premium',
    amountCents: 249000,
    period: 'once',
    includedKeys: ['scope', 'revisions', 'delivery', 'support', 'training'],
  },
]

/**
 * Legal page sections
 * @type {Object}
 */

export const LEGAL_SECTIONS = {
  legalNotice: ['publisher', 'hosting', 'property', 'liability'],
  privacyPolicy: ['collection', 'purpose', 'retention', 'rights', 'cookies', 'contact'],
} as const

/**
 * Legal page name
 * @typedef {keyof typeof LEGAL_SECTIONS} LegalPage
 */

export type LegalPage = keyof typeof LEGAL_SECTIONS

export const GALLERY: MediaItem[] = Array.from({ length: 6 }, (_, index) => ({
  id: `item-${index + 1}`,
  src: PLACEHOLDER_IMAGE,
  translationKey: `item${index + 1}`,
}))
