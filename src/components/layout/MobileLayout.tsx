import { Outlet } from 'react-router-dom'

export default function MobileLayout() {
  return (
    <div className="max-w-md mx-auto h-dvh relative">
      <Outlet />
    </div>
  )
}
