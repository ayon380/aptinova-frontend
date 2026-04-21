# Aptinova Frontend

Aptinova Frontend is a **Next.js 15** application for an AI-powered hiring platform. It supports candidate and recruiter workflows including onboarding, authentication, hiring tests, applicant tracking, analytics, and profile management.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** JavaScript + TypeScript
- **UI:** React 19, Tailwind CSS, custom components
- **State/Data:** Zustand, Axios, Fetch API
- **Auth/Identity:** NextAuth + passkey/WebAuthn flows
- **Charts/Visualization:** Recharts
- **Rich UI tooling:** Framer Motion, Heroicons, Lucide, Monaco editor, TipTap

## Features

- Multi-role experience:
  - Candidate flows
  - HR flows
  - HR Manager flows
- Authentication and account flows:
  - Login/signup/verification
  - Forgot/reset password
  - OAuth callback handling
  - Passkey registration/authentication
- Hiring workflows:
  - Job listing and job detail pages
  - Candidate applications
  - Hiring tests and completion views
  - Interview scheduling and feedback
- Organization modules:
  - Dashboards and analytics
  - Team management
  - Settings and profile pages
- Marketing/informational pages:
  - Landing page
  - About, privacy, terms, help centre, downloads

## Project Structure

```text
aptinova-frontend/
├── app/                    # Next.js App Router routes, layouts, contexts, services
│   ├── auth/               # Auth screens and onboarding flows
│   ├── candidate/          # Candidate dashboards, jobs, applications, profile
│   ├── orgs/               # HR + HRM dashboards, jobs, analytics, team, profile
│   ├── tests/              # Hiring test pages
│   ├── components/         # Route-scoped reusable components
│   ├── contexts/           # App contexts (e.g., auth)
│   ├── hooks/              # App-level hooks
│   └── services/           # Client services
├── components/             # Shared cross-app components
├── hooks/                  # Shared hooks
├── lib/                    # Shared TS libraries/utilities
├── services/               # Shared service modules
├── public/                 # Static assets and service worker files
├── next.config.ts          # Next.js configuration
└── package.json            # Scripts and dependencies
```

## Prerequisites

- **Node.js** 18+ (recommended: latest LTS)
- **npm** 9+

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env.local
   ```

   If `.env.example` is not available, create `.env.local` manually using the variables below.

3. Start development server:

   ```bash
   npm run dev
   ```

4. Open the app:

   - http://localhost:4000

## Environment Variables

Create `.env.local` in the repository root.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL for backend API requests used across auth, jobs, tests, profiles, and org flows. |
| `NEXT_PUBLIC_APP_NAME` | Recommended | App/brand label shown in UI areas like header/footer. |
| `NEXT_PUBLIC_BackendURL` | Used in some legacy pages | Alternate backend URL used by parts of job listing flows. |
| `NEXT_PUBLIC_AppURL` | Used in some legacy pages | Public frontend base URL used for generated links. |
| `NEXT_PUBLIC_GOOGLE_API_KEY` | Optional | Google API key used by calendar integration code. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID for calendar integration flows. |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Optional | Public Razorpay key used by subscription/payment steps. |

## Available Scripts

- `npm run dev` — Run local development server on port **4000**.
- `npm run lint` — Run Next.js ESLint checks.
- `npm run build` — Build production bundle.
- `npm run start` — Start production server.

## Development Notes

- The app uses the App Router with route-driven organization (`app/**/page.jsx`).
- `allowJs` is enabled in `tsconfig.json`, so JS and TS files coexist.
- `next.config.ts` allows remote images from `res.cloudinary.com`.
- Root layout uses both local fonts and `next/font/google` (Geist).

## Validation

Current baseline checks in this environment:

- `npm run lint` ✅ passes (with existing warnings in landing section components)
- `npm run build` ⚠️ fails in restricted/offline environments when Google Fonts cannot be reached (`fonts.googleapis.com`)

## Deployment

Build and run production locally:

```bash
npm run build
npm run start
```

Deploy on any Next.js-compatible platform (Vercel recommended).

## Contributing

1. Create a feature branch.
2. Keep changes scoped and minimal.
3. Run lint/build checks before opening a PR.
4. Open a PR with a clear summary and testing notes.
