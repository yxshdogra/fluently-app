import type {
  OtpSendData,
  OtpVerifyData,
  OtpResendData,
  QuestionnaireData,
  SubscriptionPlansData,
  ChatStreamEvent,
} from '../types/api'
import type {
  User,
  PersonalizedPlan,
  DashboardData,
  Module,
  Lesson,
  ChatSuggestion,
  Conversation,
  ChatMessage,
  UserSettings,
  StaticContent,
  Subscription,
  InvoiceData,
  AudioFeedback,
  LessonCompletionResult,
} from '../types/models'

const mockUser: User = {
  id: 'usr_abc123',
  name: 'Sachin Kumar',
  phone: '+919483898443',
  email: null,
  avatar_url: null,
  is_onboarded: false,
  subscription_status: 'none',
  created_at: '2026-02-28T10:00:00Z',
  updated_at: '2026-02-28T10:00:00Z',
}

const mockPlan: PersonalizedPlan = {
  goal_label: 'Office communication',
  challenge_label: "Words don't come quickly",
  daily_practice_minutes: 20,
  milestones: [
    { week: 1, label: 'Stop translating in mind' },
    { week: 2, label: 'Speak without hesitation' },
    { week: 4, label: 'Sound confident & natural' },
  ],
  plan_features: [
    'Daily speaking practice (20 mins)',
    'Real-life office conversation practice',
    'Interview confidence training',
    'AI speaking partner',
    'Weekly progress tracking',
  ],
  social_proof: '92% learners improved confidence in 21 days',
}

const mockLessons: Lesson[] = [
  {
    id: 'les_001',
    module_id: 'mod_w1',
    title: "Yesterday's activities",
    type: 'speaking_drill',
    duration_label: '5 min',
    status: 'completed',
    order: 1,
    content: {
      prompt_text: "Hi! I'm your AI English tutor. Let's start by recording a quick introduction.",
      instructions: 'Record yourself speaking for 60 seconds about your day.',
      background_image_url: '',
    },
  },
  {
    id: 'les_002',
    module_id: 'mod_w1',
    title: 'Your weekend story',
    type: 'speaking_drill',
    duration_label: '5 min',
    status: 'completed',
    order: 2,
    content: {
      prompt_text: 'Tell me about your last weekend. What did you do?',
      instructions: 'Speak naturally about your weekend activities.',
      background_image_url: '',
    },
  },
  {
    id: 'les_003',
    module_id: 'mod_w1',
    title: 'Introduce yourself',
    type: 'audio_response',
    duration_label: '5 min',
    status: 'in_progress',
    order: 3,
    content: {
      prompt_text: 'Introduce yourself as if you were meeting a colleague for the first time.',
      instructions: 'Record a 60-second introduction.',
      background_image_url: '',
    },
  },
  {
    id: 'les_004',
    module_id: 'mod_w1',
    title: 'Daily routines',
    type: 'fluency_drill',
    duration_label: '5 min',
    status: 'locked',
    order: 4,
    content: {
      prompt_text: 'Describe your typical morning routine.',
      instructions: 'Speak clearly and use transition words.',
      background_image_url: '',
    },
  },
  {
    id: 'les_005',
    module_id: 'mod_w1',
    title: 'Week 1 conversation',
    type: 'conversation',
    duration_label: '10 min',
    status: 'locked',
    order: 5,
    content: {
      prompt_text: "Let's have a free conversation to review what you learned this week.",
      instructions: 'Talk about any topic you like for 5-10 minutes.',
      background_image_url: '',
    },
  },
]

