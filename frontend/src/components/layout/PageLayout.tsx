'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ProtectedRoute } from './ProtectedRoute';
import { Role } from '@/types/auth';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function PageLayout({ title, children, allowedRoles }: PageLayoutProps) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="flex min-h-screen bg-[var(--bg)]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header title={title} />
          <motion.main
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 p-6 overflow-y-auto"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
