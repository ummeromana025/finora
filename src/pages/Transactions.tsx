import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Download, X } from 'lucide-react'
import { api, money, type Tx } from '@/services/api'
import { Badge, Button, Card, Skeleton } from '@/ui'
const PER = 8
const sel = 'rounded-xl border border-slate-300 bg-transparent px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900'
export default function Transactions() {
  const { data = [], isLoading } = useQuery({ queryKey: ['tx'], queryFn: api.transactions })
  const [sp, setSp] = useSearchParams(); const [desc, setDesc] = useState(true); const [page, setPage] = useState(0); const [open, setOpen] = useState<Tx | null>(null)
  const q = sp.get('q') ?? '', type = sp.get('type') ?? 'all', cat = sp.get('cat') ?? 'all', from = sp.get('from') ?? ''
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); v && v !== 'all' ? n.set(k, v) : n.delete(k); setSp(n, { replace: true }); setPage(0) }
  const cats = [...new Set(data.map((t) => t.category))]
  const rows = useMemo(() => data.filter((t) => (type === 'all' || t.type === type) && (cat === 'all' || t.category === cat) && (!from || t.date >= from) && t.title.toLowerCase().includes(q.toLowerCase())).sort((a, b) => (desc ? b.amount - a.amount : a.amount - b.amount)), [data, q, type, cat, from, desc])
  const pages = Math.max(1, Math.ceil(rows.length / PER))
  const exportCsv = () => { const csv = ['id,title,amount,type,category,date,status', ...rows.map((t) => Object.values(t).join(','))].join('\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'transactions.csv'; a.click() }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="mr-auto text-2xl font-bold">Transactions</h1>
        <input aria-label="Search" placeholder="Search" value={q} onChange={(e) => set('q', e.target.value)} className={sel} />
        <select aria-label="Type" value={type} onChange={(e) => set('type', e.target.value)} className={sel}><option value="all">All types</option><option value="income">Income</option><option value="expense">Expense</option></select>
        <select aria-label="Category" value={cat} onChange={(e) => set('cat', e.target.value)} className={sel}><option value="all">All categories</option>{cats.map((c) => <option key={c}>{c}</option>)}</select>
        <input aria-label="From date" type="date" value={from} onChange={(e) => set('from', e.target.value)} className={sel} />
        <Button variant="ghost" onClick={exportCsv}><Download size={14} className="mr-1 inline" />CSV</Button>
      </div>
      <p className="text-xs text-slate-500">Filters are saved in the page link, so you can share this exact view.</p>
      <Card className="overflow-x-auto p-0">
        {isLoading ? <Skeleton className="h-64" /> : rows.length === 0 ? <p className="p-8 text-center text-slate-500">No transactions match your filters.</p> : (
          <table className="w-full text-left text-sm"><thead className="bg-slate-100 dark:bg-slate-800"><tr><th className="p-3">Title</th><th>Category</th><th>Date</th><th>Status</th><th className="cursor-pointer pr-3 text-right" onClick={() => setDesc(!desc)}>Amount {desc ? '↓' : '↑'}</th></tr></thead>
            <tbody>{rows.slice(page * PER, page * PER + PER).map((t) => <tr key={t.id} tabIndex={0} onClick={() => setOpen(t)} onKeyDown={(e) => e.key === 'Enter' && setOpen(t)} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"><td className="p-3">{t.title}</td><td>{t.category}</td><td>{t.date}</td><td><Badge tone={t.status === 'completed' ? 'green' : 'amber'}>{t.status}</Badge></td><td className={`pr-3 text-right ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>{money(t.amount)}</td></tr>)}</tbody></table>)}
      </Card>
      <div className="flex items-center justify-end gap-2 text-sm"><Button variant="ghost" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>Page {page + 1} of {pages}<Button variant="ghost" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Next</Button></div>
      {open && <aside role="dialog" aria-label="Transaction details" className="fixed inset-y-0 right-0 z-40 w-full max-w-sm space-y-3 border-l border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex justify-between"><h2 className="text-lg font-bold">Transaction details</h2><button aria-label="Close" onClick={() => setOpen(null)}><X /></button></div>
        <p className={`text-3xl font-bold ${open.type === 'income' ? 'text-income' : 'text-expense'}`}>{money(open.amount)}</p>
        {([['Title', open.title], ['Category', open.category], ['Date', open.date], ['Status', open.status], ['Reference', open.id.toUpperCase()]] as const).map(([k, v]) => <div key={k} className="flex justify-between border-t border-slate-100 py-2 text-sm dark:border-slate-800"><span className="text-slate-500">{k}</span><span>{v}</span></div>)}
        <Button variant="ghost" onClick={() => window.print()}>Print receipt</Button></aside>}
    </div>
  )
}
