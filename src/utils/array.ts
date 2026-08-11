import type { PaginationMeta } from '@/types/api'
import type { SortOrder } from '@/types/common'

/**
 * Chunk list
 * @param {T[]} items - Source list
 * @param {number} size - Chunk length
 * @return {T[][]} - List of chunks
 */

export const chunk = <T>(items: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(items.length / Math.max(size, 1)) }, (_, index) =>
    items.slice(index * size, index * size + size)
  )

/**
 * Group by key
 * @param {T[]} items - Source list
 * @param {(item: T) => string} keyOf - Key reader
 * @return {Record<string, T[]>} - Grouped items
 */

export const groupBy = <T>(items: T[], keyOf: (item: T) => string): Record<string, T[]> =>
  items.reduce<Record<string, T[]>>((groups, item) => {
    const key = keyOf(item)
    groups[key] = [...(groups[key] ?? []), item]

    return groups
  }, {})

/**
 * Sort by field
 * @param {T[]} items - Source list
 * @param {(item: T) => string | number} valueOf - Value reader
 * @param {SortOrder} [order] - Sort direction
 * @return {T[]} - Sorted copy
 */

export const sortBy = <T>(
  items: T[],
  valueOf: (item: T) => string | number,
  order: SortOrder = 'asc'
): T[] =>
  [...items].sort((left, right) => {
    const a = valueOf(left)
    const b = valueOf(right)
    const comparison =
      typeof a === 'string' && typeof b === 'string' ? a.localeCompare(b) : Number(a) - Number(b)

    return order === 'asc' ? comparison : -comparison
  })

/**
 * Deduplicate by key
 * @param {T[]} items - Source list
 * @param {(item: T) => string} keyOf - Identity reader
 * @return {T[]} - Deduplicated list
 */

export const uniqueBy = <T>(items: T[], keyOf: (item: T) => string): T[] => {
  const seen = new Set<string>()

  return items.filter((item) => {
    const key = keyOf(item)
    if (seen.has(key)) return false
    seen.add(key)

    return true
  })
}

/**
 * Pagination metadata
 * @param {number} total - Total items
 * @param {number} page - Page number
 * @param {number} perPage - Items per page
 * @return {PaginationMeta} - Pagination metadata
 */

export const buildPaginationMeta = (
  total: number,
  page: number,
  perPage: number
): PaginationMeta => {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(perPage, 1)))
  const current = Math.min(Math.max(page, 1), totalPages)

  return {
    page: current,
    perPage,
    total,
    totalPages,
    hasPreviousPage: current > 1,
    hasNextPage: current < totalPages,
  }
}

/**
 * Current page items
 * @param {T[]} items - Full list
 * @param {PaginationMeta} meta - Pagination metadata
 * @return {T[]} - Page items
 */

export const selectPage = <T>(items: T[], meta: PaginationMeta): T[] =>
  items.slice((meta.page - 1) * meta.perPage, meta.page * meta.perPage)
