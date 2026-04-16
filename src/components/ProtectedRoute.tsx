import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute() {
  const { status } = useAuth()

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1a2e]">
        <div className="w-[414px] h-[896px] rounded-[40px] overflow-hidden shadow-2xl bg-gradient-to-b from-[#fef7fe] to-[#ecdffd] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
