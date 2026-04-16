# Responsive Web Dashboard — Design Spec

**Date:** 2026-04-16
**Purpose:** Adapt the Fluently mobile-first app into a responsive web UI for investor demos, deployed via Vercel.

---

## Context

Fluently is a mobile-first AI English tutor app built with React 19 + Vite. All screens render at a fixed 414x896px phone frame centered on a dark background. The goal is to make the app work natively in desktop and mobile browsers — no phone mockup, true responsive web — so stakeholders can interact with it via a shareable URL.

## Approach

**Responsive Shell + Tailwind Breakpoints** — a single `md:` breakpoint (768px) drives layout switching. Existing screens get responsive Tailwind classes; only Lesson needs structural refactoring.

## Breakpoint Strategy

| Viewport | Behavior |
|----------|----------|
| `< 768px` | Current mobile layout, BottomNav at bottom |
| `>= 768px` | Sidebar nav on left, wider content with max-width containers |

---

## 1. Responsive App Shell

**File:** `src/components/layout/MainLayout.tsx` (modify existing)

Replace current MainLayout with a responsive shell:

**Mobile (`< md`):**
- Vertical flex: `<Outlet />` (flex-1) + `<BottomNav />` (bottom)
- Same as current behavior

**Desktop (`>= md`):**
- Horizontal flex: `<Sidebar />` (fixed 240px, left) + `<main>` (flex-1, scrollable)
- BottomNav hidden via `md:hidden`
- Sidebar shown via `hidden md:flex`

### Sidebar Component

**New file:** `src/components/layout/Sidebar.tsx`

- Fixed 240px width, full viewport height
- App logo/name at top
- 3 navigation items: Home, Ask Tutor, Profile (same as BottomNav)
- Active state: purple highlight matching existing `primary` color
- Background: white with subtle left border or bottom divider for separation
- Uses `NavLink` from react-router-dom for active state detection

## 2. Screen Adaptations

### Home (`src/screens/Home.tsx`)

- Wrap scrollable content in `max-w-5xl mx-auto` container
- WeekCards section: `md:grid md:grid-cols-2 md:gap-4` (2-column grid on desktop)
- Carousel: constrain to `max-w-5xl`, disable auto-scroll on desktop, show cards in a wrapping flex/grid instead
- Progress card: stretches naturally within container
- Header greeting: left-aligned, scales with container

### AskTutor (`src/screens/AskTutor.tsx`)

- Chat container: `max-w-3xl mx-auto`
- Message bubbles: `max-w-[80%] md:max-w-[50%]`
- Input area: constrained to match chat container width
- Tutor profile section: remains centered
- Suggestion chips: remains horizontal scroll

### Lesson (`src/screens/Lesson.tsx`) — Major Refactor

Current layout uses hardcoded absolute positioning (`top-[200px]`, `top-[440px]`, `bottom-[100px]`). Restructure to:

```
flex flex-col h-full
  ├── Header (flex-shrink-0) — back button + stat badges
  ├── Content (flex-1 overflow-y-auto) — lesson card + feedback
  │     └── max-w-2xl mx-auto
  └── Controls (flex-shrink-0) — recording buttons + CTA
        └── max-w-2xl mx-auto
```

- Remove all absolute positioning with pixel offsets
- Header: horizontal flex with back button and stat badges
- Content area: scrollable, contains lesson prompt card and feedback card (when present)
- Controls: fixed at bottom, recording button + action CTA
- Feedback card renders inline below lesson content (not at a fixed pixel offset)

### ProfileMenu (`src/screens/ProfileMenu.tsx`)

- Add `max-w-lg mx-auto` to menu container
- No structural changes — already responsive

### Settings (`src/screens/Settings.tsx`)

- Replace absolute positioning (`top-[50px]`, `top-[110px]`) with flex column
- Add `max-w-lg mx-auto` to settings container
- Header and settings items flow naturally

## 3. Phone Frame Removal

**File:** `src/components/ProtectedRoute.tsx`

- Loading state: remove fixed `w-[414px] h-[896px] rounded-[40px]` frame
- Replace with full-viewport centered spinner (matching app gradient background)
- All screens already use `h-dvh` — they fill the browser naturally once the frame is removed

## 4. Screens NOT Modified

These screens are excluded from responsive adaptation (investor demo doesn't need them):

- Splash (`/`)
- Onboarding steps (`/onboarding/:step`)
- Login (`/login`)
- VerifyOtp (`/verify-otp`)
- TrialOffer, Assessment, Questionnaire, EnterName, Paywall

These screens also use `h-dvh` and will fill the browser viewport on desktop. Since they have centered content with padding, they'll look acceptable but wide. To prevent them from stretching awkwardly, wrap each in a `max-w-md mx-auto` container so they stay phone-width centered — simple and consistent with the "demo on desktop" goal.

## 5. Deployment — Vercel

1. Connect GitHub repo (`fluently-app`) to Vercel
2. Framework auto-detected: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variables to set:
   - `VITE_API_BASE_URL`
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_VAPID_KEY`
6. SPA fallback: Vercel handles automatically for Vite projects
7. Result: shareable `*.vercel.app` URL

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/layout/Sidebar.tsx` | Desktop sidebar navigation |

## Files to Modify

| File | Change |
|------|--------|
| `src/components/layout/MainLayout.tsx` | Responsive shell (sidebar vs bottom nav) |
| `src/components/layout/BottomNav.tsx` | Add `md:hidden` |
| `src/components/ProtectedRoute.tsx` | Remove fixed phone frame dimensions |
| `src/screens/Home.tsx` | Max-width container, 2-col grid for WeekCards |
| `src/screens/AskTutor.tsx` | Max-width container, narrower message bubbles |
| `src/screens/Lesson.tsx` | Full layout refactor: absolute → flex |
| `src/screens/Settings.tsx` | Absolute → flex, max-width container |
| `src/screens/ProfileMenu.tsx` | Max-width container |

## Verification

1. **Desktop browser (>= 768px):** Sidebar visible, BottomNav hidden, content fills width with max-width constraints, all 5 screens render correctly
2. **Mobile browser (< 768px):** BottomNav visible, Sidebar hidden, screens behave as before
3. **Resize test:** Drag browser width across 768px boundary — layout switches cleanly
4. **Navigation:** All sidebar links route correctly, active states match current tab
5. **Lesson screen:** Recording, playback, and feedback display work in new flex layout
6. **AskTutor:** Chat streaming, message rendering, and input work at desktop width
7. **Deploy to Vercel:** Build succeeds, all routes work (SPA fallback), env vars load correctly
