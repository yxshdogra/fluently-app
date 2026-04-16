import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GradientButton, { ArrowIcon } from '../components/ui/GradientButton'
import { useAuth } from '../hooks/useAuth'
import { patch } from '../lib/api-client'
import type { User } from '../types/api'

export default function EnterName() {
  const navigate = useNavigate()
  const { updateUser } = useAuth()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleContinue() {
    if (!name.trim()) return
    setLoading(true)
    try {
      const updated = await patch<User>('/users/me', { name: name.trim() })
      updateUser(updated)
      navigate('/paywall', { replace: true })
    } catch {
      navigate('/paywall', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative h-dvh overflow-hidden bg-gradient-to-b from-[#fef7fe] to-[#ecdffd]">
      {/* Icon */}
      <div className="absolute top-[140px] left-1/2 -translate-x-1/2 w-[80px] h-[79px] bg-[rgba(255,255,255,0.1)] rounded-[24px] shadow-card flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#2c3970" strokeWidth="2" />
          <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#2c3970" strokeWidth="2" />
        </svg>
      </div>

      {/* Text */}
      <div className="absolute top-[250px] left-[39px] right-[39px] flex flex-col items-center text-center gap-2">
        <h1 className="font-jakarta font-bold text-[33px] text-text-primary leading-tight">
          What should we call you?
        </h1>
        <p className="font-jakarta font-normal text-[16px] text-text-primary opacity-70">
          Enter your name to personalize your experience
        </p>
      </div>

      {/* Input */}
      <div className="absolute top-[400px] left-1/2 -translate-x-1/2 w-[372px]">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          maxLength={100}
          className="w-full h-[56px] bg-[rgba(255,255,255,0.9)] rounded-[12px] px-5 font-jakarta text-[17px] text-text-body placeholder:text-[#969696] border-none outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* CTA */}
      <div className="absolute bottom-[50px] left-1/2 -translate-x-1/2">
        <GradientButton
          label={loading ? 'Saving...' : 'Continue'}
          onClick={handleContinue}
          disabled={!name.trim() || loading}
          icon={<ArrowIcon />}
        />
      </div>
    </div>
  )
}
