'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, LayoutDashboard, BedDouble, Search, CalendarCheck,
  Users, ClipboardList, LogOut, Menu, X, ChevronLeft,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/types/auth';
import { Badge } from '@/components/ui/Badge';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  allowedRoles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" />, allowedRoles: ['ADMIN', 'MANAGER', 'RECEPTIONIST'] },
  { label: 'Rooms', href: '/rooms', icon: <BedDouble className="h-4 w-4" />, allowedRoles: ['MANAGER', 'RECEPTIONIST'] },
  { label: 'Available Rooms', href: '/rooms/available', icon: <Search className="h-4 w-4" />, allowedRoles: ['MANAGER', 'RECEPTIONIST'] },
  { label: 'Bookings', href: '/bookings', icon: <CalendarCheck className="h-4 w-4" />, allowedRoles: ['MANAGER', 'RECEPTIONIST'] },
  { label: 'Users', href: '/users', icon: <Users className="h-4 w-4" />, allowedRoles: ['ADMIN'] },
  { label: 'Audit Logs', href: '/audit-logs', icon: <ClipboardList className="h-4 w-4" />, allowedRoles: ['ADMIN', 'MANAGER'] },
];

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

interface SidebarContentProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onClose?: () => void;
}

function SidebarContent({ collapsed, onToggleCollapse, onClose }: SidebarContentProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter(item => user && item.allowedRoles.includes(user.role));

  return (
    <div className="flex h-full flex-col" style={{ background: 'var(--sidebar-bg)', color: 'var(--sidebar-text)' }}>
      {/* Logo */}
      <div className={`flex items-center h-14 border-b border-white/5 ${collapsed ? 'justify-center px-2' : 'gap-3 px-5'}`}>
        <div className="p-1.5 bg-[var(--primary)] rounded-[var(--radius-md)] shrink-0">
          <Building2 className="h-4 w-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span
                style={{ fontFamily: 'Instrument Serif, Georgia, serif' }}
                className="text-white text-base font-normal leading-tight"
              >
                Serendib Grand
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-white/50 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {visibleItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                relative flex items-center gap-3 rounded-[var(--radius-md)] transition-all duration-150
                ${collapsed ? 'justify-center px-2 h-10' : 'px-3 h-9'}
                ${isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                }
              `}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[var(--primary)] rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <span className="shrink-0">{item.icon}</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-medium truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user + logout */}
      <div className="border-t border-white/5 p-3 space-y-2">
        {!onClose && (
          <button
            onClick={onToggleCollapse}
            className={`flex items-center gap-2 w-full px-2 h-8 rounded-[var(--radius-md)] text-white/40 hover:text-white/70 hover:bg-white/5 transition-all ${collapsed ? 'justify-center' : ''}`}
          >
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>
        )}
        {user && (
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="h-8 w-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-xs font-semibold text-white shrink-0">
              {getInitials(user.fullName)}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-xs font-medium text-white truncate">{user.fullName}</p>
                  <Badge status={user.role} className="mt-0.5" />
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={logout}
              className="text-white/40 hover:text-white/80 transition-colors shrink-0"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = collapsed ? 60 : 240;

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] text-[var(--text-muted)] md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-64"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            >
              <SidebarContent
                collapsed={false}
                onToggleCollapse={() => {}}
                onClose={() => setMobileOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.div
        className="hidden md:flex flex-col fixed inset-y-0 left-0 z-30"
        animate={{ width: sidebarWidth }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(c => !c)}
        />
      </motion.div>

      {/* Spacer to push content */}
      <motion.div
        className="hidden md:block shrink-0"
        animate={{ width: sidebarWidth }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      />
    </>
  );
}
