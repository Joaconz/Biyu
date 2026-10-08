import { createBrowserRouter, Navigate } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthForm } from '@/pages/AuthForm'
import { DashboardPage } from '@/pages/DashboardPage'
import { DebtFormPage } from '@/pages/DebtFormPage'
import { DebtsPage } from '@/pages/DebtsPage'
import { EditSubscriptionPage } from '@/pages/EditSubscriptionPage'
import { ImportPage } from '@/pages/ImportPage'
import { NewSubscriptionPage } from '@/pages/NewSubscriptionPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { SetupPage } from '@/pages/SetupPage'
import { SubscriptionDetailPage } from '@/pages/SubscriptionDetailPage'
import { SubscriptionsPage } from '@/pages/SubscriptionsPage'
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
          // US-74: la librería de .xlsx se carga con import() dentro de la pantalla, no acá.
          { path: '/import', element: <ImportPage /> },
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/transactions', element: <TransactionsPage /> },
          { path: '/debts', element: <DebtsPage /> },
          { path: '/debts/new', element: <DebtFormPage /> },
          { path: '/subscriptions', element: <SubscriptionsPage /> },
          { path: '/subscriptions/new', element: <NewSubscriptionPage /> },
          { path: '/subscriptions/:id', element: <SubscriptionDetailPage /> },
          { path: '/subscriptions/:id/edit', element: <EditSubscriptionPage /> },
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
