import { Room } from './room';
import { AuthUser } from './auth';

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'CHECKED_IN' | 'CHECKED_OUT';

export interface Booking {
  id: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  room: Room;
  checkInDate: string;
  checkOutDate: string;
  status: BookingStatus;
  totalPrice: number;
  bookedBy: AuthUser;
  cancelledBy?: AuthUser;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingCreateRequest {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
}

export interface BookingCancelRequest {
  cancellationReason: string;
}
