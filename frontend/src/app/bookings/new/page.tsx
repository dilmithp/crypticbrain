'use client';
import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageLayout } from '@/components/layout/PageLayout';
import { Spinner } from '@/components/ui/Spinner';
import { BookingForm } from '@/components/bookings/BookingForm';
import { useToast } from '@/components/ui/Toast';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { BookingCreateRequest, Booking } from '@/types/booking';
import { ApiResponse } from '@/types/api';

function NewBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const preselectedRoomId = searchParams.get('roomId')
    ? Number(searchParams.get('roomId'))
    : undefined;
  const preselectedRoomNumber = searchParams.get('roomNumber') || undefined;

  const handleSubmit = async (data: BookingCreateRequest) => {
    setIsLoading(true);
    try {
      await fetchApi<ApiResponse<Booking>>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      }, token);
      showToast('success', 'Booking created successfully!');
      router.push('/bookings');
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-card)] p-6 max-w-lg">
      <BookingForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        preselectedRoomId={preselectedRoomId}
        preselectedRoomNumber={preselectedRoomNumber}
      />
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <PageLayout title="New Booking" allowedRoles={['MANAGER', 'RECEPTIONIST']}>
      <Suspense fallback={<Spinner />}>
        <NewBookingContent />
      </Suspense>
    </PageLayout>
  );
}
