'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { RoomCard } from '@/components/rooms/RoomCard';
import { BookingForm } from '@/components/bookings/BookingForm';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/SkeletonLoader';
import { useToast } from '@/components/ui/Toast';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Room } from '@/types/room';
import { Booking, BookingCreateRequest } from '@/types/booking';
import { ApiResponse } from '@/types/api';

interface SearchForm {
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  floor: string;
  minCapacity: string;
}

const roomTypeOptions = [
  { value: 'SINGLE', label: 'Single' },
  { value: 'DOUBLE', label: 'Double' },
  { value: 'SUITE', label: 'Suite' },
  { value: 'DELUXE', label: 'Deluxe' },
];

export default function AvailableRoomsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SearchForm>();

  const onSearch = async (data: SearchForm) => {
    setIsLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (data.checkInDate) params.set('checkInDate', data.checkInDate);
      if (data.checkOutDate) params.set('checkOutDate', data.checkOutDate);
      if (data.roomType) params.set('roomType', data.roomType);
      if (data.floor) params.set('floor', data.floor);
      if (data.minCapacity) params.set('minCapacity', data.minCapacity);
      const query = params.toString();
      const endpoint = `/api/rooms/available${query ? `?${query}` : ''}`;
      const res = await fetchApi<ApiResponse<Room[]>>(endpoint, {}, token);
      setRooms(res.data || []);
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Failed to search rooms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBook = async (data: BookingCreateRequest) => {
    setIsBooking(true);
    try {
      await fetchApi<ApiResponse<Booking>>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      }, token);
      showToast('success', 'Booking confirmed successfully!');
      setSelectedRoom(null);
      router.push('/bookings');
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <PageLayout title="Available Rooms" allowedRoles={['MANAGER', 'RECEPTIONIST']}>
      {/* Search form */}
      <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-card)] p-5 mb-6">
        <form onSubmit={handleSubmit(onSearch)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Check-In Date"
            type="date"
            registration={register('checkInDate', { required: 'Check-in date is required' })}
            error={errors.checkInDate?.message}
            required
          />
          <Input
            label="Check-Out Date"
            type="date"
            registration={register('checkOutDate', { required: 'Check-out date is required' })}
            error={errors.checkOutDate?.message}
            required
          />
          <Select
            label="Room Type (optional)"
            options={roomTypeOptions}
            registration={register('roomType')}
            placeholder="Any type"
          />
          <Input
            label="Floor (optional)"
            type="number"
            registration={register('floor')}
            placeholder="e.g. 2"
          />
          <Input
            label="Min Capacity (optional)"
            type="number"
            registration={register('minCapacity')}
            placeholder="e.g. 2"
          />
          <div className="flex items-end">
            <Button type="submit" loading={isLoading} leftIcon={<Search className="h-4 w-4" />} className="w-full">
              Search
            </Button>
          </div>
        </form>
      </div>

      {/* Results */}
      {isLoading ? (
        <CardSkeleton count={6} />
      ) : searched ? (
        rooms.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-muted)]">
            <p className="text-sm">No available rooms found for your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {rooms.map(room => (
              <RoomCard key={room.id} room={room} onBook={setSelectedRoom} />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16 text-[var(--text-faint)]">
          <p className="text-sm">Use the search form above to find available rooms.</p>
        </div>
      )}

      {/* Booking slide-over panel */}
      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSelectedRoom(null)}
            />
            <motion.div
              className="relative w-full max-w-md bg-[var(--surface)] h-full shadow-[var(--shadow-floating)] overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            >
              <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
                <div>
                  <h2
                    style={{ fontFamily: 'Instrument Serif, Georgia, serif' }}
                    className="text-xl font-normal text-[var(--text-primary)]"
                  >
                    Book Room {selectedRoom.roomNumber}
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {selectedRoom.roomType} · Floor {selectedRoom.floor} · ${selectedRoom.pricePerNight}/night
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="p-2 rounded-[var(--radius-md)] text-[var(--text-faint)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-offset)] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-5">
                <BookingForm
                  onSubmit={handleBook}
                  isLoading={isBooking}
                  preselectedRoomId={selectedRoom.id}
                  preselectedRoomNumber={selectedRoom.roomNumber}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
