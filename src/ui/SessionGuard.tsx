import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/store'
import { Button } from '@/ui'
import { Modal } from '@/ui/extra'
const IDLE = 5 * 60 * 1000, GRACE = 30
export default function SessionGuard() {
  const logout = useAuth((s) => s.logout); const last = useRef(Date.now()); const [left, setLeft] = useState<number | null>(null)
  useEffect(() => {
    const bump = () => { if (left === null) last.current = Date.now() }
    const ev = ['mousemove', 'keydown', 'click', 'scroll']; ev.forEach((e) => window.addEventListener(e, bump))
    const t = setInterval(() => { const idle = Date.now() - last.current; if (idle < IDLE) return setLeft(null); const l = Math.ceil(GRACE - (idle - IDLE) / 1000); l <= 0 ? logout() : setLeft(l) }, 1000)
    return () => { ev.forEach((e) => window.removeEventListener(e, bump)); clearInterval(t) }
  }, [left, logout])
  return <Modal open={left !== null} onClose={() => { last.current = Date.now(); setLeft(null) }} title="Are you still there?">
    <p className="text-sm">For your security you will be signed out in {left} seconds.</p><Button onClick={() => { last.current = Date.now(); setLeft(null) }}>Stay signed in</Button></Modal>
}
