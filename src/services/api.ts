export type Tx = { id: string; title: string; amount: number; type: 'income' | 'expense'; category: string; date: string; status: 'completed' | 'pending' }
const cats = ['Food', 'Rent', 'Shopping', 'Travel', 'Bills']
const names = ['Grocery', 'Netflix', 'Uber', 'Amazon', 'Electric bill']
let txs: Tx[] = Array.from({ length: 40 }, (_, i) => {
  const inc = i % 8 === 0
  return { id: 't' + i, title: inc ? 'Salary' : names[i % 5], amount: inc ? 3200 : +(20 + ((i * 37) % 180)).toFixed(2),
    type: inc ? 'income' : 'expense', category: inc ? 'Salary' : cats[i % 5],
    date: new Date(2026, 8, 1 + (i % 28)).toISOString().slice(0, 10), status: i % 9 === 0 ? 'pending' : 'completed' } as Tx
})
const wait = (ms = 500) => new Promise((r) => setTimeout(r, ms))
export const api = {
  transactions: async () => { await wait(); return txs },
  transfer: async (d: { to: string; amount: number }) => {
    await wait(900)
    if (d.amount > 5000) throw new Error('Amount is above your 5,000 daily limit.')
    txs = [{ id: 'n' + Date.now(), title: 'Transfer to ' + d.to, amount: d.amount, type: 'expense', category: 'Transfer', date: new Date().toISOString().slice(0, 10), status: 'completed' }, ...txs]
  },
  users: async () => { await wait(); return [
    { id: 1, name: 'Ayesha Khan', email: 'ayesha@mail.com', role: 'User', status: 'Active' },
    { id: 2, name: 'Bilal Ahmed', email: 'bilal@mail.com', role: 'User', status: 'Suspended' },
    { id: 3, name: 'Sara Malik', email: 'sara@mail.com', role: 'Admin', status: 'Active' }] },
}
import { useCurrency } from '@/store'
export const money = (n: number) => { const c = useCurrency.getState().cur; return new Intl.NumberFormat('en-US', { style: 'currency', currency: c }).format(c === 'PKR' ? n * 280 : n) }
