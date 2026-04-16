export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.fluently.app/v1'

/** Height reserved for the phone's native notification/status bar */
export const SAFE_AREA_TOP = 44

/** Height reserved for the bottom navigation bar (padding + icons + label + safe area) */
export const BOTTOM_NAV_HEIGHT = 76

export const ROUTES = {
  SPLASH: '/',
  ONBOARDING: '/onboarding/:step',
  LOGIN: '/login',
  VERIFY_OTP: '/verify-otp',
  TRIAL_OFFER: '/trial-offer',
  ASSESSMENT: '/assessment',
  QUESTIONNAIRE: '/questionnaire/:step',
  ENTER_NAME: '/enter-name',
  PAYWALL: '/paywall',
  HOME: '/home',
  ASK_TUTOR: '/ask-tutor',
  LESSON: '/lesson/:id',
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  SETTINGS: '/settings',
  CONTENT: '/content/:slug',
} as const
