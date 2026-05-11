'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { BookingCreateRequest } from '@/types/booking';
import { Room } from '@/types/room';
import { fetchApi } from '@/lib/api';
import { ApiResponse } from '@/types/api';
import { useAuth } from '@/hooks/useAuth';

interface BookingFormProps {
  onSubmit: (data: BookingCreateRequest) => Promise<void>;
  isLoading?: boolean;
  preselectedRoomId?: number;
  preselectedRoomNumber?: string;
}

export function BookingForm({
  onSubmit,
  isLoading,
  preselectedRoomId,
  preselectedRoomNumber,
}: BookingFormProps) {
  const { token } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BookingCreateRequest>({
    defaultValues: preselectedRoomId ? { roomId: preselectedRoomId } : undefined,
  });

  useEffect(() => {
    if (!preselectedRoomId) {
      fetchApi<ApiResponse<Room[]>>('/api/rooms', {}, token)
        .then(res => setRooms(res.data))
        .catch(() => {});
    }
    if (preselectedRoomId) {
      setValue('roomId', preselectedRoomId);
    }
  }, [preselectedRoomId, token, setValue]);

  const roomOptions = rooms.map(r => ({
    value: String(r.id),
    label: `Room ${r.roomNumber} (${r.roomType}) - $${r.pricePerNight}/night`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      {preselectedRoomId ? (
        <div>
          <label className="text-sm font-medium text-gray-700">Room</label>
          <p className="mt-1 text-sm text-gray-800 font-semibold">Room {preselectedRoomNumber}</p>
          <input type="hidden" {...register('roomId', { valueAsNumber: true })} value={preselectedRoomId} />
        </div>
      ) : (
        <Select
          label="Select Room"
          options={roomOptions}
          registration={register('roomId', {
            required: 'Please select a room',
            valueAsNumber: true,
          })}
          error={errors.roomId?.message}
          placeholder="Choose a room..."
        />
      )}
      <Input
        label="Guest Name"
        registration={register('guestName', { required: 'Guest name is required' })}
        error={errors.guestName?.message}
        placeholder="Full name"
      />
      <Input
        label="Guest Email"
        type="email"
        registration={register('guestEmail', { required: 'Guest email is required' })}
        error={errors.guestEmail?.message}
        placeholder="guest@email.com"
      />
      <Input
        label="Guest Phone"
        registration={register('guestPhone', { required: 'Guest phone is required' })}
        error={errors.guestPhone?.message}
        placeholder="+1234567890"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Check-In Date"
          type="date"
          registration={register('checkInDate', { required: 'Check-in date is required' })}
          error={errors.checkInDate?.message}
        />
        <Input
          label="Check-Out Date"
          type="date"
          registration={register('checkOutDate', { required: 'Check-out date is required' })}
          error={errors.checkOutDate?.message}
        />
      </div>
      <Button type="submit" loading={isLoading}>
        Confirm Booking
      </Button>
    </form>
  );
}
