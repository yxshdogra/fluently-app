import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GradientButton, { ArrowIcon } from '../components/ui/GradientButton'
import { post } from '../lib/api-client'
import type { OtpSendData } from '../types/api'

const userIcon = 'https://www.figma.com/api/mcp/asset/93e155a4-f2e6-40e8-8914-de5e901b444a'
const callIcon = 'https://www.figma.com/api/mcp/asset/97fe2a95-89d4-42d6-a61c-de1bbb742754'

export default function Login() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    setPhone(value)
  }

  async function handleSendOtp() {
    if (phone.length !== 10) return
    setLoading(true)
    setError('')
    try {
      const fullPhone = `+91${phone}`
      const data = await post<OtpSendData>('/auth/otp/send', { phone: fullPhone }, true)
      navigate('/verify-otp', {
        state: {
          phone: fullPhone,
          phoneMasked: data.phone_masked,
          resendCooldown: data.resend_cooldown_seconds,
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const isReady = phone.length === 10 && !loading

  return (
    <div className="relative h-dvh overflow-hidden bg-gradient-to-b from-[#fef7fe] to-[#ecdffd]">
      {/* Logo icon */}
      <div className="absolute top-[104px] left-1/2 -translate-x-1/2 w-[80px] h-[79px] bg-[rgba(255,255,255,0.1)] rounded-[24px] shadow-card flex items-center justify-center">
        <img src={userIcon} alt="" className="w-[48px] h-[35px]" />
      </div>

      {/* Text */}
      <div className="absolute top-[207px] left-[39px] right-[39px] flex flex-col items-center text-center gap-2">
        <h1 className="font-jakarta font-bold text-[33px] text-text-primary leading-tight">
          Start learning smarter in 60 seconds
        </h1>
        <p className="font-jakarta font-normal text-[16px] text-text-primary opacity-70">
          Enter your mobile number to continue
        </p>
      </div>

      {/* Phone input */}
      <div
        className="absolute top-[381px] left-1/2 -translate-x-1/2 w-[372px] h-[56px] bg-[rgba(255,255,255,0.9)] rounded-[12px] flex items-center px-5 gap-3 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <img src={callIcon} alt="" className="w-6 h-6 shrink-0" />
        <span className="font-jakarta font-bold text-[17px] text-text-body">+91</span>
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          value={phone}
          onChange={handleChange}
          placeholder="Enter Mobile Number"
          className="flex-1 bg-transparent border-none outline-none font-jakarta text-[17px] text-[#1c1c1c] font-bold placeholder:font-normal placeholder:text-[#969696]"
        />
      </div>

      {/* Hint */}
      {phone.length > 0 && (
        <p className="absolute top-[447px] left-1/2 -translate-x-1/2 font-jakarta text-[14px] text-[#070707] text-center whitespace-nowrap">
          We never share your number to continue
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="absolute top-[475px] left-1/2 -translate-x-1/2 font-jakarta text-[13px] text-red-500 text-center">
          {error}
        </p>
      )}

      {/* Send OTP button */}
      <div className="absolute top-[558px] left-1/2 -translate-x-1/2">
        <GradientButton
          label={loading ? 'Sending...' : 'Send OTP'}
          onClick={handleSendOtp}
          disabled={!isReady}
          icon={<ArrowIcon />}
        />
      </div>

      {/* Terms */}
      <p className="absolute top-[635px] left-1/2 -translate-x-1/2 font-jakarta font-normal text-[12px] text-[#353535] text-center w-[317px]">
        By proceeding, I agree to the Term &amp; Condition &amp; Policy.
      </p>
    </div>
  )
}
