'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';

export function Header({ title }: { title?: string }) {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-20">
      <h1
        style={{ fontFamily: 'Instrument Serif, Georgia, serif' }}
        className="text-xl font-normal text-[var(--text-primary)]"
      >
        {title}
      </h1>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-[var(--radius-md)] text-[var(--text-faint)] hover:text-[var(--text-muted)] hover:bg-[var(--surface-offset)] transition-colors">
          <Bell className="h-4 w-4" />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-[var(--radius-md)] text-[var(--text-faint)] hover:text-[var(--text-muted)] hover:bg-[var(--surface-offset)] transition-colors"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <motion.div
            key={isDark ? 'moon' : 'sun'}
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </motion.div>
        </button>

        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-[var(--border)]">
            <span className="text-sm text-[var(--text-muted)] hidden sm:block">{user.fullName}</span>
            <Badge status={user.role} />
          </div>
        )}
      </div>
    </header>
  );
}
