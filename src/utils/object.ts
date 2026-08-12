import { isDefined, isPlainObject } from '@/utils/guards'
import type { Dictionary } from '@/types/common'

/**
 * Read path
 * @param {unknown} source - Object
 * @param {string} path - Path
 * @return {unknown} - Value
 */

export const readPath = (source: unknown, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (current, segment) => (isPlainObject(current) ? current[segment] : undefined),
      source
    )

/**
 * Remove nullish entries
 * @param {Dictionary<T | null | undefined>} source - Raw entries
 * @return {Dictionary<T>} - Defined entries
 */

export const compact = <T>(source: Dictionary<T | null | undefined>): Dictionary<T> =>
  Object.fromEntries(
    Object.entries(source).filter(([, value]) => isDefined(value))
  ) as Dictionary<T>

/**
 * Keep listed keys
 * @param {T} source - Source object
 * @param {K[]} keys - Keys to keep
 * @return {Pick<T, K>} - Reduced object
 */

export const pick = <T extends object, K extends keyof T>(source: T, keys: K[]): Pick<T, K> =>
  Object.fromEntries(keys.map((key) => [key, source[key]])) as Pick<T, K>

/**
 * Registry to entry list
 * @param {Record<string, T>} registry - Declarative registry
 * @return {(T & { id: string })[]} - Entries array
 */

export const toEntryList = <T extends object>(
  registry: Record<string, T>
): (T & { id: string })[] => Object.entries(registry).map(([id, entry]) => ({ ...entry, id }))