const mockModules: Module[] = [
  {
    id: 'mod_w1',
    title: 'Week 1 — Basics of Speaking',
    week_number: 1,
    status: 'in_progress',
    lessons_completed: 2,
    lessons_total: 5,
    lessons: mockLessons,
  },
  {
    id: 'mod_w2',
    title: 'Week 2 — Building Fluency',
    week_number: 2,
    status: 'locked',
    lessons_completed: 0,
    lessons_total: 5,
    lessons: [],
  },
  {
    id: 'mod_w3',
    title: 'Week 3 — Real Conversations',
    week_number: 3,
    status: 'locked',
    lessons_completed: 0,
    lessons_total: 5,
    lessons: [],
  },
  {
    id: 'mod_w4',
    title: 'Week 4 — Confidence Mastery',
    week_number: 4,
    status: 'locked',
    lessons_completed: 0,
    lessons_total: 5,
    lessons: [],
  },
]

const mockDashboard: DashboardData = {
  greeting: 'Good evening',
  user_name: 'Sachin',
  is_premium: false,
  stats: {
    xp: 12,
    rating: 4.9,
    language: 'ENG',
    current_streak_days: 3,
    lessons_completed: 7,
    total_practice_minutes: 45,
  },
  progress: {
    current_week: 1,
    weeks_completed: 0,
    total_weeks: 4,
    weekly_progress: [
      { week: 1, status: 'in_progress', lessons_completed: 2, lessons_total: 5 },
      { week: 2, status: 'locked', lessons_completed: 0, lessons_total: 5 },
      { week: 3, status: 'locked', lessons_completed: 0, lessons_total: 5 },
      { week: 4, status: 'locked', lessons_completed: 0, lessons_total: 5 },
    ],
  },
  fluency_journey_label: "You're on Week 1 — Keep going!",
}

const mockConversation: Conversation = {
  id: 'conv_xyz',
  user_id: 'usr_abc123',
  created_at: '2026-02-28T10:00:00Z',
  last_message_at: '2026-02-28T10:05:00Z',
  message_count: 4,
}

const mockMessages: ChatMessage[] = [
  {
    id: 'msg_001',
    conversation_id: 'conv_xyz',
    role: 'tutor',
    content: "Hello! I'm your English tutor. How can I help you practice today? We could discuss travel, work, or hobbies!",
    created_at: '2026-02-28T10:02:00Z',
  },
]

const mockSuggestions: ChatSuggestion[] = [
  { id: 'sug_grammar', label: 'Grammar Help', prompt: 'Help me with English grammar' },
  { id: 'sug_speaking', label: 'Speaking Practice', prompt: "Let's practice speaking English" },
  { id: 'sug_vocabulary', label: 'Vocabulary', prompt: 'Help me expand my English vocabulary' },
]

const mockSettings: UserSettings = {
  language: 'en',
  available_languages: [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
  ],
  notifications_enabled: true,
  daily_reminder_time: '09:00',
}

const mockSubscriptionPlans: SubscriptionPlansData = {
  trial_offer: {
    price_amount: 9,
    price_currency: 'INR',
    duration_days: 7,
    auto_renew: false,
    benefits: ['Speak with Confidence', 'Crack Interviews', 'Ace Exams'],
    warning_text: 'Missing this offer could slow your progress',
  },
  plans: [
    {
      id: 'plan_yearly',
      name: 'Yearly Plan',
      interval: 'year',
      price_amount: 799,
      price_currency: 'INR',
      monthly_equivalent: 67,
      badge: 'BEST FOR YOUR GOAL',
      description: 'Matches your 20-min daily plan',
    },
    {
      id: 'plan_monthly',
      name: 'Monthly Plan',
      interval: 'month',
      price_amount: 199,
      price_currency: 'INR',
      monthly_equivalent: 199,
      badge: null,
      description: null,
    },
  ],
}

