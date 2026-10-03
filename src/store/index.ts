import { create } from 'zustand'
import { persist } from 'zustand/middleware'
type Auth = { user: { name: string; role: 'User' | 'Admin' } | null; login: (email: string) => void; logout: () => void }
export const useAuth = create<Auth>()(persist((set) => ({
  user: null,
  login: (email) => set({ user: { name: email.split('@')[0], role: email.includes('admin') ? 'Admin' : 'User' } }),
  logout: () => set({ user: null }),
}), { name: 'finora-auth' }))
export const useTheme = create<{ dark: boolean; toggle: () => void }>()(persist((set, get) => ({ dark: false, toggle: () => set({ dark: !get().dark }) }), { name: 'finora-theme' }))
type B = { name: string; iban: string }
export const useBenef = create<{ list: B[]; add: (b: B) => void }>()(persist((set) => ({ list: [{ name: 'Ayesha Khan', iban: 'PK36SCBL0000001123456702' }], add: (b) => set((s) => ({ list: [...s.list, b] })) }), { name: 'finora-benef' }))
export const useCurrency = create<{ cur: 'USD' | 'PKR'; set: (c: 'USD' | 'PKR') => void }>()(persist((set) => ({ cur: 'USD', set: (cur) => set({ cur }) }), { name: 'finora-currency' }))
import { convert, fee, type Cur } from '@/utils/fx'
type Acc = { id: string; name: string; cur: Cur; bal: number }
export const useAccounts = create<{ list: Acc[]; log: string[]; move: (from: string, to: string, amt: number) => string | null }>()(persist((set, get) => ({
  list: [{ id: 'chk', name: 'Checking', cur: 'USD', bal: 4200 }, { id: 'sav', name: 'Savings', cur: 'USD', bal: 9800 }, { id: 'pk', name: 'PKR Wallet', cur: 'PKR', bal: 150000 }], log: [],
  move: (from, to, amt) => {
    const s = get(); const a = s.list.find((x) => x.id === from); const b = s.list.find((x) => x.id === to)
    if (!a || !b || from === to) return 'Choose two different accounts.'
    if (!(amt > 0)) return 'Enter an amount above 0.'
    if (amt > a.bal) return 'Insufficient funds in ' + a.name + '.'
    const credit = convert(amt - fee(amt, a.cur, b.cur), a.cur, b.cur)
    set({ list: s.list.map((x) => (x.id === from ? { ...x, bal: x.bal - amt } : x.id === to ? { ...x, bal: x.bal + credit } : x)), log: [`${a.name} to ${b.name}: ${amt} ${a.cur}`, ...s.log].slice(0, 8) })
    return null
  },
}), { name: 'finora-accounts' }))
type Bill = { id: number; name: string; amount: number; day: number; paused: boolean }
export const useBills = create<{ list: Bill[]; add: (b: Omit<Bill, 'id' | 'paused'>) => void; toggle: (id: number) => void; remove: (id: number) => void }>()(persist((set) => ({
  list: [{ id: 1, name: 'Netflix', amount: 15.99, day: 5, paused: false }, { id: 2, name: 'Internet', amount: 40, day: 12, paused: false }, { id: 3, name: 'Gym', amount: 25, day: 28, paused: true }],
  add: (b) => set((s) => ({ list: [...s.list, { ...b, id: Date.now(), paused: false }] })),
  toggle: (id) => set((s) => ({ list: s.list.map((x) => (x.id === id ? { ...x, paused: !x.paused } : x)) })),
  remove: (id) => set((s) => ({ list: s.list.filter((x) => x.id !== id) })),
}), { name: 'finora-bills' }))
