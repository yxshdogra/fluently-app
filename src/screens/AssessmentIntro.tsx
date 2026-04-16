import { useNavigate } from 'react-router-dom'
import GradientButton, { ArrowIcon } from '../components/ui/GradientButton'

export default function AssessmentIntro() {
  const navigate = useNavigate()

  return (
    <div className="relative h-dvh overflow-hidden bg-gradient-to-b from-[#faf2fd] to-[#ecdffd] flex flex-col items-center justify-center">
      {/* Content */}
      <div className="flex flex-col items-center text-center px-10 mb-24">
        <h1 className="font-jakarta font-medium text-[28px] text-black leading-tight">
          Let's build your English confidence.
        </h1>
        <p className="mt-4 font-jakarta font-medium text-[16px] text-black">
          Takes 20 seconds.
        </p>
      </div>

      {/* CTA */}
      <div className="absolute bottom-[50px] left-1/2 -translate-x-1/2">
        <GradientButton
          label="Continue"
          onClick={() => navigate('/questionnaire/1')}
          icon={<ArrowIcon />}
        />
      </div>
    </div>
  )
}
