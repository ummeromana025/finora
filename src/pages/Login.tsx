import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/store'
import { Button, Card, Input } from '@/ui'
const schema = z.object({ email: z.string().email('Enter a valid email address'), password: z.string().min(6, 'Password needs at least 6 characters') })
export default function Login() {
  const { user, login } = useAuth(); const nav = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
  if (user) return <Navigate to="/" replace />
  return (
    <div className="grid min-h-screen place-items-center bg-brand-900 p-4">
      <Card className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Sign in to Finora</h1>
        <p className="text-sm text-slate-500">Tip: use an email containing "admin" for the admin panel.</p>
        <form className="space-y-3" onSubmit={handleSubmit((d) => { login(d.email); nav('/') })}>
          <Input label="Email" {...register('email')} error={errors.email?.message} />
          <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
          <Button className="w-full">Sign in</Button>
        </form>
        <div className="flex justify-between text-sm text-brand-500"><Link to="/forgot">Forgot password?</Link><Link to="/signup">Create account</Link></div>
      </Card>
    </div>
  )
}
