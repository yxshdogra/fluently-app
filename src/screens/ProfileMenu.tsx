import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { get } from '../lib/api-client'
import type { InvoiceData } from '../types/models'

interface MenuItem {
  label: string
  icon: React.ReactNode
  action: 'navigate' | 'link'
  target: string
}

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 4L10 8L6 12" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const menuItems: MenuItem[] = [
  {
    label: 'Privacy Policy',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L3 5V9C3 13.4183 6.58172 17 11 17C15.4183 17 19 13.4183 19 9V5L10 2Z" stroke="#2c3970" strokeWidth="1.5" strokeLinejoin="round" /><path d="M7 10L9 12L13 8" stroke="#2c3970" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    action: 'navigate',
    target: '/content/privacy-policy',
  },
  {
    label: 'Term & Conditions',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 3H16V17H4V3Z" stroke="#2c3970" strokeWidth="1.5" /><path d="M7 7H13M7 10H13M7 13H10" stroke="#2c3970" strokeWidth="1.5" strokeLinecap="round" /></svg>,
    action: 'navigate',
    target: '/content/terms-and-conditions',
  },
  {
    label: 'Pricing Refund Policy',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="#2c3970" strokeWidth="1.5" /><path d="M7 10H13M10 7V13" stroke="#2c3970" strokeWidth="1.5" strokeLinecap="round" /></svg>,
    action: 'navigate',
    target: '/content/refund-policy',
  },
  {
    label: 'Setting',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z" stroke="#2c3970" strokeWidth="1.5" /><path d="M16.5 10C16.5 10 16.5 10 16.5 10L18 10M2 10L3.5 10M10 3.5L10 2M10 18L10 16.5M14.6 5.4L15.7 4.3M4.3 15.7L5.4 14.6M14.6 14.6L15.7 15.7M4.3 4.3L5.4 5.4" stroke="#2c3970" strokeWidth="1.5" strokeLinecap="round" /></svg>,
    action: 'navigate',
    target: '/settings',
  },
  {
    label: 'Help & Support',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="#2c3970" strokeWidth="1.5" /><path d="M7.5 7.5C7.5 6.11929 8.61929 5 10 5C11.3807 5 12.5 6.11929 12.5 7.5C12.5 8.88071 11.3807 10 10 10V11" stroke="#2c3970" strokeWidth="1.5" strokeLinecap="round" /><circle cx="10" cy="14" r="0.5" fill="#2c3970" stroke="#2c3970" /></svg>,
    action: 'navigate',
    target: '/content/help-support',
  },
  {
    label: 'Get Your Invoice',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 2H15V18L12.5 16L10 18L7.5 16L5 18V2Z" stroke="#2c3970" strokeWidth="1.5" strokeLinejoin="round" /><path d="M8 7H12M8 10H12M8 13H10" stroke="#2c3970" strokeWidth="1.5" strokeLinecap="round" /></svg>,
    action: 'link',
    target: 'invoice',
  },
]

export default function ProfileMenu() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  async function handleMenuClick(item: MenuItem) {
    if (item.action === 'navigate') {
      navigate(item.target)
    } else if (item.target === 'invoice') {
      try {
        const data = await get<InvoiceData>('/subscriptions/me/invoice')
        window.open(data.invoice_url, '_blank')
      } catch {
        alert('No invoice available')
      }
    }
  }

  return (
    <div className="absolute inset-0 overflow-y-auto">
      {/* Profile header */}
      <div className="flex flex-col items-center pt-[60px] pb-6">
        <div className="w-[80px] h-[80px] rounded-full bg-primary/10 flex items-center justify-center">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#8b5cf6" strokeWidth="2" />
              <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#8b5cf6" strokeWidth="2" />
            </svg>
          )}
        </div>
        <h2 className="font-jakarta font-bold text-[20px] text-text-primary mt-3">
          {user?.name || 'User'}
        </h2>
        <button
          onClick={() => navigate('/profile/edit')}
          className="mt-2 bg-white/60 border border-[#e0d4f0] rounded-full px-5 py-2 cursor-pointer"
        >
          <span className="font-jakarta font-semibold text-[13px] text-primary">Update Profile</span>
        </button>
      </div>

      {/* Menu items */}
      <div className="px-6 flex flex-col gap-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleMenuClick(item)}
            className="w-full flex items-center gap-3 px-4 py-4 bg-white/60 rounded-[12px] border-none cursor-pointer text-left"
          >
            <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <span className="font-jakarta font-medium text-[15px] text-text-primary flex-1">
              {item.label}
            </span>
            <ChevronRight />
          </button>
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-4 bg-red-50/60 rounded-[12px] border-none cursor-pointer text-left mt-2"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 17H4C3.44772 17 3 16.5523 3 16V4C3 3.44772 3.44772 3 4 3H7" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M14 13L17 10M17 10L14 7M17 10H7" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-jakarta font-medium text-[15px] text-red-500 flex-1">
            Logout
          </span>
        </button>
      </div>
    </div>
  )
}
