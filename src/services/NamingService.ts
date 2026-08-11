import { TRANSLATION_NAMESPACES } from '@/declarations/naming'
import type { ActionName } from '@/declarations/naming'
import { toKebabCase, toSnakeCase } from '@/utils/format/strings'

type Namespace = keyof typeof TRANSLATION_NAMESPACES

// Identifier naming
export const NamingService = {
  /**
   * Build the URL slug of an identifier
   * @param {string} identifier - camelCase identifier
   * @return {string} - kebab-case slug
   */

  toSlug: (identifier: string): string => toKebabCase(identifier),

  /**
   * Build the analytics event name of an identifier
   * @param {string} identifier - camelCase identifier
   * @return {string} - snake_case event name
   */

  toEventName: (identifier: string): string => toSnakeCase(identifier),

  /**
   * Build a translation key inside a declared namespace
   * @param {Namespace} namespace - Root of messages/<locale>.json
   * @param {string[]} segments - Path under the namespace
   * @return {string} - Dotted translation key
   */

  toTranslationKey: (namespace: Namespace, ...segments: string[]): string =>
    [TRANSLATION_NAMESPACES[namespace], ...segments].filter(Boolean).join('.'),

  /**
   * Build the translation key of a canonical action, the label of every button that triggers it
   * @param {ActionName} action - Action declared in declarations/naming.ts
   * @return {string} - Dotted translation key
   */

  toActionKey: (action: ActionName): string => `${TRANSLATION_NAMESPACES.actions}.${action}`,

  /**
   * Build a DOM id that stays unique across a page without a random suffix
   * @param {string[]} segments - Scope then name, for instance a form id and a field name
   * @return {string} - kebab-case DOM id
   */

  toDomId: (...segments: string[]): string => segments.map(toKebabCase).join('-'),

  /**
   * Build the CSS variable name of a theme token
   * @param {string} group - Token group, for instance `color` or `radius`
   * @param {string} name - Token name as written in configurations/theme.json
   * @return {string} - CSS custom property name
   */

  toCssVariable: (group: string, name: string): string => `--${group}-${toKebabCase(name)}`,
} as const
