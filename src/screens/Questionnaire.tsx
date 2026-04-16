import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProgressBar from '../components/ui/ProgressBar'
import SelectionOption from '../components/ui/SelectionOption'
import GradientButton, { ArrowIcon } from '../components/ui/GradientButton'
import { post } from '../lib/api-client'
import type { QuestionnaireData, SubmitQuestionnaireRequest } from '../types/api'
import type { LearningGoal, SpeakingChallenge, ThirtyDayGoal, DailyPracticeMinutes } from '../types/models'

interface StepConfig {
  question: string
  options: { label: string; value: string; sublabel?: string }[]
  field: keyof SubmitQuestionnaireRequest
}

const steps: StepConfig[] = [
  {
    question: 'Why do you want to learn english?',
    field: 'learning_goal',
    options: [
      { label: 'Crack job interviews', value: 'crack_interviews' },
      { label: 'Speak confidently', value: 'speak_confidently' },
      { label: 'Office communication', value: 'office_communication' },
      { label: 'Daily conversations', value: 'daily_conversations' },
    ],
  },
  {
    question: 'What happens when you speak English?',
    field: 'speaking_challenge',
    options: [
      { label: 'I freeze while speaking', value: 'freeze_while_speaking' },
      { label: 'I translate in my mind first', value: 'translate_in_mind' },
      { label: "Words don't come quickly", value: 'words_dont_come' },
      { label: 'I fear making mistakes', value: 'fear_mistakes' },
    ],
  },
  {
    question: 'What do you want to achieve in 30 days?',
    field: 'thirty_day_goal',
    options: [
      { label: 'Clear interviews easily', value: 'clear_interviews' },
      { label: 'Speak without hesitation', value: 'speak_without_hesitation' },
      { label: 'Sound confident & natural', value: 'sound_confident' },
      { label: 'Daily conversations', value: 'daily_conversations' },
    ],
  },
  {
    question: 'How much can you practice daily?',
    field: 'daily_practice_minutes',
    options: [
      { label: '10 min', value: '10', sublabel: 'Gradual' },
      { label: '15 min', value: '15', sublabel: 'Relaxed' },
      { label: '20 min', value: '20', sublabel: 'Accelerated' },
      { label: '30 min', value: '30', sublabel: 'Super accelerated' },
    ],
  },
]

export default function Questionnaire() {
  const navigate = useNavigate()
  const { step } = useParams()
  const current = parseInt(step || '1', 10)
  const stepConfig = steps[current - 1]

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const selectedValue = answers[stepConfig.field] || ''

  function handleSelect(value: string) {
    setAnswers((prev) => ({ ...prev, [stepConfig.field]: value }))
  }

  async function handleContinue() {
    if (!selectedValue) return

    if (current < 4) {
      navigate(`/questionnaire/${current + 1}`, { state: { answers: { ...answers, [stepConfig.field]: selectedValue } } })
      return
    }

    // Final step — submit questionnaire
    setLoading(true)
    try {
      const body: SubmitQuestionnaireRequest = {
        learning_goal: answers.learning_goal || selectedValue as LearningGoal,
        speaking_challenge: answers.speaking_challenge || '' as SpeakingChallenge,
        thirty_day_goal: answers.thirty_day_goal || '' as ThirtyDayGoal,
        daily_practice_minutes: parseInt(selectedValue) as DailyPracticeMinutes,
      }
      await post<QuestionnaireData>('/onboarding/questionnaire', body)
      navigate('/enter-name', { replace: true })
    } catch {
      // If already completed, just continue
      navigate('/enter-name', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative h-dvh overflow-hidden bg-gradient-to-b from-[#fef7fe] to-[#ecdffd]">
      {/* Progress */}
      <div className="absolute top-[60px] left-6 right-6">
        <ProgressBar current={current} total={4} />
      </div>

      {/* Question */}
      <div className="absolute top-[110px] left-6 right-6">
        <h1 className="font-jakarta font-bold text-[26px] text-text-primary leading-tight">
          {stepConfig.question}
        </h1>
      </div>

      {/* Options */}
      <div className="absolute top-[200px] left-6 right-6 flex flex-col gap-3">
        {stepConfig.options.map((opt) => (
          <SelectionOption
            key={opt.value}
            label={opt.label}
            sublabel={opt.sublabel}
            selected={selectedValue === opt.value}
            onClick={() => handleSelect(opt.value)}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="absolute bottom-[50px] left-1/2 -translate-x-1/2">
        <GradientButton
          label={loading ? 'Submitting...' : 'Continue'}
          onClick={handleContinue}
          disabled={!selectedValue || loading}
          icon={<ArrowIcon />}
        />
      </div>
    </div>
  )
}
