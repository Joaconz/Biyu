import { useNavigate } from 'react-router'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

/** US-64: cerrar sesión en un dispositivo compartido. Vive en Ajustes, que se abre desde toda pantalla privada (ADR-023). */
export function LogoutButton({ testId, className }: { testId: string; className?: string }) {
  const navigate = useNavigate()

  async function onClick() {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className={cn('press flex min-h-12 w-full items-center gap-3 px-4 text-callout font-medium text-destructive hover:bg-destructive/5', className)}
    >
      <LogOut aria-hidden="true" className="size-[1.125rem]" strokeWidth={1.8} />
      Cerrar sesión
    </button>
  )
}
