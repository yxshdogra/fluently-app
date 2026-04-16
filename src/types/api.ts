import type {
  User,
  PersonalizedPlan,
  SubscriptionPlan,
  TrialOffer,
  Subscription,
  Module,
  Lesson,
  ChatMessage,
  ChatSuggestion,
  Conversation,
  UserStats,
  UserSettings,
  StaticContent,
  DashboardData,
  AudioFeedback,
  LessonCompletionResult,
  InvoiceData,
} from './models'

// Response envelopes
export interface ApiResponse<T> {
  success: true
  data: T
  meta: { timestamp: string }
}

export interface PaginatedResponse<T> {
  success: true
  data: T[]
  pagination: { next_cursor: string | null; has_more: boolean }
}

export interface ApiErrorResponse {
  success: false
  error: { code: string; message: string; details?: Record<string, string> }
  meta: { timestamp: string }
}

// Request bodies
export interface SendOtpRequest {
  phone: string
}

export interface VerifyOtpRequest {
  phone: string
  otp: string
}

export interface ResendOtpRequest {
  phone: string
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface UpdateUserRequest {
  name?: string
  email?: string
}

export interface SubmitQuestionnaireRequest {
  learning_goal: string
  speaking_challenge: string
  thirty_day_goal: string
  daily_practice_minutes: number
}

export interface CreateSubscriptionRequest {
  plan_id: string
}

export interface SendMessageRequest {
  content: string
}

export interface UpdateSettingsRequest {
  language?: string
  notifications_enabled?: boolean
  daily_reminder_time?: string
}

export interface RegisterFcmTokenRequest {
  token: string
  platform: 'web' | 'android' | 'ios'
}

// Response data types
export interface OtpSendData {
  otp_sent: boolean
  phone_masked: string
  expires_in_seconds: number
  resend_cooldown_seconds: number
}

export interface OtpVerifyData {
  access_token: string
  refresh_token: string
  token_type: 'Bearer'
  expires_in: number
  user: User
  is_new_user: boolean
}

export interface OtpResendData {
  otp_sent: boolean
  resend_cooldown_seconds: number
}

export interface TokenRefreshData {
  access_token: string
  refresh_token: string
  token_type: 'Bearer'
  expires_in: number
}

export interface QuestionnaireData {
  questionnaire_completed: boolean
  personalized_plan: PersonalizedPlan
}

export interface SubscriptionPlansData {
  trial_offer: TrialOffer
  plans: SubscriptionPlan[]
}

export interface AvatarData {
  avatar_url: string | null
}

export interface ChatMessagesData {
  user_message: ChatMessage
  tutor_message: ChatMessage
}

// SSE streaming events
export interface MessageStartEvent {
  type: 'message_start'
  user_message_id: string
  tutor_message_id: string
}

export interface DeltaEvent {
  type: 'delta'
  text: string
}

export interface MessageEndEvent {
  type: 'message_end'
  tutor_message_id: string
  finish_reason: string
}

export interface StreamErrorEvent {
  type: 'error'
  code: string
  message: string
}

export type ChatStreamEvent = MessageStartEvent | DeltaEvent | MessageEndEvent | StreamErrorEvent

// Convenience re-exports for response data
export type {
  User,
  PersonalizedPlan,
  SubscriptionPlan,
  TrialOffer,
  Subscription,
  Module,
  Lesson,
  ChatMessage,
  ChatSuggestion,
  Conversation,
  UserStats,
  UserSettings,
  StaticContent,
  DashboardData,
  AudioFeedback,
  LessonCompletionResult,
  InvoiceData,
}
