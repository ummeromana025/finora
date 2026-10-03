import { useState } from 'react'
import { useAccounts } from '@/store'
import { convert, fee, fmt, RATE } from '@/utils/fx'
import { Button, Card, Input } from '@/ui'
import { useToast } from '@/ui/extra'
const sel = 'mt-1 w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700 dark:bg-slate-900'
export default function Accounts() {
  const { list, log, move } = useAccounts(); const toast = useToast((s) => s.push)
  const [from, setFrom] = useState('chk'); const [to, setTo] = useState('pk'); const [amt, setAmt] = useState(''); const [err, setErr] = useState('')
  const a = list.find((x) => x.id === from)!, b = list.find((x) => x.id === to)!, n = Number(amt) || 0
  const f = fee(n, a.cur, b.cur), credit = convert(n - f, a.cur, b.cur)
  return (
    <div className="space-y-6"><h1 className="text-2xl font-bold">Accounts and exchange</h1>
      <div className="grid gap-4 md:grid-cols-3">{list.map((x) => <Card key={x.id}><p className="text-sm text-slate-500">{x.name}</p><p className="mt-1 text-2xl font-bold">{fmt(x.bal, x.cur)}</p></Card>)}</div>
      <Card className="max-w-lg space-y-3"><h2 className="font-semibold">Move money between accounts</h2>
        <label className="block text-sm font-medium">From<select className={sel} value={from} onChange={(e) => setFrom(e.target.value)}>{list.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
        <label className="block text-sm font-medium">To<select className={sel} value={to} onChange={(e) => setTo(e.target.value)}>{list.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
        <Input label={`Amount (${a.cur})`} type="number" value={amt} onChange={(e) => { setAmt(e.target.value); setErr('') }} error={err} />
        {n > 0 && <p className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-slate-800">Fee: {fmt(f, a.cur)}. Rate: 1 USD = {RATE} PKR. They receive <b>{fmt(credit, b.cur)}</b>.</p>}
        <Button onClick={() => { const e = move(from, to, n); e ? setErr(e) : (toast('Money moved'), setAmt('')) }}>Move money</Button></Card>
      {log.length > 0 && <Card><h2 className="mb-2 font-semibold">Recent moves</h2>{log.map((l, i) => <p key={i} className="text-sm text-slate-500">{l}</p>)}</Card>}</div>
  )
}
