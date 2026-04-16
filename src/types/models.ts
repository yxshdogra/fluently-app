export interface User {
  id: string
  name: string | null
  phone: string
  email: string | null
  avatar_url: string | null
  is_onboarded: boolean
  subscription_status: 'none' | 'trial' | 'active' | 'expired' | 'cancelled'
  created_at: string
  updated_at: string
}

export type LearningGoal = 'crack_interviews' | 'speak_confidently' | 'office_communication' | 'daily_conversations'
export type SpeakingChallenge = 'freeze_while_speaking' | 'translate_in_mind' | 'words_dont_come' | 'fear_mistakes'
export type ThirtyDayGoal = 'clear_interviews' | 'speak_without_hesitation' | 'sound_confident' | 'daily_conversations'
export type DailyPracticeMinutes = 10 | 15 | 20 | 30

export interface QuestionnaireAnswers {
  learning_goal: LearningGoal
  speaking_challenge: SpeakingChallenge
  thirty_day_goal: ThirtyDayGoal
  daily_practice_minutes: DailyPracticeMinutes
}

export interface Milestone {
  week: number
  label: string
}

export interface PersonalizedPlan {
  goal_label: string
  challenge_label: string
  daily_practice_minutes: number
  milestones: Milestone[]
  plan_features: string[]
  social_proof: string
}

export type ModuleStatus = 'locked' | 'in_progress' | 'completed'

export interface Module {
  id: string
  title: string
  week_number: number
  status: ModuleStatus
  lessons_completed: number
  lessons_total: number
  lessons: Lesson[]
}

export type LessonType = 'speaking_drill' | 'audio_response' | 'fluency_drill' | 'conversation'
export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'completed'

export interface LessonContent {
  prompt_text: string
  instructions: string
  background_image_url: string
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  type: LessonType
  duration_label: string
  status: LessonStatus
  order: number
  content: LessonContent
}

export interface UserStats {
  xp: number
  rating: number
  language: string
  current_streak_days: number
  lessons_completed: number
  total_practice_minutes: number
}

export type MessageRole = 'user' | 'tutor'

export interface ChatMessage {
  id: string
  conversation_id: string
  role: MessageRole
  content: string
  created_at: string
}

export interface Conversation {
  id: string
  user_id: string
  created_at: string
  last_message_at: string
  message_count: number
}

export interface ChatSuggestion {
  id: string
  label: string
  prompt: string
}

export type SubscriptionInterval = 'month' | 'year'

export interface SubscriptionPlan {
  id: string
  name: string
  interval: SubscriptionInterval
  price_amount: number
  price_currency: string
  monthly_equivalent: number
  badge: string | null
  description: string | null
}

export interface TrialOffer {
  price_amount: number
  price_currency: string
  duration_days: number
  auto_renew: boolean
  benefits: string[]
  warning_text: string
}

export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled' | 'pending'

export interface Subscription {
  id: string
  plan_id: string | null
  status: SubscriptionStatus
  trial_end_date: string | null
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  payment_url?: string
}

export interface WeekProgress {
  week: number
  status: ModuleStatus
  lessons_completed: number
  lessons_total: number
}

export interface UserProgress {
  current_week: number
  weeks_completed: number
  total_weeks: number
  weekly_progress: WeekProgress[]
}

export interface AppLanguage {
  code: string
  name: string
}

export interface UserSettings {
  language: string
  available_languages: AppLanguage[]
  notifications_enabled: boolean
  daily_reminder_time: string
}

export interface StaticContent {
  title: string
  content_html: string
  last_updated: string
  support_email?: string
}

export interface AudioFeedback {
  pronunciation_score: number
  fluency_score: number
  grammar_score: number
  overall_score: number
  suggestions: string[]
}

export interface LessonCompletionResult {
  lesson_id: string
  status: 'completed'
  xp_earned: number
  next_lesson: { id: string; title: string; status: LessonStatus } | null
  module_progress: { lessons_completed: number; lessons_total: number }
}

export interface DashboardData {
  greeting: string
  user_name: string
  is_premium: boolean
  stats: UserStats
  progress: UserProgress
  fluency_journey_label: string
}

export interface InvoiceData {
  invoice_url: string
  invoice_date: string
  amount: number
  currency: string
  plan_name: string
  status: string
}
