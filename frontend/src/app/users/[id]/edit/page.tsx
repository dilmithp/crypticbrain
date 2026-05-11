'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Info } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Spinner } from '@/components/ui/Spinner';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { User, UserUpdateRequest } from '@/types/user';
import { ApiResponse } from '@/types/api';

const roleOptions = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'RECEPTIONIST', label: 'Receptionist' },
];

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { token, user: currentUser } = useAuth();
  const { showToast } = useToast();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isAdmin = currentUser?.role === 'ADMIN';

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserUpdateRequest>();

  useEffect(() => {
    if (!token || !userId) return;
    fetchApi<ApiResponse<User>>(`/api/users/${userId}`, {}, token)
      .then(res => {
        setUser(res.data);
        reset({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          role: res.data.role,
        });
      })
      .catch(err => showToast('error', err instanceof Error ? err.message : 'Failed to load user'))
      .finally(() => setIsLoading(false));
  }, [token, userId, reset]);

  const onSubmit = async (data: UserUpdateRequest) => {
    setIsSaving(true);
    const payload: UserUpdateRequest = isAdmin ? data : { role: data.role };
    try {
      await fetchApi<ApiResponse<User>>(`/api/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }, token);
      showToast('success', 'User updated successfully!');
      router.push('/users');
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageLayout title="Edit User" allowedRoles={['ADMIN', 'MANAGER']}>
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft className="h-4 w-4" />}
        onClick={() => router.push('/users')}
        className="mb-5"
      >
        Back to Users
      </Button>

      {isLoading ? (
        <Spinner size="lg" />
      ) : user ? (
        <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-card)] p-6 max-w-lg">
          {!isAdmin && (
            <div className="flex items-start gap-2 mb-5 p-3 rounded-[var(--radius-md)] bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-sm text-[var(--info)]">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <span>As a Manager, you can only change the user&apos;s role.</span>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {isAdmin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    registration={register('firstName', { required: 'First name is required' })}
                    error={errors.firstName?.message}
                    required
                  />
                  <Input
                    label="Last Name"
                    registration={register('lastName', { required: 'Last name is required' })}
                    error={errors.lastName?.message}
                    required
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  registration={register('email', { required: 'Email is required' })}
                  error={errors.email?.message}
                  required
                />
                <Input
                  label="New Password"
                  type="password"
                  registration={register('password')}
                  error={errors.password?.message}
                  placeholder="Leave blank to keep current"
                  hint="Leave blank to keep the current password"
                />
              </>
            )}
            <Select
              label="Role"
              options={roleOptions}
              registration={register('role', { required: 'Role is required' })}
              error={errors.role?.message}
              required
            />
            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={isSaving}>
                Save Changes
              </Button>
              <Button type="button" variant="ghost" onClick={() => router.push('/users')}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <p className="text-[var(--text-muted)]">User not found.</p>
      )}
    </PageLayout>
  );
}
