import { createBrowserRouter, Navigate } from 'react-router'
import { AuthForm } from '@/pages/AuthForm'
import { DashboardPage } from '@/pages/DashboardPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { RedirectIfAuthed, RequireAuth } from '@/pages/RequireAuth'
import { SettingsPage } from '@/pages/SettingsPage'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/register" replace /> },
  {
    element: <RequireAuth />,
    children: [
      { path: '/register', element: <RegisterPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
  {
    element: <RedirectIfAuthed />,
    children: [
      { path: '/login', element: <AuthForm mode="login" /> },
      { path: '/signup', element: <AuthForm mode="signup" /> },
    ],
  },
])
