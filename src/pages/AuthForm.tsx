import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { translateAuthError } from '@/lib/authErrors'
import { PASSWORD_CRITERIA, unmetPasswordCriteria } from '@/lib/passwordPolicy'
import { ensureUserSeeded } from '@/lib/seed'
import { supabase } from '@/lib/supabase'

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [password, setPassword] = useState('')
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const prefix = mode === 'login' ? 'login' : 'signup'

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    const credentials = { email: String(form.get('email')).trim(), password: String(form.get('password')) }
    if (mode === 'signup') {
      const confirmPassword = String(form.get('confirmPassword'))
      if (credentials.password !== confirmPassword) {
        return setError('Las contraseñas no son iguales')
      }
      const unmet = unmetPasswordCriteria(credentials.password)
      if (unmet.length > 0) {
        return setError(`Falta que la contraseña cumpla: ${unmet.map((c) => c.label.replace(/^Al menos /, '')).join(', ')}.`)
      }
    }
    setSubmitting(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword(credentials)
        if (error) return setError(translateAuthError(error))
      } else {
        const { data, error } = await supabase.auth.signUp(credentials)
        if (error) return setError(translateAuthError(error))
        // ADR-011: sin confirmación de email, signUp ya deja una sesión activa. Si algún
        // día se activa "Confirm email" desde el panel de Supabase, esto deja de asumirlo.
        if (!data.session) {
          setError('Te creamos la cuenta, pero hace falta confirmar el email antes de entrar. Revisá tu casilla.')
          return
        }
        // US-43 (ADR-014): mejor esfuerzo — un fallo acá no debe dejar al usuario varado.
        await ensureUserSeeded().catch(() => {})
      }
      const next = params.get('next')
      navigate(next?.startsWith('/') ? next : '/register', { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={onSubmit} data-testid={`${prefix}-form`} className="flex flex-col gap-3.5">
        <div className="mb-1 flex flex-col gap-1">
          <h1 className="text-title-1 font-bold">{mode === 'login' ? 'Entrar' : 'Crear cuenta'}</h1>
          <p className="text-callout text-muted-foreground">
            {mode === 'login' ? 'Seguí donde lo dejaste.' : 'Pesos, dólares y cuotas, en un solo lugar.'}
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${prefix}-email`}>Email</Label>
          <Input id={`${prefix}-email`} name="email" type="email" required autoComplete="email" data-testid={`${prefix}-form-email`} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${prefix}-password`}>Contraseña</Label>
          <Input
            id={`${prefix}-password`}
            name="password"
            type="password"
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            data-testid={`${prefix}-form-password`}
            aria-describedby={mode === 'signup' ? 'signup-password-criteria' : undefined}
            value={mode === 'signup' ? password : undefined}
            onChange={mode === 'signup' ? (e) => setPassword(e.target.value) : undefined}
          />
        </div>
        {mode === 'signup' && (
          <>
            <ul id="signup-password-criteria" data-testid="signup-password-criteria" className="flex flex-col gap-1 text-sm text-muted-foreground">
              {PASSWORD_CRITERIA.map((c) => {
                const met = c.test(password)
                return (
                  <li key={c.key} className={met ? 'text-foreground' : undefined} aria-label={`${c.label}: ${met ? 'cumplido' : 'pendiente'}`}>
                    {met ? '✓' : '○'} {c.label}
                  </li>
                )
              })}
            </ul>
            <div className="grid gap-2">
              <Label htmlFor="signup-confirm-password">Confirmar contraseña</Label>
              <Input
                id="signup-confirm-password"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                data-testid="signup-form-confirm-password"
              />
            </div>
          </>
        )}
        {error && <p role="alert" data-testid={`${prefix}-form-error`} className="text-sm text-destructive">{error}</p>}
        <Button type="submit" size="lg" disabled={submitting} data-testid={`${prefix}-form-submit`}>
          {mode === 'login' ? 'Entrar' : 'Crear cuenta'}
        </Button>
        <Link to={mode === 'login' ? '/signup' : '/login'} data-testid={`${prefix}-form-switch`} className="press inline-flex min-h-11 items-center self-center text-callout font-medium text-primary underline-offset-4 hover:underline">
          {mode === 'login' ? 'Crear una cuenta' : 'Ya tengo cuenta'}
        </Link>
      </form>
    </AuthLayout>
  )
}
