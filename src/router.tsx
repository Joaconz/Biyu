import { createBrowserRouter, Navigate } from 'react-router'
import { AuthForm } from '@/pages/AuthForm'
import { DashboardPage } from '@/pages/DashboardPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { RedirectIfAuthed, RequireAuth } from '@/pages/RequireAuth'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/register" replace /> },
  {
    element: <RequireAuth />,
    children: [
      { path: '/register', element: <RegisterPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
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
