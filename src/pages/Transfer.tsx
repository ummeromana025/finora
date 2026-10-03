import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api, money, type Tx } from '@/services/api'
import { Button, Card, Input } from '@/ui'
import { useBenef } from '@/store'
import { useToast } from '@/ui/extra'
const schema = z.object({ to: z.string().min(3, 'Enter the recipient name'), iban: z.string().min(8, 'Enter a valid account number'), amount: z.coerce.number().positive('Amount must be greater than 0') })
type F = z.infer<typeof schema>
export default function Transfer() {
  const [step, setStep] = useState(1); const qc = useQueryClient(); const benef = useBenef(); const toast = useToast((s) => s.push)
  const { register, handleSubmit, getValues, setValue, reset, formState: { errors } } = useForm<F>({ resolver: zodResolver(schema) })
  const m = useMutation({ mutationFn: api.transfer,
    onMutate: async (d) => { await qc.cancelQueries({ queryKey: ['tx'] }); const prev = qc.getQueryData<Tx[]>(['tx']); qc.setQueryData<Tx[]>(['tx'], (o = []) => [{ id: 'tmp', title: 'Transfer to ' + d.to, amount: d.amount, type: 'expense', category: 'Transfer', date: new Date().toISOString().slice(0, 10), status: 'pending' }, ...o]); return { prev } },
    onError: (_e, _d, ctx) => qc.setQueryData(['tx'], ctx?.prev),
    onSuccess: () => { toast('Transfer sent'); qc.invalidateQueries({ queryKey: ['tx'] }); setStep(3) } })
  return (
    <Card className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Send money</h1>
      <p className="text-sm text-slate-500">Step {step} of 3</p>
      {step === 1 && <form className="space-y-3" onSubmit={handleSubmit(() => setStep(2))}>
        <div className="flex flex-wrap gap-2">{benef.list.map((b, i) => <button type="button" key={i} onClick={() => { setValue('to', b.name); setValue('iban', b.iban) }} className="rounded-full border border-slate-300 px-3 py-1 text-xs dark:border-slate-700">{b.name}</button>)}</div>
        <Input label="Recipient name" {...register('to')} error={errors.to?.message} />
        <Input label="Account number" {...register('iban')} error={errors.iban?.message} />
        <Input label="Amount (USD)" type="number" step="0.01" {...register('amount')} error={errors.amount?.message} />
        <Button type="button" variant="ghost" className="w-full" onClick={() => { const { to, iban } = getValues(); if (to && iban) { benef.add({ name: to, iban }); toast('Beneficiary saved') } }}>Save as beneficiary</Button>
        <Button className="w-full">Review transfer</Button></form>}
      {step === 2 && <div className="space-y-3">
        <p>Send <b>{money(Number(getValues('amount')))}</b> to <b>{getValues('to')}</b>?</p>
        {m.isError && <p className="text-sm text-expense">{(m.error as Error).message}</p>}
        <div className="flex gap-2"><Button variant="ghost" onClick={() => setStep(1)}>Edit</Button><Button disabled={m.isPending} onClick={() => m.mutate({ to: getValues('to'), amount: Number(getValues('amount')) })}>{m.isPending ? 'Sending…' : 'Confirm and send'}</Button></div></div>}
      {step === 3 && <div className="space-y-3 text-center"><p className="text-4xl">✅</p><p className="font-semibold">Transfer sent</p><Button onClick={() => { reset(); m.reset(); setStep(1) }}>Send another</Button></div>}
    </Card>
  )
}
