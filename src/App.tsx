import { motion } from 'framer-motion'
import ErrorBoundary from '@/ui/ErrorBoundary'
import Offline from '@/ui/Offline'
import { lazy, Suspense, useEffect } from 'react'
import { Navigate, NavLink, Outlet, Route, Routes, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Send, CreditCard, PiggyBank, Shield, Moon, Sun, LogOut, Settings as SettingsIcon, Wallet, LineChart, CalendarClock } from 'lucide-react'
import { useAuth, useTheme, useCurrency } from '@/store'
import Notifications from '@/ui/Notifications'
import SessionGuard from '@/ui/SessionGuard'
import { cn, Skeleton } from '@/ui'
import Login from '@/pages/Login'
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Transactions = lazy(() => import('@/pages/Transactions'))
const Transfer = lazy(() => import('@/pages/Transfer'))
const Cards = lazy(() => import('@/pages/Cards'))
const Budgets = lazy(() => import('@/pages/Budgets'))
const Insights = lazy(() => import('@/pages/Insights'))
const Bills = lazy(() => import('@/pages/Bills'))
const Accounts = lazy(() => import('@/pages/Accounts'))
const Admin = lazy(() => import('@/pages/Admin'))
const SettingsPage = lazy(() => import('@/pages/Settings'))
import { Signup, Otp, Forgot } from '@/pages/Auth'
import Palette from '@/ui/Palette'
import { Toaster } from '@/ui/extra'

function Shell() {
  const { user, logout } = useAuth(); const { dark, toggle } = useTheme(); const { cur, set: setCur } = useCurrency(); const loc = useLocation()
  if (!user) return <Navigate to="/login" replace />
  const links = [['/', 'Dashboard', LayoutDashboard], ['/transactions', 'Transactions', ArrowLeftRight], ['/transfer', 'Transfer', Send], ['/cards', 'Cards', CreditCard], ['/budgets', 'Budgets', PiggyBank], ['/accounts', 'Accounts', Wallet], ['/insights', 'Insights', LineChart], ['/bills', 'Bills', CalendarClock], ['/settings', 'Settings', SettingsIcon],
    ...(user.role === 'Admin' ? [['/admin', 'Admin', Shield]] : [])] as const
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="bg-brand-900 p-3 text-white md:w-60 md:p-5">
        <div className="mb-2 text-xl font-bold md:mb-8">Finora</div>
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {links.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => cn('flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm', isActive ? 'bg-white/15' : 'hover:bg-white/10')}><Icon size={18} />{label}</NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1"><Palette /><Offline />
        <header className="flex items-center justify-end gap-3 border-b border-slate-200 p-3 dark:border-slate-800">
          <span className="hidden text-xs text-slate-500 sm:inline">Press Ctrl+K to search</span><span className="text-sm">Hi, {user.name} ({user.role})</span>
          <select aria-label="Currency" value={cur} onChange={(e) => setCur(e.target.value as 'USD' | 'PKR')} className="rounded-lg border border-slate-300 bg-transparent px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"><option>USD</option><option>PKR</option></select>
          <Notifications />
          <button aria-label="Toggle theme" onClick={toggle} className="rounded-lg p-2 hover:bg-slate-200 dark:hover:bg-slate-800">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          <button aria-label="Log out" onClick={logout} className="rounded-lg p-2 hover:bg-slate-200 dark:hover:bg-slate-800"><LogOut size={18} /></button>
        </header>
        <main className="mx-auto max-w-6xl p-4 md:p-8"><SessionGuard /><Suspense fallback={<Skeleton className="h-64" />}><ErrorBoundary key={loc.pathname}><motion.div key={cur + loc.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}><Outlet /></motion.div></ErrorBoundary></Suspense></main>
      </div>
    </div>
  )
}
export default function App() {
  const dark = useTheme((s) => s.dark)
  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])
  return (
    <>
    <Toaster />
    <Routes>
      <Route path="/login" element={<Login />} /><Route path="/signup" element={<Signup />} /><Route path="/otp" element={<Otp />} /><Route path="/forgot" element={<Forgot />} />
      <Route element={<Shell />}>
        <Route index element={<Dashboard />} /><Route path="transactions" element={<Transactions />} /><Route path="transfer" element={<Transfer />} />
        <Route path="cards" element={<Cards />} /><Route path="budgets" element={<Budgets />} /><Route path="insights" element={<Insights />} /><Route path="bills" element={<Bills />} /><Route path="accounts" element={<Accounts />} /><Route path="admin" element={<Admin />} /><Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<div className="p-10 text-center">Page not found. <Link className="text-brand-500" to="/">Go to dashboard</Link></div>} />
    </Routes>
    </>
  )
}
