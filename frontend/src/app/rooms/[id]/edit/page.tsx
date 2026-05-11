'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { RoomForm } from '@/components/rooms/RoomForm';
import { useToast } from '@/components/ui/Toast';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Room, RoomCreateRequest } from '@/types/room';
import { ApiResponse } from '@/types/api';

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const { showToast } = useToast();
  const roomId = params.id as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!token || !roomId) return;
    fetchApi<ApiResponse<Room>>(`/api/rooms/${roomId}`, {}, token)
      .then(res => setRoom(res.data))
      .catch(err => showToast('error', err instanceof Error ? err.message : 'Failed to load room'))
      .finally(() => setIsLoading(false));
  }, [token, roomId]);

  const handleSubmit = async (data: RoomCreateRequest) => {
    setIsSaving(true);
    try {
      await fetchApi<ApiResponse<Room>>(`/api/rooms/${roomId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }, token);
      showToast('success', 'Room updated successfully!');
      router.push('/rooms');
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update room');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageLayout title="Edit Room" allowedRoles={['MANAGER']}>
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft className="h-4 w-4" />}
        onClick={() => router.push('/rooms')}
        className="mb-5"
      >
        Back to Rooms
      </Button>

      {isLoading ? (
        <Spinner size="lg" />
      ) : room ? (
        <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-card)] p-6 max-w-lg">
          <RoomForm
            defaultValues={{
              roomNumber: room.roomNumber,
              roomType: room.roomType,
              floor: room.floor,
              capacity: room.capacity,
              pricePerNight: room.pricePerNight,
              status: room.status,
              description: room.description,
              amenities: room.amenities,
            }}
            onSubmit={handleSubmit}
            isLoading={isSaving}
            submitLabel="Update Room"
          />
        </div>
      ) : (
        <p className="text-[var(--text-muted)]">Room not found.</p>
      )}
    </PageLayout>
  );
}
