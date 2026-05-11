'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface ToastContextType {
  showToast: (type: 'success' | 'error', message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 64, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 64, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`
                pointer-events-auto flex items-start gap-3 min-w-72 max-w-sm p-4
                bg-[var(--surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-floating)]
                border border-[var(--border)] border-l-4
                ${toast.type === 'success' ? 'border-l-[var(--success)]' : 'border-l-[var(--danger)]'}
              `}
            >
              {toast.type === 'success'
                ? <CheckCircle className="h-5 w-5 text-[var(--success)] shrink-0 mt-0.5" />
                : <XCircle className="h-5 w-5 text-[var(--danger)] shrink-0 mt-0.5" />
              }
              <p className="text-sm text-[var(--text-primary)] flex-1">{toast.message}</p>
              <button
                onClick={() => remove(toast.id)}
                className="text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