// Route-based mock handler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockRoutes: Record<string, Record<string, () => any>> = {
  '/auth/otp/send': {
    POST: (): OtpSendData => ({
      otp_sent: true,
      phone_masked: '+91XXXXXXX443',
      expires_in_seconds: 300,
      resend_cooldown_seconds: 30,
    }),
  },
  '/auth/otp/verify': {
    POST: (): OtpVerifyData => ({
      access_token: 'mock_access_token_xyz',
      refresh_token: 'mock_refresh_token_xyz',
      token_type: 'Bearer',
      expires_in: 3600,
      user: { ...mockUser, is_onboarded: false },
      is_new_user: true,
    }),
  },
  '/auth/otp/resend': {
    POST: (): OtpResendData => ({
      otp_sent: true,
      resend_cooldown_seconds: 30,
    }),
  },
  '/auth/token/refresh': {
    POST: () => ({
      access_token: 'mock_refreshed_token',
      refresh_token: 'mock_new_refresh_token',
      token_type: 'Bearer',
      expires_in: 3600,
    }),
  },
  '/auth/logout': {
    POST: () => ({ logged_out: true }),
  },
  '/users/me': {
    GET: () => mockUser,
    PATCH: () => mockUser,
    DELETE: () => ({ message: 'Account deleted successfully' }),
  },
  '/users/me/avatar': {
    POST: () => ({ avatar_url: 'https://cdn.fluently.app/avatars/mock.jpg' }),
    DELETE: () => ({ avatar_url: null }),
  },
  '/users/me/dashboard': {
    GET: () => mockDashboard,
  },
  '/users/me/stats': {
    GET: () => mockDashboard.stats,
  },
  '/users/me/personalized-plan': {
    GET: () => mockPlan,
  },
  '/onboarding/questionnaire': {
    POST: (): QuestionnaireData => ({
      questionnaire_completed: true,
      personalized_plan: mockPlan,
    }),
  },
  '/subscriptions/plans': {
    GET: () => mockSubscriptionPlans,
  },
  '/subscriptions/trial': {
    POST: (): Subscription => ({
      id: 'sub_trial_abc',
      plan_id: null,
      status: 'trial',
      trial_end_date: '2026-03-07T10:00:00Z',
      current_period_start: '2026-02-28T10:00:00Z',
      current_period_end: '2026-03-07T10:00:00Z',
      cancel_at_period_end: true,
      created_at: '2026-02-28T10:00:00Z',
      payment_url: 'https://pay.fluently.app/checkout/mock',
    }),
  },
  '/subscriptions': {
    POST: (): Subscription => ({
      id: 'sub_abc123',
      plan_id: 'plan_yearly',
      status: 'pending',
      trial_end_date: null,
      current_period_start: '2026-02-28T10:00:00Z',
      current_period_end: '2027-02-28T10:00:00Z',
      cancel_at_period_end: false,
      created_at: '2026-02-28T10:00:00Z',
      payment_url: 'https://pay.fluently.app/checkout/mock',
    }),
  },
  '/subscriptions/me': {
    GET: (): Subscription | null => null,
  },
  '/subscriptions/me/cancel': {
    POST: () => ({
      id: 'sub_abc123',
      status: 'active',
      cancel_at_period_end: true,
      current_period_end: '2027-02-28T10:00:00Z',
    }),
  },
  '/subscriptions/me/invoice': {
    GET: (): InvoiceData => ({
      invoice_url: 'https://cdn.fluently.app/invoices/mock.pdf',
      invoice_date: '2026-02-28',
      amount: 799,
      currency: 'INR',
      plan_name: 'Yearly Plan',
      status: 'paid',
    }),
  },
  '/modules': {
    GET: () => mockModules,
  },
  '/chat/suggestions': {
    GET: () => mockSuggestions,
  },
  '/chat/conversations': {
    POST: () => mockConversation,
  },
  '/settings': {
    GET: () => mockSettings,
    PATCH: () => mockSettings,
  },
  '/users/fcm-token': {
    POST: () => ({}),
  },
  '/content/privacy-policy': {
    GET: (): StaticContent => ({
      title: 'Privacy Policy',
      content_html: '<h1>Privacy Policy</h1><p>Your privacy is important to us. This policy describes how we collect, use, and protect your data.</p>',
      last_updated: '2026-01-15',
    }),
  },
  '/content/terms-and-conditions': {
    GET: (): StaticContent => ({
      title: 'Terms & Conditions',
      content_html: '<h1>Terms & Conditions</h1><p>By using Fluently, you agree to these terms.</p>',
      last_updated: '2026-01-15',
    }),
  },
  '/content/refund-policy': {
    GET: (): StaticContent => ({
      title: 'Refund Policy',
      content_html: '<h1>Refund Policy</h1><p>We offer refunds within 7 days of purchase.</p>',
      last_updated: '2026-01-15',
    }),
  },
  '/content/help-support': {
    GET: (): StaticContent => ({
      title: 'Help & Support',
      content_html: '<h1>Help & Support</h1><p>Contact us at support@fluently.app</p>',
      last_updated: '2026-01-15',
      support_email: 'support@fluently.app',
    }),
  },
}

