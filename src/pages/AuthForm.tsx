import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'

// Esqueleto funcional: el pulido (mensajes, validación) es de US-48/US-50/US-51.
export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const [error, setError] = useState<string | null>(null)
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const prefix = mode === 'login' ? 'login' : 'signup'

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const credentials = { email: String(form.get('email')), password: String(form.get('password')) }
    const { error } =
      mode === 'login'
        ? await supabase.auth.signInWithPassword(credentials)
        : await supabase.auth.signUp(credentials)
    if (error) return setError(error.message)
    const next = params.get('next')
    navigate(next?.startsWith('/') ? next : '/register', { replace: true })
  }

  return (
    <AppShell>
      <form onSubmit={onSubmit} data-testid={`${prefix}-form`} className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">{mode === 'login' ? 'Entrar' : 'Crear cuenta'}</h1>
        <div className="grid gap-2">
          <Label htmlFor={`${prefix}-email`}>Email</Label>
          <Input id={`${prefix}-email`} name="email" type="email" required autoComplete="email" data-testid={`${prefix}-form-email`} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${prefix}-password`}>Contraseña</Label>
          <Input id={`${prefix}-password`} name="password" type="password" required minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} data-testid={`${prefix}-form-password`} />
        </div>
        {error && <p role="alert" data-testid={`${prefix}-form-error`} className="text-sm text-destructive">{error}</p>}
        <Button type="submit" data-testid={`${prefix}-form-submit`}>{mode === 'login' ? 'Entrar' : 'Crear cuenta'}</Button>
        <Link to={mode === 'login' ? '/signup' : '/login'} data-testid={`${prefix}-form-switch`} className="text-sm underline">
          {mode === 'login' ? 'Crear una cuenta' : 'Ya tengo cuenta'}
        </Link>
      </form>
    </AppShell>
  )
}
