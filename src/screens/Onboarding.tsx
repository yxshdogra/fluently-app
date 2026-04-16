import { useNavigate, useParams } from 'react-router-dom'
import HomeIndicator from '../components/layout/HomeIndicator'
import GradientButton, { ArrowIcon } from '../components/ui/GradientButton'

const slides = [
  {
    id: 1,
    title: 'Speak English\nConfidently',
    subtitle: 'Improve your speaking skills and gain confidence in English',
    bg: 'from-[#fef7fe] to-[#ecdffd]',
    image: '/images/onboarding-speak.svg',
  },
  {
    id: 2,
    title: 'Prepare for\nJob Interviews',
    subtitle: 'Practice answering interview questions and land your dream job',
    bg: 'from-[#fef7fe] to-[#ecdffd]',
    image: '/images/onboarding-interview.svg',
  },
  {
    id: 3,
    title: 'Ace your Exams',
    subtitle: 'Improve your English and pass your important tests with confidence',
    bg: 'from-[#fef7fe] to-[#ecdffd]',
    image: '/images/onboarding-exam.svg',
  },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { step } = useParams()
  const current = parseInt(step || '1', 10)
  const slide = slides[current - 1]

  function handleContinue() {
    if (current < 3) navigate(`/onboarding/${current + 1}`)
    else navigate('/login')
  }

  function handleSkip() {
    navigate('/login')
  }

  return (
    <div className={`relative h-dvh overflow-hidden bg-gradient-to-b ${slide.bg}`}>
      {/* Skip */}
      <button
        onClick={handleSkip}
        className="absolute top-[54px] right-6 font-jakarta text-[16px] text-[#2a1e1e] bg-transparent border-none cursor-pointer z-10"
      >
        Skip
      </button>

      {/* Content */}
      <div className="absolute top-[80px] left-0 right-0 px-8 flex flex-col items-center text-center">
        <h1 className="font-jakarta font-bold text-[36px] leading-[45px] text-text-primary whitespace-pre-line">
          {slide.title}
        </h1>
        <p className="mt-4 font-jakarta font-medium text-[16px] leading-[21px] text-text-muted max-w-[300px]">
          {slide.subtitle}
        </p>
      </div>

      {/* Illustration */}
      <div className="absolute top-[220px] left-0 right-0 flex items-center justify-center pointer-events-none">
        <img src={slide.image} alt="" className="w-[300px] h-[300px] object-contain" />
      </div>

      {/* Illustration overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(241,229,253,0.6)] pointer-events-none" />

      {/* Dots */}
      <div className="absolute bottom-[151px] left-1/2 -translate-x-1/2 flex gap-2 items-center">
        {slides.map((s) => (
          <div
            key={s.id}
            className={`rounded-full transition-all duration-300 ${
              s.id === current
                ? 'w-[14px] h-[14px] bg-dot-active'
                : 'w-[10px] h-[10px] bg-white'
            }`}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="absolute bottom-[41px] left-1/2 -translate-x-1/2">
        <GradientButton label="Continue" onClick={handleContinue} icon={<ArrowIcon />} />
      </div>

      <HomeIndicator opacity="opacity-60" />
    </div>
  )
}
