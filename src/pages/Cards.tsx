import { useState } from 'react'
import { Button, Card, Badge } from '@/ui'
export default function Cards() {
  const [flip, setFlip] = useState(false); const [frozen, setFrozen] = useState(false)
  const face = 'absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-900 p-6 text-white [backface-visibility:hidden]'
  return (
    <div className="space-y-6"><h1 className="text-2xl font-bold">Cards</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-52 max-w-sm cursor-pointer [perspective:1000px]" onClick={() => setFlip(!flip)} role="button" aria-label="Flip card">
          <div className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${flip ? '[transform:rotateY(180deg)]' : ''} ${frozen ? 'grayscale' : ''}`}>
            <div className={face}><p className="font-bold">Finora</p><p className="mt-10 text-xl tracking-widest">4532 •••• •••• 7890</p><p className="mt-6 text-sm">Valid thru 09/29</p></div>
            <div className={face + ' [transform:rotateY(180deg)]'}><div className="-mx-6 mt-4 h-10 bg-black" /><p className="mt-8 text-sm">CVV 123</p></div>
          </div></div>
        <Card className="space-y-3"><p>Status: <Badge tone={frozen ? 'red' : 'green'}>{frozen ? 'Frozen' : 'Active'}</Badge></p>
          <Button onClick={() => setFrozen(!frozen)}>{frozen ? 'Unfreeze card' : 'Freeze card'}</Button><p className="text-sm text-slate-500">Click the card to see the back.</p></Card>
      </div></div>
  )
}
