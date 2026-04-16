import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { get, post } from '../lib/api-client'
import type { PersonalizedPlan, SubscriptionPlansData, Subscription } from '../types/api'

export default function Paywall() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState('plan_yearly')
  const [loading, setLoading] = useState(false)

  const { data: plan } = useApi<PersonalizedPlan>(() => get('/users/me/personalized-plan'), [])
  const { data: plansData } = useApi<SubscriptionPlansData>(() => get('/subscriptions/plans'), [])

  async function handleSubscribe() {
    setLoading(true)
    try {
      if (selectedPlan === 'trial') {
        const sub = await post<Subscription>('/subscriptions/trial')
        if (sub.payment_url) window.open(sub.payment_url, '_blank')
      } else {
        const sub = await post<Subscription>('/subscriptions', { plan_id: selectedPlan })
        if (sub.payment_url) window.open(sub.payment_url, '_blank')
      }
      navigate('/home', { replace: true })
    } catch {
      navigate('/home', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative h-dvh overflow-hidden bg-gradient-to-b from-[#fef7fe] to-[#ecdffd]">
      <div className="absolute top-[44px] bottom-[140px] left-0 right-0 overflow-y-auto">
        <div className="px-6 pt-4 pb-6">
          {/* Header */}
          <h1 className="font-jakarta font-extrabold text-[26px] text-text-primary leading-tight text-center">
            Your Personal English{'\n'}Plan is Ready
          </h1>
          <p className="mt-2 font-jakarta text-[13px] text-primary text-center font-semibold">
            Plan tailored using your answers
          </p>

          {/* Summary cards */}
          {plan && (
            <div className="mt-5 flex flex-col gap-2">
              <div className="bg-white/80 rounded-[14px] px-4 py-3 flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-full bg-[rgba(139,92,246,0.1)] flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="#8b5cf6" strokeWidth="2"/>
                    <circle cx="10" cy="10" r="4" stroke="#8b5cf6" strokeWidth="2"/>
                    <circle cx="10" cy="10" r="1" fill="#8b5cf6"/>
                  </svg>
                </div>
                <div>
                  <span className="font-jakarta text-[12px] text-text-muted">Goal</span>
                  <p className="font-jakarta font-semibold text-[14px] text-text-primary">{plan.goal_label}</p>
                </div>
              </div>
              <div className="bg-white/80 rounded-[14px] px-4 py-3 flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-full bg-[rgba(139,92,246,0.1)] flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="2" y="4" width="16" height="12" rx="3" stroke="#8b5cf6" strokeWidth="2"/>
                    <path d="M2 8L10 13L18 8" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <span className="font-jakarta text-[12px] text-text-muted">Challenge</span>
                  <p className="font-jakarta font-semibold text-[14px] text-text-primary">{plan.challenge_label}</p>
                </div>
              </div>
              <div className="bg-white/80 rounded-[14px] px-4 py-3 flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-full bg-[rgba(139,92,246,0.1)] flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="#8b5cf6" strokeWidth="2"/>
                    <path d="M10 5V10L13 13" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <span className="font-jakarta text-[12px] text-text-muted">Daily practice</span>
                  <p className="font-jakarta font-semibold text-[14px] text-text-primary">{plan.daily_practice_minutes} mins/day</p>
                </div>
              </div>
            </div>
          )}

          {/* Plan features */}
          {plan && (
            <div className="mt-5 bg-white/80 rounded-[16px] p-5">
              <h3 className="font-jakarta font-bold text-[16px] text-text-primary mb-3">
                30-Day Fluency Plan
              </h3>
              <div className="flex flex-col gap-2.5">
                {plan.plan_features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="9" fill="#8b5cf6" />
                      <path d="M5 9L8 12L13 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-jakarta text-[14px] text-text-primary">{f}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 font-jakarta text-[13px] text-primary font-semibold">
                {plan.social_proof}
              </p>
            </div>
          )}

          {/* Milestones timeline */}
          {plan && (
            <div className="mt-5">
              <h3 className="font-jakarta font-bold text-[16px] text-text-primary mb-3">
                Your Transformation
              </h3>
              <div className="flex flex-col gap-3">
                {plan.milestones.map((m) => (
                  <div key={m.week} className="flex items-center gap-3">
                    <div className="w-[36px] h-[36px] rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-jakarta font-bold text-[12px] text-primary">W{m.week}</span>
                    </div>
                    <span className="font-jakarta text-[14px] text-text-primary">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          {plansData && (
            <div className="mt-6 flex flex-col gap-3">
              {plansData.plans.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={`relative w-full rounded-[16px] px-5 py-4 border-2 text-left cursor-pointer transition-all ${
                    selectedPlan === p.id
                      ? 'bg-primary/5 border-primary'
                      : 'bg-white/80 border-transparent'
                  }`}
                >
                  {p.badge && (
                    <span className="absolute -top-3 left-4 bg-primary text-white font-jakarta font-bold text-[10px] px-3 py-1 rounded-full uppercase">
                      {p.badge}
                    </span>
                  )}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-jakarta font-bold text-[16px] text-text-primary">{p.name}</p>
                      {p.description && (
                        <p className="font-jakarta text-[12px] text-text-muted mt-0.5">{p.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-jakarta font-bold text-[18px] text-text-primary">
                        ₹{p.monthly_equivalent}<span className="text-[13px] font-normal">/mo</span>
                      </p>
                      {p.interval === 'year' && (
                        <p className="font-jakarta text-[12px] text-text-muted">₹{p.price_amount}/yr</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {/* Trial option */}
              <button
                onClick={() => setSelectedPlan('trial')}
                className={`w-full rounded-[16px] px-5 py-4 border-2 text-left cursor-pointer transition-all ${
                  selectedPlan === 'trial'
                    ? 'bg-primary/5 border-primary'
                    : 'bg-white/80 border-transparent'
                }`}
              >
                <p className="font-jakarta font-semibold text-[14px] text-primary text-center">
                  Special price for you: 7-day trial for ₹{plansData.trial_offer.price_amount}
                </p>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm px-6 pt-3 pb-8">
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full h-[56px] rounded-[100px] flex items-center justify-center gap-2 text-white font-jakarta font-bold text-[16px] border-none cursor-pointer shadow-button"
          style={{ background: 'linear-gradient(138deg, #8b5cf6 0%, #6d28d9 100%)' }}
        >
          {loading ? 'Processing...' : selectedPlan === 'trial' ? 'Start My Personalized Plan for ₹9' : 'Subscribe Now'}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10H16M11 5L16 10L11 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex justify-center gap-4 mt-3">
          {['Cancel anytime', 'Secure payment', 'No hidden charges'].map((t) => (
            <span key={t} className="font-jakarta text-[11px] text-[#64748b]">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
