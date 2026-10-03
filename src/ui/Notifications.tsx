import { useState } from 'react'
import { Bell } from 'lucide-react'
const seed = [{ id: 1, text: 'Salary of $3,200 received', read: false }, { id: 2, text: 'Shopping budget exceeded', read: false }, { id: 3, text: 'New login from Chrome on Windows', read: true }]
export default function Notifications() {
  const [open, setOpen] = useState(false); const [items, setItems] = useState(seed); const unread = items.filter((i) => !i.read).length
  return <div className="relative">
    <button aria-label="Notifications" aria-expanded={open} onClick={() => setOpen(!open)} className="relative rounded-lg p-2 hover:bg-slate-200 dark:hover:bg-slate-800"><Bell size={18} />{unread > 0 && <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-expense text-[10px] text-white">{unread}</span>}</button>
    {open && <div className="absolute right-0 z-30 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between px-2 py-1 text-sm font-semibold">Notifications<button className="text-xs font-normal text-brand-500" onClick={() => setItems(items.map((i) => ({ ...i, read: true })))}>Mark all read</button></div>
      {items.map((i) => <p key={i.id} className={`rounded-lg px-2 py-2 text-sm ${i.read ? 'text-slate-500' : 'font-medium'}`}>{i.text}</p>)}</div>}
  </div>
}
