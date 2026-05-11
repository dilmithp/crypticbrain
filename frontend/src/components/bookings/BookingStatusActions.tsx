'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, LogOut, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Booking } from '@/types/booking';
import { Role } from '@/types/auth';

interface BookingStatusActionsProps {
  booking: Booking;
  userRole: Role;
  onCancel: (reason: string) => Promise<void>;
  onCheckIn: () => Promise<void>;
  onCheckOut: () => Promise<void>;
}

export function BookingStatusActions({
  booking,
  userRole,
  onCancel,
  onCheckIn,
  onCheckOut,
}: BookingStatusActionsProps) {
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const canManage = userRole === 'MANAGER' || userRole === 'RECEPTIONIST';
  if (!canManage) return null;

  const wrap = async (fn: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await fn();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3 flex-wrap">
        {booking.status === 'CONFIRMED' && (
          <>
            <Button
              variant="primary"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              onClick={() => wrap(onCheckIn)}
              loading={isLoading}
            >
              Check In
            </Button>
            <Button
              variant="danger"
              leftIcon={<X className="h-4 w-4" />}
              onClick={() => setShowCancelForm(true)}
            >
              Cancel Booking
            </Button>
          </>
        )}
        {booking.status === 'CHECKED_IN' && (
          <>
            <Button
              variant="outline"
              leftIcon={<LogOut className="h-4 w-4" />}
              onClick={() => wrap(onCheckOut)}
              loading={isLoading}
            >
              Check Out
            </Button>
            <Button
              variant="danger"
              leftIcon={<X className="h-4 w-4" />}
              onClick={() => setShowCancelForm(true)}
            >
              Cancel
            </Button>
          </>
        )}
      </div>

      {showCancelForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-[var(--radius-lg)] border border-[var(--danger)]/30 bg-red-50 dark:bg-red-950/30 p-4 space-y-3"
        >
          <p className="text-sm font-medium text-[var(--danger)]">Cancellation Reason</p>
          <textarea
            value={cancelReason}
            onChange={e => setCancelReason(e.target.value)}
            rows={3}
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--danger)]/30 resize-none placeholder:text-[var(--text-faint)]"
            placeholder="Please provide a reason for cancellation..."
          />
          <div className="flex gap-2">
            <Button
              variant="danger"
              onClick={() => wrap(() => onCancel(cancelReason))}
              loading={isLoading}
              disabled={!cancelReason.trim()}
            >
              Confirm Cancellation
            </Button>
            <Button variant="ghost" onClick={() => setShowCancelForm(false)} disabled={isLoading}>
              Keep Booking
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
