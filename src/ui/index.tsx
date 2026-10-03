import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react'
export const cn = (...i: ClassValue[]) => twMerge(clsx(i))
export const Button = ({ className, variant = 'primary', ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }) => (
  <button {...p} className={cn('rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-brand-500 disabled:opacity-50',
    variant === 'primary' ? 'bg-brand-500 text-white hover:bg-brand-600' : 'border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800', className)} />
)
export const Card = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn('rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900', className)}>{children}</div>
)
export const Badge = ({ tone, children }: { tone: 'green' | 'amber' | 'red' | 'slate'; children: ReactNode }) => (
  <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', { green: 'bg-emerald-100 text-emerald-700', amber: 'bg-amber-100 text-amber-700', red: 'bg-red-100 text-red-700', slate: 'bg-slate-100 text-slate-700' }[tone])}>{children}</span>
)
export const Skeleton = ({ className }: { className?: string }) => <div className={cn('animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800', className)} />
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }>(({ label, error, ...p }, ref) => (
  <label className="block text-sm font-medium">{label}
    <input ref={ref} {...p} className="mt-1 w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" />
    {error && <span className="text-xs text-expense">{error}</span>}
  </label>
))
