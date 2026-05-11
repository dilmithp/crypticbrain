'use client';
import React from 'react';
import { motion } from 'framer-motion';

export function Spinner({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeMap = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };

  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <motion.div
        className={`${sizeMap[size]} rounded-full border-2 border-[var(--surface-offset)] border-t-[var(--primary)]`}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
