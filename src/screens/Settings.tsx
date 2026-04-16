import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { get, patch } from '../lib/api-client'
import type { UserSettings } from '../types/api'
import { useState } from 'react'
import { useNotifications } from '../hooks/useNotifications'

export default function Settings() {
  const navigate = useNavigate()
  const { data: settings } = useApi<UserSettings>(() => get('/settings'), [])
  const [showLangPicker, setShowLangPicker] = useState(false)
  // null means "use server value"; set to boolean on optimistic toggle
  const [localOverride, setLocalOverride] = useState<boolean | null>(null)

  const { register, unregister } = useNotifications()

  // Derive displayed value: local optimistic override takes priority over server state
  const notificationsEnabled = localOverride ?? settings?.notifications_enabled ?? false

  async function handleLanguageChange(code: string) {
    await patch('/settings', { language: code })
    setShowLangPicker(false)
  }

  async function handleNotificationsToggle() {
    const next = !notificationsEnabled
    setLocalOverride(next)
    try {
      await patch('/settings', { notifications_enabled: next })
      if (next) {
        await register()
      } else {
        await unregister()
      }
    } catch {
      setLocalOverride(null) // revert to server value on failure
    }
  }

  const currentLang = settings?.available_languages.find((l) => l.code === settings.language)

  return (
    <div className="relative h-dvh overflow-hidden bg-gradient-to-b from-[#fef7fe] to-[#ecdffd]">
      {/* Header */}
      <div className="absolute top-[50px] left-0 right-0 px-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="bg-transparent border-none cursor-pointer p-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#2c3970" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="font-jakarta font-bold text-[20px] text-text-primary">Setting</h1>
      </div>

      <div className="absolute top-[110px] left-5 right-5 flex flex-col gap-3">
        {/* Language option */}
        <div>
          <button
            onClick={() => setShowLangPicker(!showLangPicker)}
            className="w-full flex items-center gap-3 px-4 py-4 bg-white/80 rounded-[16px] border-none cursor-pointer text-left"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#2c3970" strokeWidth="1.5" />
              <path d="M2 12H22M12 2C14.5 4.5 16 8 16 12C16 16 14.5 19.5 12 22M12 2C9.5 4.5 8 8 8 12C8 16 9.5 19.5 12 22" stroke="#2c3970" strokeWidth="1.5" />
            </svg>
            <span className="font-jakarta font-medium text-[16px] text-text-primary flex-1">
              Language
            </span>
            <span className="font-jakarta text-[14px] text-text-muted mr-2">
              {currentLang?.name || 'English'}
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Language picker */}
          {showLangPicker && settings && (
            <div className="mt-2 bg-white rounded-[16px] overflow-hidden shadow-card">
              {settings.available_languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full px-5 py-4 flex items-center justify-between border-none cursor-pointer text-left ${
                    settings.language === lang.code ? 'bg-primary/5' : 'bg-transparent'
                  }`}
                >
                  <span className="font-jakarta font-medium text-[15px] text-text-primary">
                    {lang.name}
                  </span>
                  {settings.language === lang.code && (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M4 9L8 13L14 5" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications toggle */}
        <button
          onClick={handleNotificationsToggle}
          className="w-full flex items-center gap-3 px-4 py-4 bg-white/80 rounded-[16px] border-none cursor-pointer text-left"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="#2c3970" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-jakarta font-medium text-[16px] text-text-primary flex-1">
            Notifications
          </span>
          {/* Toggle pill */}
          <div
            className={`relative w-[44px] h-[26px] rounded-full transition-colors duration-200 ${
              notificationsEnabled ? 'bg-primary' : 'bg-[#d1d5db]'
            }`}
          >
            <div
              className={`absolute top-[3px] w-[20px] h-[20px] bg-white rounded-full shadow transition-transform duration-200 ${
                notificationsEnabled ? 'translate-x-[21px]' : 'translate-x-[3px]'
              }`}
            />
          </div>
        </button>
      </div>
    </div>
  )
}
