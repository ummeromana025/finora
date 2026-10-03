import { useState } from 'react'
import { useBills } from '@/store'
import { daysUntil, nextDue } from '@/utils/analytics'
import { money } from '@/services/api'
import { Badge, Button, Card, Input } from '@/ui'
import { Modal, useToast } from '@/ui/extra'
export default function Bills() {
  const { list, add, toggle, remove } = useBills(); const toast = useToast((s) => s.push); const [open, setOpen] = useState(false); const [f, setF] = useState({ name: '', amount: '', day: '1' })
  const rows = list.map((b) => ({ ...b, due: nextDue(b.day) })).sort((a, b) => +a.due - +b.due); const total = list.filter((b) => !b.paused).reduce((a, b) => a + b.amount, 0)
  const valid = f.name && Number(f.amount) > 0 && Number(f.day) >= 1 && Number(f.day) <= 28
  return (
    <div className="space-y-4"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold">Recurring payments</h1><p className="text-sm text-slate-500">Monthly commitment: {money(total)}</p></div><Button onClick={() => setOpen(true)}>Add payment</Button></div>
      {rows.length === 0 && <Card className="text-center text-slate-500">No recurring payments yet.</Card>}
      {rows.map((b) => { const d = daysUntil(b.due); return <Card key={b.id} className="flex flex-wrap items-center justify-between gap-3">
        <div><b>{b.name}</b> {b.paused ? <Badge tone="slate">Paused</Badge> : d <= 7 ? <Badge tone="amber">Due in {d} days</Badge> : <Badge tone="green">In {d} days</Badge>}<p className="text-sm text-slate-500">{money(b.amount)} on day {b.day} of each month</p></div>
        <div className="flex gap-2"><Button variant="ghost" onClick={() => toggle(b.id)}>{b.paused ? 'Resume' : 'Pause'}</Button><Button variant="ghost" onClick={() => { remove(b.id); toast(b.name + ' removed') }}>Delete</Button></div></Card> })}
      <Modal open={open} onClose={() => setOpen(false)} title="New recurring payment"><Input label="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /><Input label="Amount (USD)" type="number" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} /><Input label="Day of month (1-28)" type="number" value={f.day} onChange={(e) => setF({ ...f, day: e.target.value })} />
        <Button disabled={!valid} onClick={() => { add({ name: f.name, amount: Number(f.amount), day: Number(f.day) }); setOpen(false); setF({ name: '', amount: '', day: '1' }); toast('Payment added') }}>Save</Button></Modal></div>
  )
}
