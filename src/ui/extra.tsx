import { useEffect, type ReactNode } from 'react'
import { create } from 'zustand'
import { cn } from '@/ui'
export const useToast = create<{ msgs: { id: number; text: string }[]; push: (t: string) => void }>((set) => ({
  msgs: [],
  push: (text) => { const id = Date.now() + Math.random(); set((s) => ({ msgs: [...s.msgs, { id, text }] })); setTimeout(() => set((s) => ({ msgs: s.msgs.filter((m) => m.id !== id) })), 3000) },
}))
export const Toaster = () => { const m = useToast((s) => s.msgs); return <div role="status" className="fixed bottom-4 right-4 z-50 space-y-2">{m.map((x) => <div key={x.id} className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">{x.text}</div>)}</div> }
export const Modal = ({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) => {
  useEffect(() => { const f = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f) }, [onClose])
  if (!open) return null
  return <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4" onClick={onClose}>
    <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()} className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6 dark:bg-slate-900"><h2 className="text-lg font-bold">{title}</h2>{children}</div></div>
}
export const Tabs = ({ tabs, value, onChange }: { tabs: string[]; value: string; onChange: (t: string) => void }) => (
  <div role="tablist" className="flex gap-1 border-b border-slate-200 dark:border-slate-800">{tabs.map((t) => <button key={t} role="tab" aria-selected={t === value} onClick={() => onChange(t)} className={cn('px-4 py-2 text-sm font-medium', t === value ? 'border-b-2 border-brand-500 text-brand-500' : 'text-slate-500')}>{t}</button>)}</div>
)
