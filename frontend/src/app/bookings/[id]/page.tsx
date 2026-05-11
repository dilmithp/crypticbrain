'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BookingStatusActions } from '@/components/bookings/BookingStatusActions';
import { useToast } from '@/components/ui/Toast';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Booking, BookingCancelRequest } from '@/types/booking';
import { ApiResponse } from '@/types/api';

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-3 border-b border-[var(--border)] last:border-0">
      <span className="sm:w-44 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide shrink-0">
        {label}
      </span>
      <span className="text-sm text-[var(--text-primary)]">{value}</span>
    </div>
  );
}

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadBooking = () => {
    if (!token || !bookingId) return;
    setIsLoading(true);
    fetchApi<ApiResponse<Booking>>(`/api/bookings/${bookingId}`, {}, token)
      .then(res => setBooking(res.data))
      .catch(err => showToast('error', err instanceof Error ? err.message : 'Failed to load booking'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { loadBooking(); }, [token, bookingId]);

  const handleCancel = async (reason: string) => {
    const body: BookingCancelRequest = { cancellationReason: reason };
    await fetchApi<ApiResponse<Booking>>(`/api/bookings/${bookingId}/cancel`, {
      method: 'POST',
      body: JSON.stringify(body),
    }, token);
    showToast('success', 'Booking cancelled');
    loadBooking();
  };

  const handleCheckIn = async () => {
    await fetchApi<ApiResponse<Booking>>(`/api/bookings/${bookingId}/check-in`, { method: 'POST' }, token);
    showToast('success', 'Guest checked in');
    loadBooking();
  };

  const handleCheckOut = async () => {
    await fetchApi<ApiResponse<Booking>>(`/api/bookings/${bookingId}/check-out`, { method: 'POST' }, token);
    showToast('success', 'Guest checked out');
    loadBooking();
  };

  return (
    <PageLayout title="Booking Details" allowedRoles={['MANAGER', 'RECEPTIONIST']}>
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft className="h-4 w-4" />}
        onClick={() => router.push('/bookings')}
        className="mb-5"
      >
        Back to Bookings
      </Button>

      {isLoading ? (
        <Spinner size="lg" />
      ) : booking ? (
        <div className="space-y-5">
          {/* Header card */}
          <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-card)] p-5">
            <div className="flex items-center justify-between mb-5">
              <h2
                style={{ fontFamily: 'Instrument Serif, Georgia, serif' }}
                className="text-2xl font-normal text-[var(--text-primary)]"
              >
                Booking #{booking.id}
              </h2>
              <Badge status={booking.status} />
            </div>

            {/* Two-column detail grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
              {/* Guest info */}
              <div>
                <p className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider mb-2">
                  Guest Information
                </p>
                <DetailRow label="Name" value={booking.guestName} />
                <DetailRow label="Email" value={booking.guestEmail} />
                <DetailRow label="Phone" value={booking.guestPhone} />
                <DetailRow label="Booked By" value={booking.bookedBy?.fullName ?? '—'} />
              </div>

              {/* Booking info */}
              <div>
                <p className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider mb-2">
                  Booking Information
                </p>
                <DetailRow
                  label="Room"
                  value={`Room ${booking.room?.roomNumber} (${booking.room?.roomType})`}
                />
                <DetailRow label="Floor" value={`Floor ${booking.room?.floor}`} />
                <DetailRow label="Check-In" value={booking.checkInDate} />
                <DetailRow label="Check-Out" value={booking.checkOutDate} />
                <DetailRow
                  label="Total Price"
                  value={
                    <span className="text-base font-semibold text-[var(--text-primary)]">
                      ${booking.totalPrice}
                    </span>
                  }
                />
              </div>
            </div>

            {/* Cancellation info */}
            {booking.cancellationReason && (
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <DetailRow label="Cancelled By" value={booking.cancelledBy?.fullName ?? '—'} />
                <DetailRow label="Cancellation Reason" value={booking.cancellationReason} />
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-0">
              <DetailRow label="Created" value={new Date(booking.createdAt).toLocaleString()} />
              <DetailRow label="Updated" value={new Date(booking.updatedAt).toLocaleString()} />
            </div>
          </div>

          {/* Actions card */}
          {user && (booking.status === 'CONFIRMED' || booking.status === 'CHECKED_IN') && (
            <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-card)] p-5">
              <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-4">
                Actions
              </p>
              <BookingStatusActions
                booking={booking}
                userRole={user.role}
                onCancel={handleCancel}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-[var(--text-muted)]">Booking not found.</p>
      )}
    </PageLayout>
  );
}
