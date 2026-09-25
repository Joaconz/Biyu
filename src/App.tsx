import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'

// Provisorio hasta #67 (router): muestra el shell y deja el patrón de data-testid.
export default function App() {
  return (
    <>
      <AppShell>
        <h1 data-testid="home-title" className="text-2xl font-semibold">
          Registrar un gasto
        </h1>
        <Button data-testid="home-save">Guardar</Button>
      </AppShell>
      <Toaster />
    </>
  )
}
