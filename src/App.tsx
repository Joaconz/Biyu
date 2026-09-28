import { RouterProvider } from 'react-router'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/lib/auth'
import { router } from '@/router'

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      {/* Arriba: abajo chocaría con la barra y con "Guardar gasto". Respeta el notch (viewport-fit=cover). */}
      <Toaster position="top-center" offset={{ top: 'calc(env(safe-area-inset-top, 0px) + 12px)' }} mobileOffset={{ top: 'calc(env(safe-area-inset-top, 0px) + 12px)' }} />
    </AuthProvider>
  )
}
