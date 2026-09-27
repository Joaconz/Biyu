import { RouterProvider } from 'react-router'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/lib/auth'
import { router } from '@/router'

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      {/* Con viewport-fit=cover el toast quedaría sobre la barra de inicio del iPhone. */}
      <Toaster mobileOffset={{ bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }} />
    </AuthProvider>
  )
}
