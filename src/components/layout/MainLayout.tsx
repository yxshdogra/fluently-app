import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'

type Tab = 'home' | 'ask-tutor' | 'profile'

const routeToTab: Record<string, Tab> = {
  '/home': 'home',
  '/ask-tutor': 'ask-tutor',
  '/profile': 'profile',
}

export default function MainLayout() {
  const location = useLocation()
  const activeTab = routeToTab[location.pathname] || 'home'

  return (
    <div className="relative h-dvh overflow-hidden bg-gradient-to-b from-[#fef7fe] to-[#ecdffd]">
      <div className="flex flex-col h-full">
        <div className="flex-1 relative overflow-hidden">
          <Outlet />
        </div>
        <BottomNav activeTab={activeTab} />
      </div>
    </div>
  )
}
