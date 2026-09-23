# Fluently - Handover
> Handed over by Yash Dogra to Ayush Jain on 2026-09-23. Master index: house-of-tech-admin/ESTATE_HANDOVER.md

## For Ayush (plain language): what this is, whether it is live, the 3-5 things only you can do next

This is an early prototype of an AI English-tutoring app - just the phone-screen
frontend, no working product behind it yet. It is **not live anywhere**: no
deployment, no real backend connected, no real Firebase project, no domain
actually serving anything. It has 2 commits total, both from 2026-04-16, and
nothing has changed since.

Things only you (or whoever you assign this to) can do:
1. Decide whether this project continues at all. It is unfinished - the login
   flow works against mock data, everything else (home, lessons, chat) is
   entirely fake data - and its backend was intentionally left out of this
   handover (see "What it is" below).
2. Accept transfer of the GitHub repository `yxshdogra/fluently-app` (private,
   currently under Yash's personal GitHub account) into your own account or a
   House of Tech org, before Yash's GitHub access is revoked.
3. If you decide to continue it: ask Yash directly for the `fluenly-api`
   backend repository - it is not on this laptop and was excluded from this
   handover by Yash's decision (see below).
4. If you decide to shelve it: no cleanup is required - there is no live
   deployment, no bill, and no user data tied to this repo.

There is nothing to run or check today; this repo has never been deployed.

## What it is

- A frontend-only React 19 + TypeScript + Vite web app, mobile-first (rendered
  inside a fixed 414x896px phone frame), prototyping an AI English-tutor
  product called "Fluently."
- Belongs to Political Academy Private Limited / House of Tech.
- 2 commits, both dated 2026-04-16: an initial mobile-first build, then a
  "responsive web dashboard for investor demo" commit whose desktop-specific
  layout (`Sidebar`, `MobileLayout`) was mostly reverted in the very next
  commit back toward the mobile-first design. Never deployed.
- The auth flow (Splash -> Onboarding -> Login -> Verify OTP) is wired to a
  real-looking API contract; the rest of the screens (Home, Ask Tutor,
  Lesson, Profile, Settings, etc.) run entirely on mock data
  (`VITE_USE_MOCKS`, `src/lib/mock-data.ts`).
- The backend (`fluenly-api`, Express + Prisma, formerly
  `Political-Academy-Private-Limited/fluenly-api`) is **not part of this
  handover**, by Yash's decision. This repo's own `CLAUDE.md` points at a
  backend path (`/Users/Work/Work/Fluently/fluenly-api`) that only exists on
  a different machine and will not resolve for anyone else.

## Where it runs

| Component | Where | Identifier/URL |
|---|---|---|
| Source | GitHub (private) | github.com/ayush2491/fluently-app |
| Frontend | Not deployed anywhere | n/a |
| Backend (fluenly-api) | Out of scope of this handover | not included; ask Yash directly |
| Firebase project | Never provisioned | placeholder config only, no real project |

## Current state

- Live/shipped version: none. This app has never been built for production
  or deployed to any hosting target.
- `main` tracks `origin/main` cleanly; no other branches exist locally or on
  the remote, and there are no open pull requests.
- Built-but-not-shipped: the whole frontend is prototype-stage. The "investor
  demo" desktop dashboard layout from the second commit was largely undone in
  the third commit, so the intended direction (mobile-only vs. responsive
  desktop) was never settled.
- No branches need deleting - there is only `main`.

## Build and deploy

```
npm install
npm run dev       # local dev server (Vite)
npm run dev -- --host   # expose on LAN, e.g. to test from a phone
npm run build      # tsc -b && vite build
npm run lint
npm run preview
```

- No CI/CD and no deploy configuration of any kind exist in this repo (no
  `.github/`, no Firebase Hosting config, no Vercel/Netlify config). It has
  never been built for production.
- Trap: this repo's own [CLAUDE.md](./CLAUDE.md) "Cross-Repo Context" section
  references a backend path and Obsidian notes under `/Users/Work/Work/...` -
  that path does not exist on Yash's laptop or anywhere in this handover;
  do not chase it.

## Secrets and config

| Name | Where it lives | Notes |
|---|---|---|
| `VITE_FIREBASE_API_KEY`, `_AUTH_DOMAIN`, `_PROJECT_ID`, `_STORAGE_BUCKET`, `_MESSAGING_SENDER_ID`, `_APP_ID`, `_VAPID_KEY` | Nowhere - no `.env` file exists in the repo | `public/firebase-messaging-sw.js` still contains literal placeholder strings (e.g. `REPLACE_WITH_VITE_FIREBASE_API_KEY`); Cloud Messaging was never connected to a real Firebase project |
| `VITE_API_BASE_URL` | Code default only, in `src/lib/constants.ts` (`https://api.fluently.app/v1`) | Not a secret; whether that domain is actually registered/live is unverified |
| `VITE_USE_MOCKS` | Code default, no `.env` file | Set to `true` to run the app entirely on mock data |

There are no local secret files for fluently-app, so nothing for this repo
is included in the encrypted secrets archive mentioned in the master index.

## Open items

1. **Ayush** - Decide whether Fluently continues as a product. If not,
   explicitly mark it closed rather than leaving it dormant under a personal
   GitHub account.
2. **Ayush** - Transfer the GitHub repository `yxshdogra/fluently-app` to
   your own account or a House of Tech org before Yash's GitHub access is
   revoked. There are no CI secrets or webhooks to worry about - it is a
   plain repository transfer.
3. **Next engineer** - If continuing: get the `fluenly-api` backend from
   Yash directly (its current location is unknown to this handover), then
   fix `CLAUDE.md`'s cross-repo paths to point at wherever it actually lives.
4. **Next engineer** - If continuing: resolve the mobile-first vs. desktop
   "investor demo" layout direction that was left unsettled between the
   second and third commits.
5. **Next engineer** - If continuing: provision a real Firebase project
   under a House of Tech-owned account (not a personal one) before wiring up
   push notifications for real.

## Gotchas

- `CLAUDE.md`'s backend (`fluenly-api`) and Obsidian-notes paths are
  machine-local to a setup that no longer exists; treat every path in its
  "Cross-Repo Context" section as unreachable until someone supplies the
  real locations.
- No `.env` file exists anywhere in the repo, and the Firebase service
  worker still ships literal placeholder config strings - Cloud Messaging
  looks wired up in code but was never actually connected to anything live.
- `api.fluently.app` only appears as a hardcoded code default
  (`src/lib/constants.ts`); there is no evidence it is a registered,
  live domain (unverified).
- The only uncommitted local changes in this working tree
  (`.gitignore`/`.gitattributes`) are from a local code-graph tool, not
  product work, and are excluded from this handover.

## History

- [CLAUDE.md](./CLAUDE.md) - architecture and command reference for the
  frontend (accurate for the code; ignore its stale cross-repo paths).
- [README.md](./README.md) - generic Vite/React starter template README,
  no project-specific content.
