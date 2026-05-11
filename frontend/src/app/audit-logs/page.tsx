'use client';
import React, { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Table, Column } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { AuditLog } from '@/types/audit';
import { ApiResponse } from '@/types/api';

const ENTITY_FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Room', value: 'ROOM' },
  { label: 'Booking', value: 'BOOKING' },
  { label: 'User', value: 'USER' },
];

const columns: Column<AuditLog>[] = [
  {
    header: 'Timestamp',
    accessor: l => (
      <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">
        {new Date(l.timestamp).toLocaleString()}
      </span>
    ),
  },
  {
    header: 'Action',
    accessor: l => <Badge status={l.action} />,
  },
  { header: 'Entity Type', accessor: 'entityType' },
  { header: 'Entity ID', accessor: 'entityId' },
  {
    header: 'Performed By',
    accessor: l => l.performedBy?.fullName ?? '—',
  },
  {
    header: 'Details',
    accessor: l => (
      <span className="text-xs text-[var(--text-muted)] break-all max-w-xs block line-clamp-2">
        {l.details}
      </span>
    ),
  },
];

export default function AuditLogsPage() {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterEntityType, setFilterEntityType] = useState('');

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    fetchApi<ApiResponse<AuditLog[]>>('/api/audit-logs', {}, token)
      .then(res => setLogs(res.data || []))
      .catch(err => showToast('error', err instanceof Error ? err.message : 'Failed to load audit logs'))
      .finally(() => setIsLoading(false));
  }, [token]);

  const filtered = filterEntityType
    ? logs.filter(l => l.entityType === filterEntityType)
    : logs;

  return (
    <PageLayout title="Audit Logs" allowedRoles={['ADMIN', 'MANAGER']}>
      {/* Entity type filter chips */}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        {ENTITY_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilterEntityType(f.value)}
            className={`px-3 h-7 rounded-full text-xs font-medium transition-colors ${
              filterEntityType === f.value
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--surface-offset)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Table<AuditLog>
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        emptyMessage="No audit logs found."
        keyExtractor={l => l.id}
      />
    </PageLayout>
  );
}
