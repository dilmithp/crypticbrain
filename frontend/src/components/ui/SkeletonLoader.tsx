'use client';
import React from 'react';

function SkeletonBar({
  width = 'w-full',
  height = 'h-4',
  className = '',
}: {
  width?: string;
  height?: string;
  className?: string;
}) {
  return <div className={`shimmer rounded ${height} ${width} ${className}`} />;
}

export function TableSkeleton({
  rows = 5,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="space-y-0">
      <div className="flex gap-4 px-6 py-3 border-b border-[var(--border)]">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBar key={i} height="h-3" width={i === 0 ? 'w-16' : 'flex-1'} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 px-6 py-4 border-b border-[var(--border)]">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <SkeletonBar key={colIdx} height="h-4" width={colIdx === 0 ? 'w-16' : 'flex-1'} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-[var(--radius-xl)] bg-[var(--surface)] p-6 border border-[var(--border)] shadow-[var(--shadow-card)]"
        >
          <div className="flex items-start justify-between mb-4">
            <SkeletonBar height="h-4" width="w-24" />
            <div className="shimmer h-10 w-10 rounded-[var(--radius-lg)]" />
          </div>
          <SkeletonBar height="h-8" width="w-16" className="mb-2" />
          <SkeletonBar height="h-3" width="w-32" />
        </div>
      ))}
    </div>
  );
}
