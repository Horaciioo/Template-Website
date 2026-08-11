'use client'

import { useTranslations } from 'next-intl'

import { Button } from '@/components/elements/actions/Button'
import { Text } from '@/components/elements/typography/Text'
import { PAGINATION_STYLES } from '@/declarations/ui/variants'
import type { PaginationMeta } from '@/types/api'
import type { Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface PaginationProps extends Styleable {
  meta: PaginationMeta
  onPageChange: (page: number) => void
}

/**
 * Pagination
 * @param {PaginationProps} props - Pagination props
 * @return {JSX.Element | null} - Rendered pagination
 */

export const Pagination = ({ meta, onPageChange, className }: PaginationProps) => {
  const t = useTranslations('feedback')
  const actions = useTranslations('actions')

  if (meta.totalPages <= 1) return null

  return (
    <div className={cn(PAGINATION_STYLES.frame, className)}>
      <Text appearance="meta">
        {t('pagination', { page: meta.page, totalPages: meta.totalPages, total: meta.total })}
      </Text>
      <div className={PAGINATION_STYLES.actions}>
        <Button
          variant="secondary"
          size="sm"
          icon="chevronLeft"
          disabled={!meta.hasPreviousPage}
          onClick={() => onPageChange(meta.page - 1)}>
          {actions('previous')}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon="chevronRight"
          iconPosition="right"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(meta.page + 1)}>
          {actions('next')}
        </Button>
      </div>
    </div>
  )
}
