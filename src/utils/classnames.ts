import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names
 * @param {ClassValue[]} values - Class values
 * @return {string} - Merged classes
 */

export const cn = (...values: ClassValue[]): string => twMerge(clsx(values))
