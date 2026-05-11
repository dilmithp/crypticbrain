'use client';
import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  registration?: UseFormRegisterReturn;
  placeholder?: string;
  required?: boolean;
}

export function Select({
  label,
  error,
  options,
  registration,
  placeholder,
  required,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
          {label}
          {required && <span className="text-[var(--primary)] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          {...registration}
          {...props}
          className={`
            w-full h-9 rounded-[var(--radius-md)] border px-3 pr-8 text-sm
            bg-[var(--surface)] text-[var(--text-primary)] appearance-none
            transition-all duration-200 outline-none cursor-pointer
            ${error
              ? 'border-[var(--danger)] focus:ring-2 focus:ring-[var(--danger)]/20'
              : 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15'
            }
            ${className}
          `}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-faint)] pointer-events-none" />
      </div>
      {error && <span className="text-xs text-[var(--danger)]">{error}</span>}
    </div>
  );
}
