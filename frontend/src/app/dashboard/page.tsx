'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BedDouble, CheckCircle2, Calendar, TrendingUp } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { CardSkeleton } from '@/components/ui/SkeletonLoader';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Room } from '@/types/room';
import { Booking } from '@/types/booking';
import { ApiResponse } from '@/types/api';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  delay: number;
}

function StatCard({ title, value, subtitle, icon, iconBg, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-card)] p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">{title}</p>
        <div className={`p-2.5 rounded-[var(--radius-lg)] ${iconBg}`}>{icon}</div>
      </div>
      <p className="text-3xl font-semibold text-[var(--text-primary)] tabular-nums">{value}</p>
      <p className="text-xs text-[var(--text-faint)] mt-1.5">{subtitle}</p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [roomsRes, bookingsRes] = await Promise.all([
          fetchApi<ApiResponse<Room[]>>('/api/rooms', {}, token),
          fetchApi<ApiResponse<Booking[]>>('/api/bookings', {}, token),
        ]);
        setRooms(roomsRes.data || []);
        setBookings(bookingsRes.data || []);
      } catch {
        // silently handle — some endpoints may not be accessible for all roles
      } finally {
        setIsLoading(false);
      }
    };
    if (token) load();
  }, [token]);

  const today = new Date().toISOString().split('T')[0];
  const available = rooms.filter(r => r.status === 'AVAILABLE').length;
  const todayCheckIns = bookings.filter(b => b.checkInDate === today && b.status === 'CONFIRMED').length;
  const active = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN').length;
  const recentBookings = [...bookings].sort((a, b) => b.id - a.id).slice(0, 5);
  const occupancyPct = rooms.length ? Math.round(((rooms.length - available) / rooms.length) * 100) : 0;

  return (
    <PageLayout title="Dashboard">
      {isLoading ? (
        <CardSkeleton count={4} />
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatCard
              title="Total Rooms"
              value={rooms.length}
              subtitle={`${occupancyPct}% occupied`}
              icon={<BedDouble className="h-5 w-5 text-blue-600" />}
              iconBg="bg-blue-50 dark:bg-blue-950"
              delay={0}
            />
            <StatCard
              title="Available"
              value={available}
              subtitle="Ready to book"
              icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
              iconBg="bg-emerald-50 dark:bg-emerald-950"
              delay={0.06}
            />
            <StatCard
              title="Today's Check-ins"
              value={todayCheckIns}
              subtitle="Arriving today"
              icon={<Calendar className="h-5 w-5 text-purple-600" />}
              iconBg="bg-purple-50 dark:bg-purple-950"
              delay={0.12}
            />
            <StatCard
              title="Active Bookings"
              value={active}
              subtitle="Confirmed + checked in"
              icon={<TrendingUp className="h-5 w-5 text-orange-600" />}
              iconBg="bg-orange-50 dark:bg-orange-950"
              delay={0.18}
            />
          </div>

          {/* Bottom grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Recent bookings */}
            <div className="lg:col-span-3">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Recent Bookings</h2>
              <Table
                columns={[
                  { header: 'Guest', accessor: (b: Booking) => <span className="font-medium">{b.guestName}</span> },
                  { header: 'Room', accessor: (b: Booking) => b.room?.roomNumber || '—' },
                  { header: 'Check-in', accessor: (b: Booking) => b.checkInDate },
                  { header: 'Status', accessor: (b: Booking) => <Badge status={b.status} /> },
                ]}
                data={recentBookings}
                keyExtractor={b => b.id}
              />
            </div>

            {/* Room status breakdown */}
            <div className="lg:col-span-2">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Room Status</h2>
              <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-card)] p-5 space-y-4">
                {(['AVAILABLE', 'OCCUPIED', 'CLEANING', 'UNDER_MAINTENANCE'] as const).map(status => {
                  const count = rooms.filter(r => r.status === status).length;
                  const pct = rooms.length ? Math.round((count / rooms.length) * 100) : 0;
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-1.5">
                        <Badge status={status} />
                        <span className="text-sm font-medium text-[var(--text-primary)]">{count}</span>
                      </div>
                      <div className="h-1.5 bg-[var(--surface-offset)] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[var(--primary)] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </PageLayout>
  );
}
