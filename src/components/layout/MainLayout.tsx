import { Outlet, useLocation } from 'react-router-dom'
import type { Tab } from './BottomNav'
import BottomNav from './BottomNav'
import Sidebar from './Sidebar'

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
      <div className="flex h-full">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex-1 relative overflow-hidden">
            <Outlet />
          </div>
          <BottomNav activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}
