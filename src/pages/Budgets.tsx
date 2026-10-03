import { Card } from '@/ui'
import Goals from '@/pages/Goals'
import { money } from '@/services/api'
const budgets: [string, number, number][] = [['Food', 320, 400], ['Shopping', 410, 400], ['Travel', 90, 300], ['Bills', 220, 350]]
export default function Budgets() {
  return (
    <div className="space-y-4"><h1 className="text-2xl font-bold">Budgets</h1>
      <div className="grid gap-4 md:grid-cols-2">{budgets.map(([n, spent, limit]) => { const pct = Math.min(100, (spent / limit) * 100)
        return <Card key={n}><div className="flex justify-between"><b>{n}</b><span className="text-sm">{money(spent)} / {money(limit)}</span></div>
          <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800"><div className={`h-2 rounded-full ${spent > limit ? 'bg-expense' : 'bg-income'}`} style={{ width: pct + '%' }} /></div>
          {spent > limit && <p className="mt-2 text-xs text-expense">You are over budget by {money(spent - limit)}.</p>}</Card> })}</div><Goals /></div>
  )
}
