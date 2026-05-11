'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { RoomForm } from '@/components/rooms/RoomForm';
import { useToast } from '@/components/ui/Toast';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { RoomCreateRequest, Room } from '@/types/room';
import { ApiResponse } from '@/types/api';

export default function NewRoomPage() {
  const router = useRouter();
  const { token } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: RoomCreateRequest) => {
    setIsLoading(true);
    try {
      await fetchApi<ApiResponse<Room>>('/api/rooms', {
        method: 'POST',
        body: JSON.stringify(data),
      }, token);
      showToast('success', 'Room created successfully!');
      router.push('/rooms');
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Failed to create room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout title="Add New Room" allowedRoles={['MANAGER']}>
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft className="h-4 w-4" />}
        onClick={() => router.push('/rooms')}
        className="mb-5"
      >
        Back to Rooms
      </Button>
      <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-card)] p-6 max-w-lg">
        <RoomForm onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Create Room" />
      </div>
    </PageLayout>
  );
}
