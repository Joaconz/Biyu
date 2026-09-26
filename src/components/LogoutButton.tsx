import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

/** US-64: disponible en toda pantalla privada, para un dispositivo compartido. */
export function LogoutButton({ testId }: { testId: string }) {
  const navigate = useNavigate()

  async function onClick() {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  return (
    <Button type="button" variant="ghost" size="sm" onClick={onClick} data-testid={testId}>
      Salir
    </Button>
  )
}