// Dynamic route patterns (with path params)
function matchRoute(path: string, method: string) {
  // Check exact match first
  if (mockRoutes[path]?.[method]) {
    return mockRoutes[path][method]
  }

  // Check dynamic routes
  const lessonMatch = path.match(/^\/lessons\/(.+?)(?:\/(.+))?$/)
  if (lessonMatch) {
    const lessonId = lessonMatch[1]
    const subpath = lessonMatch[2]
    const lesson = mockLessons.find((l) => l.id === lessonId) || mockLessons[0]

    if (!subpath && method === 'GET') return () => lesson
    if (subpath === 'audio' && method === 'POST') {
      return (): { submission_id: string; lesson_id: string; duration_seconds: number; feedback: AudioFeedback; xp_earned: number } => ({
        submission_id: 'sub_audio_mock',
        lesson_id: lessonId,
        duration_seconds: 62,
        feedback: {
          pronunciation_score: 7.2,
          fluency_score: 6.8,
          grammar_score: 8.1,
          overall_score: 7.4,
          suggestions: [
            'Try to slow down when pronouncing longer words.',
            'Good use of past tense verbs!',
          ],
        },
        xp_earned: 5,
      })
    }
    if (subpath === 'complete' && method === 'POST') {
      return (): LessonCompletionResult => ({
        lesson_id: lessonId,
        status: 'completed',
        xp_earned: 5,
        next_lesson: { id: 'les_002', title: 'Your weekend story', status: 'available' },
        module_progress: { lessons_completed: 3, lessons_total: 5 },
      })
    }
  }

  const convMatch = path.match(/^\/chat\/conversations\/(.+?)\/messages$/)
  if (convMatch) {
    if (method === 'GET') return () => mockMessages
    if (method === 'POST') {
      return () => ({
        user_message: {
          id: 'msg_' + Date.now(),
          conversation_id: convMatch[1],
          role: 'user',
          content: 'Mock user message',
          created_at: new Date().toISOString(),
        },
        tutor_message: {
          id: 'msg_' + (Date.now() + 1),
          conversation_id: convMatch[1],
          role: 'tutor',
          content: "That's a great question! Let me help you with that.",
          created_at: new Date().toISOString(),
        },
      })
    }
  }

  return null
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getMockResponse<T>(path: string, method: string, _body?: unknown): T {
  const handler = matchRoute(path, method)
  if (handler) {
    return handler() as T
  }
  throw new Error(`No mock handler for ${method} ${path}`)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getMockStreamEvents(_content: string): ChatStreamEvent[] {
  const response = "That's a great question! Let me help you practice with that topic. "
  const words = response.split(' ')
  const events: ChatStreamEvent[] = [
    { type: 'message_start', user_message_id: 'msg_u_mock', tutor_message_id: 'msg_t_mock' },
    ...words.map((word) => ({ type: 'delta' as const, text: word + ' ' })),
    { type: 'message_end', tutor_message_id: 'msg_t_mock', finish_reason: 'complete' },
  ]
  return events
}
