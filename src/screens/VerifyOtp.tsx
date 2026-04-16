import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import GradientButton, { ArrowIcon } from '../components/ui/GradientButton'
import { useAuth } from '../hooks/useAuth'
import { useTimer } from '../hooks/useTimer'
import { post } from '../lib/api-client'
import type { OtpVerifyData, OtpResendData } from '../types/api'

const shieldIcon = 'https://www.figma.com/api/mcp/asset/2889c6d3-e449-4eda-8825-1f7d20db27eb'

export default function VerifyOtp() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { phone, phoneMasked, resendCooldown } = (location.state as {
    phone: string
    phoneMasked: string
    resendCooldown: number
  }) || { phone: '', phoneMasked: '+91XXXXXXX', resendCooldown: 30 }

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const timer = useTimer(resendCooldown)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    timer.start(resendCooldown)
    inputRef.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setOtp(value)
    if (value.length === 6) {
      handleVerify(value)
    }
  }

  async function handleVerify(code?: string) {
    const otpValue = code || otp
    if (otpValue.length !== 6) return
    setLoading(true)
    setError('')
    try {
      const data = await post<OtpVerifyData>('/auth/otp/verify', { phone, otp: otpValue }, true)
      login(data)

      if (data.is_new_user) {
        navigate('/trial-offer', { replace: true })
      } else if (!data.user.is_onboarded) {
        navigate('/assessment', { replace: true })
      } else {
        navigate('/home', { replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
      setOtp('')
      inputRef.current?.focus()
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (timer.isActive) return
    try {
      const data = await post<OtpResendData>('/auth/otp/resend', { phone }, true)
      timer.start(data.resend_cooldown_seconds)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend')
    }
  }

  const digits = Array.from({ length: 6 }, (_, i) => otp[i] || '')
  const isReady = otp.length === 6 && !loading

  return (
    <div className="relative h-dvh overflow-hidden bg-gradient-to-b from-[#fef7fe] to-[#ecdffd]">
      {/* Shield icon */}
      <div className="absolute top-[68px] left-1/2 -translate-x-1/2 w-[80px] h-[79px] bg-[rgba(255,255,255,0.1)] rounded-[24px] shadow-card flex items-center justify-center">
        <img src={shieldIcon} alt="" className="w-8 h-8" />
      </div>

      {/* Text */}
      <div className="absolute top-[179px] left-[39px] right-[39px] flex flex-col items-center text-center gap-2">
        <h1 className="font-jakarta font-bold text-[33px] text-text-primary leading-tight w-full">
          Verify your mobile number
        </h1>
        <p className="font-jakarta font-normal text-[16px] text-text-primary opacity-70 w-full">
          We've sent a 6-digit OTP to {phoneMasked}
        </p>
      </div>

      {/* OTP boxes with hidden input */}
      <div
        className="absolute top-[351px] left-1/2 -translate-x-1/2 flex gap-[13px] cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {digits.map((d, i) => (
          <div
            key={i}
            className={`w-[50px] h-[56px] rounded-[12px] flex items-center justify-center font-jakarta font-normal text-[20px] text-[#393939] ${
              i === otp.length
                ? 'bg-[rgba(255,255,255,0.8)] border border-[#dadada]'
                : 'bg-[rgba(255,255,255,0.8)]'
            }`}
          >
            {d}
          </div>
        ))}
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={otp}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 w-full h-full"
          autoComplete="one-time-code"
        />
      </div>

      {/* Resend */}
      <button
        onClick={handleResend}
        disabled={timer.isActive}
        className="absolute top-[427px] left-1/2 -translate-x-1/2 font-jakarta font-normal text-[17px] text-[#070707] text-center whitespace-nowrap bg-transparent border-none cursor-pointer"
      >
        Didn't receive it?{' '}
        <span className="font-bold">
          Resend OTP {timer.isActive ? `(${timer.formatted})` : ''}
        </span>
      </button>

      {/* Error */}
      {error && (
        <p className="absolute top-[464px] left-1/2 -translate-x-1/2 font-jakarta text-[13px] text-red-500 text-center w-[300px]">
          {error}
        </p>
      )}

      {/* Verify button */}
      <div className="absolute top-[509px] left-1/2 -translate-x-1/2">
        <GradientButton
          label={loading ? 'Verifying...' : 'Verify OTP'}
          onClick={() => handleVerify()}
          disabled={!isReady}
          icon={<ArrowIcon />}
        />
      </div>

      {/* Terms */}
      <p className="absolute top-[587px] left-1/2 -translate-x-1/2 font-jakarta font-normal text-[12px] text-[#353535] text-center w-[317px]">
        By proceeding, I agree to the Term &amp; Condition &amp; Policy.
      </p>
    </div>
  )
}
