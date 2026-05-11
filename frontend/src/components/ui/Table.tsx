'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TableSkeleton } from './SkeletonLoader';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onRowClick?: (row: T) => void;
  keyExtractor?: (row: T) => string | number;
}

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: Math.min(i * 0.02, 0.2), duration: 0.2 },
  }),
};

export function Table<T extends Record<string, any>>({
  columns,
  data,
  isLoading,
  emptyMessage = 'No records found.',
  emptyIcon,
  onRowClick,
  keyExtractor,
}: TableProps<T>) {
  const [page, setPage] = React.useState(0);
  const perPage = 10;
  const totalPages = Math.ceil(data.length / perPage);
  const paged = data.slice(page * perPage, (page + 1) * perPage);

  return (
    <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-card)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-offset)]">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`px-5 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <TableSkeleton rows={5} cols={columns.length} />
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="py-16 text-center">
                    <div className="text-[var(--text-faint)] mb-2">
                      {emptyIcon || <div className="text-4xl mb-3">📋</div>}
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((row, i) => (
                <motion.tr
                  key={keyExtractor ? keyExtractor(row) : i}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => onRowClick?.(row)}
                  style={{}}
                  className={[
                    'border-b border-[var(--border)] last:border-0 transition-colors duration-150',
                    i % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--surface-offset)]/30',
                    onRowClick ? 'cursor-pointer hover:bg-[var(--surface-offset)]' : 'hover:bg-[var(--surface-offset)]/50',
                  ].join(' ')}
                >
                  {columns.map((col, j) => (
                    <td
                      key={j}
                      className={`px-5 py-3.5 text-sm text-[var(--text-primary)] ${col.className || ''}`}
                    >
                      {typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : String(row[col.accessor as string] ?? '—')}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border)] bg-[var(--surface-offset)]/50">
          <span className="text-xs text-[var(--text-muted)]">
            Showing {page * perPage + 1}–{Math.min((page + 1) * perPage, data.length)} of {data.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-offset)] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                  i === page
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--text-muted)] hover:bg-[var(--surface-offset)]'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-offset)] disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
