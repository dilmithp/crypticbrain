'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Table, Column } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { Booking, BookingStatus } from '@/types/booking';
import { ApiResponse } from '@/types/api';

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Checked In', value: 'CHECKED_IN' },
  { label: 'Checked Out', value: 'CHECKED_OUT' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default function BookingsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    fetchApi<ApiResponse<Booking[]>>('/api/bookings', {}, token)
      .then(res => setBookings(res.data || []))
      .catch(err => showToast('error', err instanceof Error ? err.message : 'Failed to load bookings'))
      .finally(() => setIsLoading(false));
  }, [token]);

  const filtered = filterStatus
    ? bookings.filter(b => b.status === (filterStatus as BookingStatus))
    : bookings;

  const columns: Column<Booking>[] = [
    { header: 'ID', accessor: 'id' },
    { header: 'Guest Name', accessor: 'guestName' },
    { header: 'Room #', accessor: b => b.room?.roomNumber ?? '—' },
    { header: 'Check-In', accessor: 'checkInDate' },
    { header: 'Check-Out', accessor: 'checkOutDate' },
    { header: 'Status', accessor: b => <Badge status={b.status} /> },
    { header: 'Total', accessor: b => `$${b.totalPrice}` },
  ];

  return (
    <PageLayout title="Bookings" allowedRoles={['MANAGER', 'RECEPTIONIST']}>
      <div className="flex flex-wrap items-center gap-3 mb-5 justify-between">
        {/* Status filter chips */}
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

        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => router.push('/bookings/new')}
        >
          New Booking
        </Button>
      </div>

      <Table<Booking>
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        emptyMessage="No bookings found."
        keyExtractor={b => b.id}
        onRowClick={row => router.push(`/bookings/${row.id}`)}
      />
    </PageLayout>
  );
}
