import type { ReactNode } from 'react'

/**
 * Optional value
 * @typedef {T | null | undefined} Maybe
 * @template T - Value type
 */

export type Maybe<T> = T | null | undefined

/**
 * Key-value mapping
 * @typedef {Record<string, T>} Dictionary
 * @template T - Value type
 */

export type Dictionary<T = unknown> = Record<string, T>

/**
 * Record value
 * @typedef ValueOf
 * @template T - Type
 */

export type ValueOf<T> = T[keyof T]

/**
 * Type of key-value pair
 * @typedef Entries
 * @template T - Record type
 */

export type Entries<T> = [keyof T, ValueOf<T>][]

/**
 * Registry key union
 * @typedef RegistryKey
 * @template T - Registry type
 */

export type RegistryKey<T> = Extract<keyof T, string>

/**
 * Object with unique ID
 * @typedef Identifiable
 * @property {string} id - Unique identifier
 */

export interface Identifiable {
  id: string
}

/**
 * Component accepting CSS class
 * @typedef Styleable
 * @property {string} [className] - CSS classes
 */

export interface Styleable {
  className?: string
}

/**
 * Styleable with child content
 * @typedef Composable
 * @property {ReactNode} [children] - Slot content
 */

export interface Composable extends Styleable {
  children?: ReactNode
}

/**
 * Component size variant
 * @typedef {'sm' | 'md' | 'lg'} Size
 */

export type Size = 'sm' | 'md' | 'lg'

/**
 * Color tone variant
 * @typedef Tone
 */

export type Tone = 'neutral' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info'

/**
 * Layout direction
 * @typedef {'horizontal' | 'vertical'} Direction
 */

export type Direction = 'horizontal' | 'vertical'

/**
 * Text alignment
 * @typedef {'start' | 'center' | 'end'} Alignment
 */

export type Alignment = 'start' | 'center' | 'end'

/**
 * Sort order
 * @typedef {'asc' | 'desc'} SortOrder
 */

export type SortOrder = 'asc' | 'desc'

/**
 * Translation message key
 * @typedef {string} TranslationKey
 */

export type TranslationKey = string

/**
 * Identifiable with translation key
 * @typedef TranslatableEntry
 * @property {TranslationKey} translationKey - Message key
 */

export interface TranslatableEntry extends Identifiable {
  translationKey: TranslationKey
}
