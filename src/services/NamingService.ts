import { TRANSLATION_NAMESPACES } from '@/declarations/naming'
import type { ActionName } from '@/declarations/naming'
import { Service } from '@/structures/Service'
import { toKebabCase, toSnakeCase } from '@/utils/format/strings'

type Namespace = keyof typeof TRANSLATION_NAMESPACES

class NamingServiceClass extends Service {
  /**
   * URL slug
   * @param {string} identifier - Source identifier
   * @return {string} - Slug
   */

  toSlug = (identifier: string): string => toKebabCase(identifier)

  /**
   * Event name
   * @param {string} identifier - Source identifier
   * @return {string} - Event name
   */

  toEventName = (identifier: string): string => toSnakeCase(identifier)

  /**
   * Translation key
   * @param {Namespace} namespace - Root namespace
   * @param {string[]} segments - Path segments
   * @return {string} - Key
   */

  toTranslationKey = (namespace: Namespace, ...segments: string[]): string =>
    [TRANSLATION_NAMESPACES[namespace], ...segments].filter(Boolean).join('.')

  /**
   * Action label key
   * @param {ActionName} action - Action name
   * @return {string} - Key
   */

  toActionKey = (action: ActionName): string => `${TRANSLATION_NAMESPACES.actions}.${action}`

  /**
   * DOM ID
   * @param {string[]} segments - ID segments
   * @return {string} - DOM ID
   */

  toDomId = (...segments: string[]): string => segments.map(toKebabCase).join('-')

  /**
   * CSS variable
   * @param {string} group - Token group
   * @param {string} name - Token name
   * @return {string} - Variable
   */

  toCssVariable = (group: string, name: string): string => `--${group}-${toKebabCase(name)}`
}

// Identifier naming
export const NamingService = new NamingServiceClass('naming')
