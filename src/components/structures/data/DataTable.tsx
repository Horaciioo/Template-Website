import type { ReactNode } from 'react'

import { TABLE_STYLES } from '@/declarations/ui/variants'
import type { Identifiable, Styleable } from '@/types/common'
import { cn } from '@/utils/classnames'

export interface TableColumn<T> {
  // Column ID
  id: string
  header: string
  render: (row: T) => ReactNode
  align?: 'left' | 'right'
}

export interface DataTableProps<T extends Identifiable> extends Styleable {
  columns: TableColumn<T>[]
  rows: T[]
  // Empty state
  empty?: ReactNode
  caption?: string
}

/**
 * Data table
 * @param {DataTableProps<T>} props - Data table props
 * @return {JSX.Element} - Rendered table
 */

export const DataTable = <T extends Identifiable>({
  columns,
  rows,
  empty,
  caption,
  className,
}: DataTableProps<T>) => (
  <div className={cn(TABLE_STYLES.scroller, className)}>
    <table className={TABLE_STYLES.table}>
      {caption && <caption className="sr-only">{caption}</caption>}
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.id}
              scope="col"
              className={cn(TABLE_STYLES.headCell, column.align === 'right' && 'text-right')}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className={TABLE_STYLES.empty}>
              {empty}
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr key={row.id} className={TABLE_STYLES.row}>
              {columns.map((column) => (
                <td
                  key={column.id}
                  className={cn(TABLE_STYLES.cell, column.align === 'right' && 'text-right')}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)
