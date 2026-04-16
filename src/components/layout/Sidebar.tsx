import { NavLink } from 'react-router-dom'
import { tabs } from './BottomNav'

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 h-dvh bg-white border-r border-gray-100 shrink-0">
      <div className="px-6 pt-8 pb-6">
        <h1 className="font-jakarta text-2xl font-bold text-[#2c3970]">Fluently</h1>
        <p className="font-jakarta text-xs text-gray-400 mt-1">AI English Tutor</p>
      </div>

      <nav className="flex flex-col gap-1 px-3 flex-1">
        {tabs.map(({ id, label, icon: Icon, route }) => (
          <NavLink
            key={id}
            to={route}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-jakarta text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#f3edff] text-[#7c4dff]'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon active={isActive} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-gray-100">
        <p className="font-jakarta text-[10px] text-gray-300">Fluently v1.0</p>
      </div>
    </aside>
  )
}
