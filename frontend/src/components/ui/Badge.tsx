'use client';
import React from 'react';

type BadgeVariant = 'green' | 'red' | 'yellow' | 'blue' | 'gray' | 'purple' | 'teal' | 'orange';

const STATUS_MAP: Record<string, BadgeVariant> = {
  AVAILABLE: 'green', CONFIRMED: 'green', CHECKED_IN: 'green', ACTIVE: 'green',
  OCCUPIED: 'red', CANCELLED: 'red', INACTIVE: 'gray',
  CLEANING: 'yellow',
  UNDER_MAINTENANCE: 'orange',
  CHECKED_OUT: 'blue',
  ADMIN: 'purple',
  MANAGER: 'blue',
  RECEPTIONIST: 'teal',
  CREATE: 'green', BOOKING_CREATED: 'green',
  UPDATE: 'yellow', ROLE_CHANGED: 'purple',
  CANCEL: 'red', BOOKING_CANCELLED: 'red',
  SINGLE: 'blue', DOUBLE: 'teal', SUITE: 'purple', DELUXE: 'orange',
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
  red: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
  yellow: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  blue: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
  gray: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
  purple: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
  teal: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800',
  orange: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800',
};

interface BadgeProps {
  status: string;
  className?: string;
}

export function Badge({ status, className = '' }: BadgeProps) {
  const variant = STATUS_MAP[status] || 'gray';
  const label = status.replace(/_/g, ' ');

  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
      tracking-wide border transition-colors duration-300
      ${VARIANT_CLASSES[variant]} ${className}
    `}>
      {label}
    </span>
  );
}
