'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white',
  secondary: 'bg-[var(--surface-offset)] hover:bg-[var(--border)] text-[var(--text-primary)] border border-[var(--border)]',
  danger: 'bg-[var(--danger)] hover:opacity-90 text-white',
  ghost: 'bg-transparent hover:bg-[var(--surface-offset)] text-[var(--text-muted)] hover:text-[var(--text-primary)]',
  outline: 'bg-transparent border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-7 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-base gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  children,
  className = '',
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
      {...(props as any)}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium rounded-[var(--radius-md)]
        transition-all duration-150 focus:outline-none focus-visible:ring-2
        focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed select-none
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </motion.button>
  );
}
