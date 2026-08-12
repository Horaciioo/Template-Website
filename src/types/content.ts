import type { IconName } from '@/declarations/ui/icons'
import type { Identifiable, Tone, TranslationKey } from '@/types/common'

/**
 * Media item
 * @typedef MediaItem
 * @property {string} src - Image source
 * @property {TranslationKey} translationKey - Alternative text key
 * @property {number} [width] - Image width
 * @property {number} [height] - Image height
 */

export interface MediaItem extends Identifiable {
  src: string
  // Alternative text key
  translationKey: TranslationKey
  width?: number
  height?: number
}

/**
 * Feature item
 * @typedef FeatureItem
 * @property {TranslationKey} translationKey - Title key
 * @property {IconName} icon - Display icon
 * @property {Tone} [tone] - Icon tone
 */

export interface FeatureItem extends Identifiable {
  translationKey: TranslationKey
  icon: IconName
  tone?: Tone
}

/**
 * Statistic item
 * @typedef StatItem
 * @property {TranslationKey} translationKey - Label key
 * @property {number} value - Raw value
 * @property {'count' | 'currency' | 'percent'} [format] - Value format type
 * @property {IconName} [icon] - Display icon
 */

export interface StatItem extends Identifiable {
  translationKey: TranslationKey
  value: number
  // Value format type
  format?: 'count' | 'currency' | 'percent'
  icon?: IconName
}

/**
 * Testimonial item
 * @typedef TestimonialItem
 * @property {TranslationKey} translationKey - Quote key
 * @property {number} [rating] - Star rating
 * @property {string} [avatar] - Author image
 */

export interface TestimonialItem extends Identifiable {
  translationKey: TranslationKey
  rating?: number
  avatar?: string
}

/**
 * FAQ item
 * @typedef FaqItem
 * @property {TranslationKey} translationKey - Answer key
 */

export interface FaqItem extends Identifiable {
  translationKey: TranslationKey
}

/**
 * Pricing item
 * @typedef PricingItem
 * @property {TranslationKey} translationKey - Plan name key
 * @property {number} amountCents - Amount in cents
 * @property {'once' | 'month' | 'year'} [period] - Billing period
 * @property {boolean} [featured] - Highlight flag
 * @property {TranslationKey[]} includedKeys - Included features
 */

export interface PricingItem extends Identifiable {
  translationKey: TranslationKey
  // Amount in cents
  amountCents: number
  period?: 'once' | 'month' | 'year'
  featured?: boolean
  includedKeys: TranslationKey[]
}

/**
 * Timeline item
 * @typedef TimelineItem
 * @property {TranslationKey} translationKey - Event description key
 * @property {string} date - Event date
 * @property {IconName} [icon] - Milestone icon
 */

export interface TimelineItem extends Identifiable {
  translationKey: TranslationKey
  date: string
  icon?: IconName
}
