import { useQuery } from '@tanstack/react-query'
import { api, money } from '@/services/api'
import { anomalies, byCategory, forecastMonth } from '@/utils/analytics'
import { Badge, Card, Skeleton } from '@/ui'
export default function Insights() {
  const { data, isLoading } = useQuery({ queryKey: ['tx'], queryFn: api.transactions })
  if (isLoading || !data) return <Skeleton className="h-64" />
  const income = data.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0)
  const cats = byCategory(data); const spent = cats.reduce((a, [, v]) => a + v, 0)
  const day = Math.max(...data.map((t) => Number(t.date.slice(8)))); const forecast = forecastMonth(spent, day)
  const rate = income ? Math.round(((income - spent) / income) * 100) : 0; const odd = anomalies(data)
  return (
    <div className="space-y-6"><h1 className="text-2xl font-bold">Insights</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-slate-500">Spent so far (day {day})</p><p className="text-3xl font-bold">{money(spent)}</p></Card>
        <Card><p className="text-sm text-slate-500">Projected month-end spend</p><p className="text-3xl font-bold">{money(forecast)}</p></Card>
        <Card><p className="text-sm text-slate-500">Savings rate</p><p className={`text-3xl font-bold ${rate >= 20 ? 'text-income' : 'text-expense'}`}>{rate}%</p></Card></div>
      <Card><h2 className="mb-3 font-semibold">Where your money goes</h2>
        {cats.map(([c, v]) => <div key={c} className="mb-3"><div className="flex justify-between text-sm"><span>{c}</span><span>{money(v)} ({Math.round((v / spent) * 100)}%)</span></div><div className="mt-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-2 rounded-full bg-brand-500" style={{ width: (v / spent) * 100 + '%' }} /></div></div>)}
        {cats[0] && <p className="mt-2 rounded-xl bg-brand-50 p-3 text-sm text-brand-900">Your biggest category is <b>{cats[0][0]}</b>. Cutting it by 10% would save about {money(cats[0][1] * 0.1)} a month.</p>}</Card>
      <Card><h2 className="mb-3 font-semibold">Unusual spending <Badge tone={odd.length ? 'amber' : 'green'}>{odd.length} flagged</Badge></h2>
        {odd.length === 0 ? <p className="text-sm text-slate-500">Nothing unusual this month.</p> : odd.map((t) => <div key={t.id} className="flex justify-between border-t border-slate-100 py-2 text-sm first:border-0 dark:border-slate-800"><span>{t.title} on {t.date}</span><span className="text-expense">{money(t.amount)}</span></div>)}</Card></div>
  )
}
