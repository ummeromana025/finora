import { useQuery } from '@tanstack/react-query'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { api, money } from '@/services/api'
import { Card, Skeleton, Badge } from '@/ui'
const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({ queryKey: ['tx'], queryFn: api.transactions })
  if (isError) return <Card>Could not load data. Refresh the page to try again.</Card>
  if (isLoading || !data) return <div className="grid gap-4 md:grid-cols-3"><Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" /></div>
  const income = data.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0)
  const expense = data.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
  const byDate = Object.values(data.reduce<Record<string, { date: string; expense: number }>>((m, t) => { if (t.type === 'expense') (m[t.date] ??= { date: t.date.slice(5), expense: 0 }).expense += t.amount; return m }, {})).sort((a, b) => a.date.localeCompare(b.date))
  const byCat = Object.entries(data.filter((t) => t.type === 'expense').reduce<Record<string, number>>((m, t) => ({ ...m, [t.category]: (m[t.category] ?? 0) + t.amount }), {})).map(([name, value]) => ({ name, value }))
  const stats: [string, number, string][] = [['Balance', income - expense, ''], ['Income', income, 'text-income'], ['Expenses', expense, 'text-expense']]
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">{stats.map(([l, v, c]) => <Card key={l}><p className="text-sm text-slate-500">{l}</p><p className={`mt-1 text-3xl font-bold ${c}`}>{money(v)}</p></Card>)}</div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2"><h2 className="mb-3 font-semibold">Spending over time</h2>
          <ResponsiveContainer height={260}><AreaChart data={byDate}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="date" /><YAxis /><Tooltip /><Area dataKey="expense" stroke="#2563eb" fill="#2563eb33" /></AreaChart></ResponsiveContainer></Card>
        <Card><h2 className="mb-3 font-semibold">By category</h2>
          <ResponsiveContainer height={260}><PieChart><Pie data={byCat} dataKey="value" innerRadius={55} outerRadius={90}>{byCat.map((_, i) => <Cell key={i} fill={COLORS[i % 5]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></Card>
      </div>
      <Card><h2 className="mb-3 font-semibold">Recent transactions</h2>
        {data.slice(0, 5).map((t) => <div key={t.id} className="flex justify-between border-t border-slate-100 py-2 first:border-0 dark:border-slate-800"><span>{t.title} <Badge tone={t.status === 'completed' ? 'green' : 'amber'}>{t.status}</Badge></span><span className={t.type === 'income' ? 'text-income' : 'text-expense'}>{t.type === 'income' ? '+' : '-'}{money(t.amount)}</span></div>)}
      </Card>
    </div>
  )
}
