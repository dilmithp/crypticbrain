'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { User, UserCreateRequest } from '@/types/user';
import { ApiResponse } from '@/types/api';

const roleOptions = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'RECEPTIONIST', label: 'Receptionist' },
];

export default function NewUserPage() {
  const router = useRouter();
  const { token } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<UserCreateRequest>();

  const onSubmit = async (data: UserCreateRequest) => {
    setIsLoading(true);
    try {
      await fetchApi<ApiResponse<User>>('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
      }, token);
      showToast('success', 'User created successfully!');
      router.push('/users');
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout title="Add New User" allowedRoles={['ADMIN']}>
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft className="h-4 w-4" />}
        onClick={() => router.push('/users')}
        className="mb-5"
      >
        Back to Users
      </Button>

      <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-card)] p-6 max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              registration={register('firstName', { required: 'First name is required' })}
              error={errors.firstName?.message}
              placeholder="Nuwan"
              required
            />
            <Input
              label="Last Name"
              registration={register('lastName', { required: 'Last name is required' })}
              error={errors.lastName?.message}
              placeholder="Perera"
              required
            />
          </div>
          <Input
            label="Email"
            type="email"
            registration={register('email', { required: 'Email is required' })}
            error={errors.email?.message}
            placeholder="nuwan.perera@serendibgrand.lk"
            required
          />
          <Input
            label="Password"
            type="password"
            registration={register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
            error={errors.password?.message}
            placeholder="••••••••"
            required
          />
          <Select
            label="Role"
            options={roleOptions}
            registration={register('role', { required: 'Role is required' })}
            error={errors.role?.message}
            placeholder="Select role"
            required
          />
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={isLoading}>
              Create User
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.push('/users')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
