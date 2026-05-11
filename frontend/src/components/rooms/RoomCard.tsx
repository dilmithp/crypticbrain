'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Layers } from 'lucide-react';
import { Room } from '@/types/room';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface RoomCardProps {
  room: Room;
  onBook?: (room: Room) => void;
}

export function RoomCard({ room, onBook }: RoomCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: 'var(--shadow-elevated)' }}
      transition={{ duration: 0.2 }}
      className="bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-card)] p-5 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <Badge status={room.roomType} className="text-[10px]" />
        <Badge status={room.status} />
      </div>

      {/* Room number */}
      <div
        style={{ fontFamily: 'Instrument Serif, Georgia, serif' }}
        className="text-4xl font-normal text-[var(--text-primary)] mb-1"
      >
        {room.roomNumber}
      </div>
      <p className="text-xs text-[var(--text-muted)] mb-4">Floor {room.floor}</p>

      {/* Details */}
      <div className="space-y-2 mb-5 flex-1">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Users className="h-3.5 w-3.5 text-[var(--text-faint)]" />
          <span>Up to {room.capacity} guests</span>
        </div>
        {room.amenities && (
          <div className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
            <Layers className="h-3.5 w-3.5 text-[var(--text-faint)] mt-0.5 shrink-0" />
            <span className="text-xs line-clamp-2">{room.amenities}</span>
          </div>
        )}
        <div className="flex items-center gap-1 pt-1">
          <span className="text-xl font-semibold text-[var(--text-primary)]">${room.pricePerNight}</span>
          <span className="text-xs text-[var(--text-muted)]">/ night</span>
        </div>
      </div>

      {onBook ? (
        <Button onClick={() => onBook(room)} className="w-full">
          Book Now
        </Button>
      ) : (
        <Link href={`/bookings/new?roomId=${room.id}&roomNumber=${room.roomNumber}`}>
          <Button className="w-full">Book Now</Button>
        </Link>
      )}
    </motion.div>
  );
}
