import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '@/ui/extra'
const items: [string, string][] = [['Dashboard', '/'], ['Transactions', '/transactions'], ['Send money', '/transfer'], ['Cards', '/cards'], ['Budgets and goals', '/budgets'], ['Accounts and exchange', '/accounts'], ['Insights', '/insights'], ['Recurring payments', '/bills'], ['Settings', '/settings'], ['Admin', '/admin']]
export default function Palette() {
  const [open, setOpen] = useState(false); const [q, setQ] = useState(''); const nav = useNavigate()
  useEffect(() => { const f = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); setQ('') } }; window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f) }, [])
  const list = items.filter(([n]) => n.toLowerCase().includes(q.toLowerCase()))
  const go = (p: string) => { nav(p); setOpen(false) }
  return <Modal open={open} onClose={() => setOpen(false)} title="Search Finora">
    <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && list[0] && go(list[0][1])} placeholder="Type a page name" className="w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" />
    {list.length === 0 ? <p className="text-sm text-slate-500">No pages match "{q}".</p> : list.map(([n, p]) => <button key={p} onClick={() => go(p)} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800">{n}</button>)}
  </Modal>
}
