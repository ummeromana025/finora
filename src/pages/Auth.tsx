import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/store'
import { Button, Card, Input } from '@/ui'
import { useToast } from '@/ui/extra'
const Wrap = ({ title, children }: { title: string; children: React.ReactNode }) => <div className="grid min-h-screen place-items-center bg-brand-900 p-4"><Card className="w-full max-w-sm space-y-4"><h1 className="text-2xl font-bold">{title}</h1>{children}<Link to="/login" className="block text-sm text-brand-500">Back to sign in</Link></Card></div>
const signup = z.object({ name: z.string().min(2, 'Enter your full name'), email: z.string().email('Enter a valid email address'), password: z.string().min(8, 'Use at least 8 characters') })
export function Signup() {
  const nav = useNavigate(); const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof signup>>({ resolver: zodResolver(signup) })
  return <Wrap title="Create your account"><form className="space-y-3" onSubmit={handleSubmit((d) => nav('/otp', { state: { email: d.email } }))}>
    <Input label="Full name" {...register('name')} error={errors.name?.message} /><Input label="Email" {...register('email')} error={errors.email?.message} />
    <Input label="Password" type="password" {...register('password')} error={errors.password?.message} /><Button className="w-full">Create account</Button></form></Wrap>
}
export function Otp() {
  const { state } = useLocation(); const nav = useNavigate(); const login = useAuth((s) => s.login); const [code, setCode] = useState(''); const [err, setErr] = useState('')
  return <Wrap title="Verify your email"><p className="text-sm text-slate-500">Enter the 6-digit code. Demo code: 123456</p>
    <Input label="Code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} error={err} />
    <Button className="w-full" onClick={() => code === '123456' ? (login(state?.email ?? 'user@mail.com'), nav('/')) : setErr('That code is incorrect. Try again.')}>Verify</Button></Wrap>
}
export function Forgot() {
  const toast = useToast((s) => s.push); const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>({ resolver: zodResolver(z.object({ email: z.string().email('Enter a valid email address') })) })
  return <Wrap title="Reset password"><form className="space-y-3" onSubmit={handleSubmit((d) => toast('Reset link sent to ' + d.email))}><Input label="Email" {...register('email')} error={errors.email?.message} /><Button className="w-full">Send reset link</Button></form></Wrap>
}
