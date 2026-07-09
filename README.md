# Mundial

Mundial is a web-based World Cup tournament simulator built with React, Vite, and Tailwind CSS. Pick your nation, draw your groups, and simulate (or manually set) every match all the way to a champion — for a custom 2026-format bracket or a replay of a real historic World Cup.

## Features

- **Onboarding** — name, email, and favorite-nation selection, with cross-user signup logging.
- **Tournament Simulator** — pick 32/48 teams (or auto-fill), run the group draw, play through groups and knockouts, edit/override any result, and follow the bracket to a champion.
- **2026 World Cup mode** — the official 48-team / 12-group format, including best-third-place qualifier logic and the round-of-32 bracket mapping.
- **Historic Cups** — replay past World Cups with their real participating nations.
- **Prediction & rating engine** — a seeded match engine (`src/lib/matchEngine.js`, `src/lib/tournamentEngine.js`) drives realistic simulated results from team ratings.
- **Dark mode** — full light/dark theming (`src/lib/theme.js`), toggle persisted in `localStorage`.
- **Internationalization** — English, Spanish, Portuguese, and French, via a lightweight custom i18n context (`src/lib/i18n.jsx`).
- **Admin dashboard** — password-gated view (`/admin`) of aggregate signups and simulation results, backed by Upstash Redis.
- **Legal pages** — Privacy Policy, Terms of Service, and Cookie Policy included under `legal/` and served at `/privacy`, `/terms`, `/cookies`.

## Tech stack

- [React 18](https://react.dev/) + [React Router 6](https://reactrouter.com/)
- [Vite 5](https://vitejs.dev/) for dev/build tooling
- [Tailwind CSS](https://tailwindcss.com/) for styling (class-based dark mode)
- [Vercel serverless functions](https://vercel.com/docs/functions) (`api/`) for signup logging, simulation logging, and admin data retrieval
- [Upstash Redis](https://upstash.com/) as the shared data store behind those functions

## Getting started

### Prerequisites

- Node.js 18+
- An [Upstash Redis](https://upstash.com/) database (only needed if you want signup/simulation logging and the admin dashboard to work)

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

This starts the Vite dev server. Note that the `/api/*` serverless functions (signup logging, simulation logging, admin data) are Vercel functions and won't run under plain `vite dev` — use the [Vercel CLI](https://vercel.com/docs/cli) (`vercel dev`) if you need to exercise those locally.

### Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

## Environment variables

Set these in your Vercel project (or `.env` for `vercel dev`) for the API routes to work:

| Variable | Used by | Purpose |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (read automatically by `Redis.fromEnv()`) | `api/signup.js`, `api/simulation.js`, `api/admin-data.js` | Upstash Redis connection |
| `ADMIN_PASSWORD` | `api/admin-data.js` | Server-side password required to read the admin dashboard data |

## Project structure

```
api/                  Vercel serverless functions (signup, simulation logging, admin data)
legal/                Markdown source for the legal pages
src/
  components/         Shared UI components (bracket views, cards, nav, theme/language controls, ...)
  data/                Nation lists, ratings, historic World Cup data, 2026 format data
  lib/                 Match/tournament engines, i18n, storage helpers, theme helpers
  pages/               Route-level pages (Onboarding, Dashboard, Simulator, Historic, Admin, legal)
```

## Deployment

The app is set up to deploy on [Vercel](https://vercel.com/), using `vercel.json` to rewrite all routes to `index.html` (client-side routing) and picking up the `api/` directory as serverless functions automatically. Pushing to the connected GitHub repo's main branch triggers an auto-deploy if the Vercel project is linked via its GitHub integration.
