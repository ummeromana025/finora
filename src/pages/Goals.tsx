import { useState } from 'react'
import { money } from '@/services/api'
import { Button, Card, Input } from '@/ui'
import { Modal, useToast } from '@/ui/extra'
export default function Goals() {
  const [goals, setGoals] = useState([{ name: 'Emergency fund', saved: 600, target: 2000 }]); const [open, setOpen] = useState(false); const [name, setName] = useState(''); const [target, setTarget] = useState(''); const toast = useToast((s) => s.push)
  return <div className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Savings goals</h2><Button onClick={() => setOpen(true)}>New goal</Button></div>
    <div className="grid gap-4 md:grid-cols-2">{goals.map((g, i) => <Card key={i}><div className="flex justify-between"><b>{g.name}</b><span className="text-sm">{money(g.saved)} / {money(g.target)}</span></div>
      <div className="my-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-2 rounded-full bg-brand-500" style={{ width: Math.min(100, (g.saved / g.target) * 100) + '%' }} /></div>
      <Button variant="ghost" onClick={() => { setGoals(goals.map((x, j) => j === i ? { ...x, saved: x.saved + 100 } : x)); toast('Added $100 to ' + g.name) }}>Add $100</Button></Card>)}</div>
    <Modal open={open} onClose={() => setOpen(false)} title="New savings goal"><Input label="Goal name" value={name} onChange={(e) => setName(e.target.value)} /><Input label="Target (USD)" type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
      <Button disabled={!name || Number(target) <= 0} onClick={() => { setGoals([...goals, { name, saved: 0, target: Number(target) }]); setOpen(false); setName(''); setTarget(''); toast('Goal created') }}>Create goal</Button></Modal></div>
}
