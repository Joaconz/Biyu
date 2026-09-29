import { createBrowserRouter, Navigate } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthForm } from '@/pages/AuthForm'
import { DashboardPage } from '@/pages/DashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { SetupPage } from '@/pages/SetupPage'
import { TransactionsPage } from '@/pages/TransactionsPage'
import { RedirectIfAuthed, RequireAuth } from '@/pages/RequireAuth'
import { SettingsPage } from '@/pages/SettingsPage'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/register" replace /> },
  {
    element: <RequireAuth />,
    children: [
      // US-68 (ADR-025): fuera de AppLayout, así no tiene su nav ni su header. AppLayout es el
      // que redirige acá si el setup no está completo; esta ruta en sí nunca se auto-redirige.
      { path: '/setup', element: <SetupPage /> },
      {
        // ADR-023: un layout compartido con la navegación global; queda montado entre pestañas.
        element: <AppLayout />,
        children: [
          { path: '/register', element: <RegisterPage /> },
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/transactions', element: <TransactionsPage /> },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    element: <RedirectIfAuthed />,
    children: [
      { path: '/login', element: <AuthForm key="login" mode="login" /> },
      { path: '/signup', element: <AuthForm key="signup" mode="signup" /> },
    ],
  },
  // DEF-001: catch-all fuera de RequireAuth/RedirectIfAuthed, así se ve con o sin sesión.
  { path: '*', element: <NotFoundPage /> },
])
