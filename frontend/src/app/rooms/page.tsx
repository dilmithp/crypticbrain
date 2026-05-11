'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Table, Column } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { Room } from '@/types/room';
import { ApiResponse } from '@/types/api';

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'Occupied', value: 'OCCUPIED' },
  { label: 'Cleaning', value: 'CLEANING' },
  { label: 'Maintenance', value: 'UNDER_MAINTENANCE' },
];

export default function RoomsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const isManager = useRoleGuard(['MANAGER']);
  const { showToast } = useToast();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadRooms = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi<ApiResponse<Room[]>>('/api/rooms', {}, token);
      setRooms(res.data || []);
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Failed to load rooms');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadRooms();
  }, [token]);

  const filtered = rooms.filter(r => {
    if (filterStatus && r.status !== filterStatus) return false;
    if (search && !r.roomNumber.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await fetchApi<unknown>(`/api/rooms/${deleteId}`, { method: 'DELETE' }, token);
      setRooms(prev => prev.filter(r => r.id !== deleteId));
      setDeleteId(null);
      showToast('success', 'Room deleted successfully');
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete room');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Room>[] = [
    { header: 'Room No.', accessor: 'roomNumber' },
    { header: 'Type', accessor: r => <Badge status={r.roomType} /> },
    { header: 'Floor', accessor: 'floor' },
    { header: 'Capacity', accessor: r => `${r.capacity} guests` },
    { header: 'Price/Night', accessor: r => `$${r.pricePerNight}` },
    { header: 'Status', accessor: r => <Badge status={r.status} /> },
    {
      header: 'Actions',
      accessor: r => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={e => { e.stopPropagation(); router.push(`/rooms/${r.id}/edit`); }}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-faint)] hover:text-[var(--primary)] hover:bg-[var(--surface-offset)] transition-colors"
            title="Edit room"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          {isManager && (
            <button
              onClick={e => { e.stopPropagation(); setDeleteId(r.id); }}
              className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-faint)] hover:text-[var(--danger)] hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
              title="Delete room"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageLayout title="Rooms" allowedRoles={['MANAGER', 'RECEPTIONIST']}>
      <div className="flex flex-wrap items-center gap-3 mb-5 justify-between">
        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilterStatus(f.value)}
              className={`px-3 h-7 rounded-full text-xs font-medium transition-colors ${
                filterStatus === f.value
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--surface-offset)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-faint)]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search room..."
              className="h-9 pl-8 pr-3 text-sm rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all w-40"
            />
          </div>

          {isManager && (
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => router.push('/rooms/new')}>
              Add Room
            </Button>
          )}
        </div>
      </div>

      <Table<Room>
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        emptyMessage="No rooms found."
        keyExtractor={r => r.id}
      />

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Room"
        message="Are you sure you want to delete this room? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
        confirmLabel="Delete"
        variant="danger"
      />
    </PageLayout>
  );
}
