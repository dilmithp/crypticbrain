'use client';
import React, { useEffect, useRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  registration?: UseFormRegisterReturn;
  required?: boolean;
  leftIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  hint,
  registration,
  required,
  leftIcon,
  className = '',
  ...props
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error && inputRef.current) {
      inputRef.current.classList.add('shake');
      const timer = setTimeout(() => inputRef.current?.classList.remove('shake'), 400);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
          {label}
          {required && <span className="text-[var(--primary)] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]">
            {leftIcon}
          </div>
        )}
        <input
          ref={inputRef}
          {...registration}
          {...props}
          className={`
            w-full h-9 rounded-[var(--radius-md)] border text-sm bg-[var(--surface)]
            text-[var(--text-primary)] placeholder:text-[var(--text-faint)]
            transition-all duration-200 outline-none
            ${leftIcon ? 'pl-9 pr-3' : 'px-3'}
            ${error
              ? 'border-[var(--danger)] focus:ring-2 focus:ring-[var(--danger)]/20'
              : 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15'
            }
            ${className}
          `}
          style={{ borderColor: error ? 'var(--danger)' : undefined }}
        />
      </div>
      {error && (
        <span className="text-xs text-[var(--danger)] flex items-center gap-1">{error}</span>
      )}
      {hint && !error && (
        <span className="text-xs text-[var(--text-faint)]">{hint}</span>
      )}
    </div>
  );
}
