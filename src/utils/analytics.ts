import type { Tx } from '@/services/api'
export const mean = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0)
export const stdev = (a: number[]) => { const m = mean(a); return Math.sqrt(mean(a.map((x) => (x - m) ** 2))) }
export const anomalies = (tx: Tx[]) => { const e = tx.filter((t) => t.type === 'expense'); const a = e.map((t) => t.amount); return e.filter((t) => t.amount > mean(a) + 1.5 * stdev(a)) }
export const forecastMonth = (spent: number, day: number, days = 30) => (day <= 0 ? 0 : (spent / day) * days)
export const byCategory = (tx: Tx[]) => Object.entries(tx.filter((t) => t.type === 'expense').reduce<Record<string, number>>((m, t) => ({ ...m, [t.category]: (m[t.category] ?? 0) + t.amount }), {})).sort((a, b) => b[1] - a[1])
export const nextDue = (day: number, from = new Date()) => { const today = new Date(from.getFullYear(), from.getMonth(), from.getDate()); const d = new Date(from.getFullYear(), from.getMonth(), day); if (d < today) d.setMonth(d.getMonth() + 1); return d }
export const daysUntil = (d: Date, from = new Date()) => Math.round((d.getTime() - new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime()) / 864e5)
