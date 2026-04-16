# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (Vite)
- **Dev server (network):** `npm run dev -- --host` (access from phone on same Wi-Fi)
- **Build:** `npm run build` (runs `tsc -b && vite build`)
- **Lint:** `npm run lint` (ESLint flat config)
- **Preview production build:** `npm run preview`

## Tech Stack

- React 19 + TypeScript (strict mode) with Vite 7
- Tailwind CSS 3 with PostCSS/Autoprefixer
- React Router DOM v7 for routing (BrowserRouter)
- Firebase 12 for push notifications (Cloud Messaging)
- Font: Plus Jakarta Sans (loaded via Google Fonts in `index.css`), utility: `font-jakarta`

## Architecture

### App Structure

Mobile-first AI English tutor rendered at a fixed 414×896px phone frame (`PhoneFrame` component). All screens are centered on a dark `#1a1a2e` background. The `#root` element uses `100dvh` (dynamic viewport height).

### Routing (`src/App.tsx`)

- Public: `/` (Splash), `/onboarding/:step` (1-3), `/login`, `/verify-otp`
- Protected (no nav): `/trial-offer`, `/assessment`, `/questionnaire/:step` (1-4), `/enter-name`, `/paywall`, `/lesson/:id`, `/profile/edit`, `/settings`
- Protected (with BottomNav via `MainLayout`): `/home`, `/ask-tutor`, `/profile`
- Auth gated by `ProtectedRoute` component checking `AuthContext`

### State Management

- `AuthContext` (`src/context/`) — React Context + useReducer for auth state (tokens, user, login/logout)
- Context definition split: `auth-context.ts` (context object) + `AuthContext.tsx` (provider component) to satisfy react-refresh lint rule
- No additional state management library

### Hooks (`src/hooks/`)

- `useAuth.ts` — Context accessor for AuthContext; throws if used outside AuthProvider
- `useApi.ts` — Generic data-fetching hook with `{ data, loading, error, refetch }`; uses mounted-ref to prevent state updates after unmount
- `useNotifications.ts` — Firebase FCM token registration/unregistration with module-level `onMessage` listener deduplication
- `useTimer.ts` — Countdown/interval utility

### API Layer (`src/lib/`)

- `api-client.ts` — Typed fetch wrapper (`get`, `post`, `patch`, `del`, `upload`) with Bearer token injection, auto-refresh on 401 (debounced via `isRefreshing` + `refreshPromise`), response envelope parsing. `upload<T>()` handles FormData/file uploads.
- `sse-client.ts` — POST-based SSE streaming for chat (fetch + ReadableStream), yields `ChatStreamEvent` objects
- `firebase.ts` — Lazy singleton Firebase init from env vars; exports `messaging: Messaging | null`; gracefully handles missing config or SW support
- `mock-data.ts` — Full mock responses for all endpoints when `VITE_USE_MOCKS=true`; dynamic route matching for parameterized paths
- `storage.ts` — localStorage helpers for JWT tokens (`fluently_access_token`, `fluently_refresh_token`)
- `constants.ts` — API base URL, `SAFE_AREA_TOP` (44px), `BOTTOM_NAV_HEIGHT` (76px), `ROUTES` object

### Screens (`src/screens/`)

17 screen components (Splash, Onboarding, Login, VerifyOtp, Home, AskTutor, Lesson, ProfileMenu, Settings, etc.). Screens use `absolute inset-0 overflow-hidden` layout pattern. Lesson screen uses `MediaRecorder` API + blob upload for speech recording.

### Types (`src/types/`)

- `models.ts` — Domain models: User, Module, Lesson, ChatMessage, Conversation, UserStats, Subscription, etc.
- `api.ts` — Response envelopes (`ApiResponse<T>`), request/response body types, SSE event types (`ChatStreamEvent`)

### Shared Components

- `src/components/layout/` — PhoneFrame, StatusBar, HomeIndicator, BottomNav, MainLayout
- `src/components/ui/` — GradientButton, SelectionOption, ProgressBar, BottomSheet
- `src/components/NumericKeyboard.tsx` — Shared keyboard for Login and VerifyOtp
- `src/components/ProtectedRoute.tsx` — Auth guard (loading spinner → redirect to `/login`)

### Design Tokens (`src/styles/tokens.ts`)

Extended in `tailwind.config.js`: colors (`primary` #8b5cf6, `primary-dark` #6d28d9, `text-primary` #2c3970, etc.), shadows (`button`, `card`, `key`), gradients (`purpleButton`: 138deg from #8b5cf6 to #6d28d9).

### Notifications

Firebase Cloud Messaging integrated into auth flow: `useNotifications.register()` called on login, `unregister()` on logout. Module-level deduplication prevents multiple `onMessage` listeners.

### Component Patterns

- Inline SVG icons as JSX components (not an icon library)
- Screens often define nested sub-components (e.g., `WeekCard`/`LessonRow` in Home)
- Gradient buttons use `linear-gradient(138deg, #8b5cf6 0%, #6d28d9 100%)` consistently

### TypeScript Config

- `erasableSyntaxOnly` and `verbatimModuleSyntax` enabled — must use `import type` for type-only imports
- Target: ES2022, Module: ESNext, JSX: react-jsx (automatic transform)

### Backend API Contract

Source of truth: `/Users/Work/Work/Fluently/fluenly-api/api-contract.md`
- Base URL: `https://api.fluently.app/v1`
- Auth: Bearer JWT via OTP phone flow
- Response envelope: `{ success, data, meta: { timestamp } }`
- Cursor-based pagination

### Environment Variables

```
VITE_API_BASE_URL              # API endpoint (default: https://api.fluently.app/v1)
VITE_USE_MOCKS=true            # Enable mock API mode (bypasses real API)
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_VAPID_KEY
```

### Cross-Repo Context

- **Backend repo**: `/Users/Work/Work/Fluently/fluenly-api` (Express + TypeScript + Prisma)
- **API Contract**: `/Users/Work/Work/Fluently/fluenly-api/api-contract.md` (source of truth for both repos)
- **Backend CLAUDE.md**: `/Users/Work/Work/Fluently/fluenly-api/CLAUDE.md`
- **Placeholder services**: OTP SMS, Chat AI, Lesson Feedback, Billing, Avatar Storage — all have contract interfaces ready for real implementations (see memory files for exact paths)
- **Backend implementation docs**: `/Users/Work/Work/Fluently/fluenly-api/docs/`
- **Obsidian project notes**: `/Users/Work/Documents/Obsidian Vault/Fluently/`
