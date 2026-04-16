import { useNavigate } from 'react-router-dom'

type Tab = 'home' | 'ask-tutor' | 'profile'

interface BottomNavProps {
  activeTab: Tab
}

function HomeIcon({ active }: { active: boolean }) {
  const color = active ? '#7c4dff' : '#6b7280'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChatIcon({ active }: { active: boolean }) {
  const color = active ? '#7c4dff' : '#6b7280'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4607 20 9.01172 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ProfileIcon({ active }: { active: boolean }) {
  const color = active ? '#7c4dff' : '#6b7280'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const tabs: { id: Tab; label: string; icon: typeof HomeIcon; route: string }[] = [
  { id: 'home', label: 'Home', icon: HomeIcon, route: '/home' },
  { id: 'ask-tutor', label: 'Ask to Tutor', icon: ChatIcon, route: '/ask-tutor' },
  { id: 'profile', label: 'Profile', icon: ProfileIcon, route: '/profile' },
]

export default function BottomNav({ activeTab }: BottomNavProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-white/95 backdrop-blur-sm border-t border-gray-100 pb-6 pt-2 px-4">
      <div className="flex justify-around items-center">
        {tabs.map(({ id, label, icon: Icon, route }) => (
          <button
            key={id}
            onClick={() => navigate(route)}
            className="flex flex-col items-center gap-1 border-none bg-transparent cursor-pointer px-4 py-1"
          >
            <Icon active={activeTab === id} />
            <span
              className={`font-jakarta text-[11px] font-medium ${
                activeTab === id ? 'text-[#7c4dff]' : 'text-[#6b7280]'
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
