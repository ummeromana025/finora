import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router-dom'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { api } from '@/services/api'
import { useAuth } from '@/store'
import { Badge, Button, Card, Skeleton } from '@/ui'
import { useToast } from '@/ui/extra'
const signups = [['Apr', 120], ['May', 180], ['Jun', 150], ['Jul', 260], ['Aug', 310], ['Sep', 400]].map(([m, n]) => ({ m, n }))
export default function Admin() {
  const role = useAuth((s) => s.user?.role); const toast = useToast((s) => s.push); const [over, setOver] = useState<Record<number, string>>({})
  const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: api.users, enabled: role === 'Admin' })
  if (role !== 'Admin') return <Navigate to="/" replace />
  const status = (u: { id: number; status: string }) => over[u.id] ?? u.status
  return (
    <div className="space-y-6"><h1 className="text-2xl font-bold">Admin</h1>
      <div className="grid gap-4 md:grid-cols-3">{[['Total users', '1,420'], ['Volume this month', '$482,300'], ['Flagged transactions', '7']].map(([l, v]) => <Card key={l}><p className="text-sm text-slate-500">{l}</p><p className="mt-1 text-3xl font-bold">{v}</p></Card>)}</div>
      <Card><h2 className="mb-3 font-semibold">New signups</h2><ResponsiveContainer height={220}><BarChart data={signups}><XAxis dataKey="m" /><YAxis /><Tooltip /><Bar dataKey="n" fill="#2563eb" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></Card>
      <Card className="overflow-x-auto p-0">{isLoading ? <Skeleton className="h-40" /> :
        <table className="w-full text-left text-sm"><thead className="bg-slate-100 dark:bg-slate-800"><tr><th className="p-3">Name</th><th>Email</th><th>Role</th><th>Status</th><th /></tr></thead>
          <tbody>{data?.map((u) => <tr key={u.id} className="border-t border-slate-100 dark:border-slate-800"><td className="p-3">{u.name}</td><td>{u.email}</td><td>{u.role}</td><td><Badge tone={status(u) === 'Active' ? 'green' : 'red'}>{status(u)}</Badge></td>
            <td className="pr-3 text-right"><Button variant="ghost" onClick={() => { const s = status(u) === 'Active' ? 'Suspended' : 'Active'; setOver({ ...over, [u.id]: s }); toast(u.name + ' is now ' + s) }}>{status(u) === 'Active' ? 'Suspend' : 'Activate'}</Button></td></tr>)}</tbody></table>}</Card></div>
  )
}
