import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HomeIndicator from '../components/layout/HomeIndicator'
import { useAuth } from '../hooks/useAuth'

const logoIcon = '/fluently-logo.svg'

export default function Splash() {
  const navigate = useNavigate()
  const { status, user } = useAuth()

  useEffect(() => {
    if (status === 'loading') return // Wait for auth to settle

    const t = setTimeout(() => {
      if (status === 'authenticated' && user?.is_onboarded) {
        navigate('/home')
      } else if (status === 'authenticated') {
        navigate('/assessment')
      } else {
        navigate('/onboarding/1')
      }
    }, 2000)
    return () => clearTimeout(t)
  }, [navigate, status, user])

  return (
    <div className="relative h-dvh overflow-hidden bg-gradient-to-b from-[#fef7fe] to-[#f8f0fb] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-[10px]">
          <img src={logoIcon} alt="Fluently" className="w-[58px] h-[58px]" />
          <span className="font-jakarta font-extrabold text-[36px] text-[#262626] leading-none">
            Fluently
          </span>
        </div>
        <p className="font-jakarta font-normal text-[14px] text-[#262626]">AI English Tutor</p>
      </div>
      <HomeIndicator />
    </div>
  )
}
