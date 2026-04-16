import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { post } from '../lib/api-client'
import type { Subscription } from '../types/api'

export default function TrialOffer() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const benefits = [
    { label: 'Speak with Confidence', image: '/images/speak-confidence.svg' },
    { label: 'Crack Interviews', image: '/images/crack-interviews.svg' },
    { label: 'Ace Exams', image: '/images/ace-exams.svg' },
  ]

  async function handleStartTrial() {
    setLoading(true)
    try {
      const data = await post<Subscription>('/subscriptions/trial')
      if (data.payment_url) {
        window.open(data.payment_url, '_blank')
      }
      navigate('/assessment', { replace: true })
    } catch {
      navigate('/assessment', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    navigate('/assessment', { replace: true })
  }

  return (
    <div className="relative h-dvh overflow-hidden bg-gradient-to-b from-[#fef7fe] to-[#ecdffd]">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-[59px] right-[15px] w-10 h-10 flex items-center justify-center rounded-full bg-white border-none cursor-pointer z-10 shadow-[0px_2px_8px_rgba(0,0,0,0.04)]"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1L13 13M13 1L1 13" stroke="#2c3970" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Heading */}
      <div className="absolute top-[94px] left-0 right-0 px-8 flex flex-col items-center text-center">
        <h1 className="font-jakarta font-extrabold text-[32px] text-text-primary leading-tight tracking-[-1px]">
          Your Future Needs{'\n'}
          <span className="text-[#7c3aed]">Good English</span>
        </h1>
      </div>

      {/* Subtitle */}
      <div className="absolute top-[184px] left-0 right-0 px-10 text-center">
        <p className="font-jakarta font-medium text-[16px] text-[#6b7280] leading-snug">
          Without fluent English, you'll miss{'\n'}life-changing opportunities.
        </p>
      </div>

      {/* Benefits carousel */}
      <div className="absolute top-[279px] left-0 right-0 h-[180px] overflow-hidden">
        <div
          className="flex gap-3 pl-6"
          style={{ animation: 'carousel-scroll 20s linear infinite', width: 'max-content' }}
          onMouseEnter={(e) => { e.currentTarget.style.animationPlayState = 'paused' }}
          onMouseLeave={(e) => { e.currentTarget.style.animationPlayState = 'running' }}
        >
          {[...benefits, ...benefits].map((b, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[140px] h-[180px] bg-white rounded-[8px] border border-[rgba(147,51,234,0.15)] shadow-[0px_8px_24px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden"
            >
              <img src={b.image} alt={b.label} className="w-full h-[124px] object-cover" />
              <div className="flex-1 flex items-center justify-center px-3">
                <span className="font-jakarta font-bold text-[13px] text-[#0f1724] text-center leading-tight">
                  {b.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium heading */}
      <div className="absolute top-[514px] left-0 right-0 px-8 flex flex-col items-center text-center">
        <h2 className="font-jakarta font-extrabold text-[26px] text-[#0f1724] leading-tight tracking-[-0.5px]">
          Get 7 days of Premium{'\n'}for just <span className="text-[#7c3aed]">₹9</span>
        </h2>
      </div>

      {/* Premium subtitle */}
      <div className="absolute top-[595px] left-0 right-0 px-10 text-center">
        <p className="font-jakarta font-medium text-[15px] text-[#6b7280]">
          Practice daily and become a fluent,{'\n'}confident English speaker
        </p>
      </div>

      {/* Sticky footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#f7f5fb] border-t border-[rgba(147,51,234,0.08)] shadow-[0px_-8px_32px_rgba(0,0,0,0.04)] px-6 pt-6 pb-6">
        {/* Warning pill */}
        <div className="bg-[rgba(225,29,72,0.08)] rounded-[6px] py-3 px-4 flex items-center justify-center">
          <span className="font-jakarta font-semibold text-[13px] text-[#e11d48] text-center">
            😔 Missing this offer could slow your progress
          </span>
        </div>

        {/* CTA button */}
        <button
          onClick={handleStartTrial}
          disabled={loading}
          className="w-full h-[56px] rounded-[100px] flex items-center justify-center gap-2 text-white font-jakarta font-bold text-[16px] border-none cursor-pointer shadow-button mt-4"
          style={{ background: 'linear-gradient(138deg, #8b5cf6 0%, #6d28d9 100%)' }}
        >
          {loading ? 'Starting...' : 'Start Trial for ₹9'}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10H16M11 5L16 10L11 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Cancel line */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#6b7280" strokeWidth="1.2" />
            <path d="M5 8L7 10L11 6" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-jakarta font-medium text-[13px] text-[#6b7280]">
            Cancel anytime. No automatic renewal.
          </span>
        </div>
      </div>
    </div>
  )
}
