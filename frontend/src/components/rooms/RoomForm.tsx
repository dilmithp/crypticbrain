'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { RoomCreateRequest } from '@/types/room';

interface RoomFormProps {
  defaultValues?: Partial<RoomCreateRequest>;
  onSubmit: (data: RoomCreateRequest) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

const roomTypeOptions = [
  { value: 'SINGLE', label: 'Single' },
  { value: 'DOUBLE', label: 'Double' },
  { value: 'SUITE', label: 'Suite' },
  { value: 'DELUXE', label: 'Deluxe' },
];

const roomStatusOptions = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'OCCUPIED', label: 'Occupied' },
  { value: 'UNDER_MAINTENANCE', label: 'Under Maintenance' },
  { value: 'CLEANING', label: 'Cleaning' },
];

export function RoomForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = 'Save Room',
}: RoomFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomCreateRequest>({
    defaultValues: defaultValues || { status: 'AVAILABLE' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <Input
        label="Room Number"
        registration={register('roomNumber', { required: 'Room number is required' })}
        error={errors.roomNumber?.message}
        placeholder="e.g. 101"
      />
      <Select
        label="Room Type"
        options={roomTypeOptions}
        registration={register('roomType', { required: 'Room type is required' })}
        error={errors.roomType?.message}
        placeholder="Select type"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Floor"
          type="number"
          registration={register('floor', {
            required: 'Floor is required',
            valueAsNumber: true,
            min: { value: 1, message: 'Floor must be at least 1' },
          })}
          error={errors.floor?.message}
        />
        <Input
          label="Capacity (guests)"
          type="number"
          registration={register('capacity', {
            required: 'Capacity is required',
            valueAsNumber: true,
            min: { value: 1, message: 'Capacity must be at least 1' },
          })}
          error={errors.capacity?.message}
        />
      </div>
      <Input
        label="Price Per Night ($)"
        type="number"
        step="0.01"
        registration={register('pricePerNight', {
          required: 'Price is required',
          valueAsNumber: true,
          min: { value: 0.01, message: 'Price must be positive' },
        })}
        error={errors.pricePerNight?.message}
      />
      <Select
        label="Status"
        options={roomStatusOptions}
        registration={register('status')}
        error={errors.status?.message}
      />
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="room-description"
          className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide"
        >
          Description
        </label>
        <textarea
          id="room-description"
          {...register('description')}
          rows={3}
          className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all resize-none"
          placeholder="Optional notes about the room"
        />
      </div>
      <Input
        label="Amenities"
        registration={register('amenities')}
        placeholder="e.g. WiFi, AC, Sea View"
      />
      <Button type="submit" loading={isLoading}>
        {submitLabel}
      </Button>
    </form>
  );
}
