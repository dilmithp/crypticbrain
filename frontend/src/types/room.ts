export type RoomType = 'SINGLE' | 'DOUBLE' | 'SUITE' | 'DELUXE';
export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'UNDER_MAINTENANCE' | 'CLEANING';

export interface Room {
  id: number;
  roomNumber: string;
  roomType: RoomType;
  floor: number;
  capacity: number;
  pricePerNight: number;
  status: RoomStatus;
  description?: string;
  amenities?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomCreateRequest {
  roomNumber: string;
  roomType: RoomType;
  floor: number;
  capacity: number;
  pricePerNight: number;
  status?: RoomStatus;
  description?: string;
  amenities?: string;
}

export interface RoomUpdateRequest {
  roomNumber?: string;
  roomType?: RoomType;
  floor?: number;
  capacity?: number;
  pricePerNight?: number;
  status?: RoomStatus;
  description?: string;
  amenities?: string;
}
