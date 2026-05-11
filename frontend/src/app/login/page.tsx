'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Sun, Moon } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { LoginRequest, LoginResponse } from '@/types/auth';
import { ApiResponse } from '@/types/api';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetchApi<ApiResponse<LoginResponse>>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      login(response.data);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen login-bg flex items-center justify-center p-4">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shadow-[var(--shadow-card)]"
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

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-floating)] p-8">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[var(--primary)] rounded-[var(--radius-xl)] mb-4">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <h1
              style={{ fontFamily: 'Instrument Serif, Georgia, serif' }}
              className="text-2xl font-normal text-[var(--text-primary)]"
            >
              Serendib Grand
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">Staff Portal</p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className="rounded-[var(--radius-md)] bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-[var(--danger)]"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              registration={register('email', { required: 'Email is required' })}
              error={errors.email?.message}
              placeholder="nuwan.perera@serendibgrand.lk"
              required
            />
            <Input
              label="Password"
              type="password"
              registration={register('password', { required: 'Password is required' })}
              error={errors.password?.message}
              placeholder="••••••••"
              required
            />
            <Button type="submit" loading={isLoading} className="w-full h-10 mt-2">
              Sign In
            </Button>
          </form>
        </div>
        <p className="text-center text-xs text-[var(--text-faint)] mt-4">
          Serendib Grand Hotel — Staff Management System
        </p>
      </motion.div>
    </div>
  );
}
