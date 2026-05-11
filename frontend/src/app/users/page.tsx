'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, UserX } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Table, Column } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/user';
import { ApiResponse } from '@/types/api';

export default function UsersPage() {
  const { token } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deactivateId, setDeactivateId] = useState<number | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi<ApiResponse<User[]>>('/api/users', {}, token);
      setUsers(res.data || []);
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadUsers();
  }, [token]);

  const handleDeactivate = async () => {
    if (!deactivateId) return;
    setIsDeactivating(true);
    try {
      await fetchApi<unknown>(`/api/users/${deactivateId}/deactivate`, { method: 'PUT' }, token);
      setUsers(prev => prev.map(u => u.id === deactivateId ? { ...u, active: false } : u));
      setDeactivateId(null);
      showToast('success', 'User deactivated');
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Failed to deactivate user');
    } finally {
      setIsDeactivating(false);
    }
  };

  const columns: Column<User>[] = [
    { header: 'Name', accessor: u => `${u.firstName} ${u.lastName}` },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: u => <Badge status={u.role} /> },
    {
      header: 'Status',
      accessor: u => (
        <Badge status={u.active ? 'ACTIVE' : 'INACTIVE'} />
      ),
    },
    {
      header: 'Actions',
      accessor: u => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={e => { e.stopPropagation(); router.push(`/users/${u.id}/edit`); }}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-faint)] hover:text-[var(--primary)] hover:bg-[var(--surface-offset)] transition-colors"
            title="Edit user"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          {u.active && (
            <button
              onClick={e => { e.stopPropagation(); setDeactivateId(u.id); }}
              className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-faint)] hover:text-[var(--danger)] hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
              title="Deactivate user"
            >
              <UserX className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageLayout title="Users" allowedRoles={['ADMIN']}>
      <div className="flex justify-end mb-5">
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => router.push('/users/new')}
        >
          Add User
        </Button>
      </div>

      <Table<User>
        columns={columns}
        data={users}
        isLoading={isLoading}
        emptyMessage="No users found."
        keyExtractor={u => u.id}
      />

      <ConfirmDialog
        isOpen={deactivateId !== null}
        title="Deactivate User"
        message="Are you sure you want to deactivate this user? They will no longer be able to log in."
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivateId(null)}
        isLoading={isDeactivating}
        confirmLabel="Deactivate"
        variant="danger"
      />
    </PageLayout>
  );
}
