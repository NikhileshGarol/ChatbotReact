# ChatBot React Admin (React + TypeScript + Vite)

A React 19 + TypeScript + Vite application that provides authentication, role‑based access, document/website ingestion for training, query interface, and tenant/company and user management. Uses Axios for API calls, MUI for UI, React Hook Form + Yup for forms/validation, and Tailwind (via @tailwindcss/vite) for utility styles.

## Features
- Authentication with access/refresh tokens and auto refresh
- Role-based routing guard (`superadmin`, `admin`, `user`)
- Admin dashboard with companies and users management
- Document and website uploads for training
- Query trained data
- Profile management (including avatar upload/display)
- Global snackbar, loading overlays, and session-expired handling

## Tech Stack
- React 19, TypeScript, Vite 7
- MUI 7, @mui/x-data-grid
- React Router 7
- React Hook Form + Yup
- Axios
- Tailwind CSS 4 (via `@tailwindcss/vite`)

## Prerequisites
- Node.js 18+ (recommended 20+)
- npm 9+ (npm comes with Node)
- Backend API reachable via a base URL

## Environment Variables
Create a `.env` file in the project root with:

```
VITE_API_BASE_URL=http://localhost:8000
```

Used in:
- `src/services/api.ts` and `src/services/apiPublic.ts` as Axios `baseURL`

## Getting Started
1. Install dependencies:
   - `npm install`
2. Configure environment:
   - Create `.env` and set `VITE_API_BASE_URL`
3. Start development server:
   - `npm run dev`
   - App runs on the URL printed by Vite (e.g., http://localhost:5173)

## Available Scripts
- `npm run dev` — start Vite dev server with HMR
- `npm run build` — type-check and build to `dist/`
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

## Authentication & Session
- Login endpoint: `POST /auth/login` with `username` and `password` (form-encoded)
- Tokens are stored in `localStorage` under `AUTH_STORAGE_V1`
- Auto refresh: `POST /auth/refresh-token?refresh_token=...`
- On 401 after refresh failure, a `session-expired` event is dispatched and UI prompts accordingly

## Roles and Routes
- Public:
  - `/auth/login`, `/auth/forgot`
- Protected (requires valid token):
  - `/admin` — dashboard (allowed: `admin`, `superadmin`)
  - `/admin/companies` — company CRUD (allowed: `admin`, `superadmin`)
  - `/admin/users` — user CRUD (allowed: `admin`, `superadmin`)
  - `/training` — training manager (allowed: `admin`, `user`)
  - `/upload` — document uploads (allowed: `superadmin`, `admin`, `user`)
  - `/profile` — current user profile (allowed: `superadmin`, `admin`, `user`)
  - `/unauthorized` — shown when role access denied

Guards:
- `ProtectedRoute` checks auth state
- `RoleGuard` enforces allowed roles

## Key API Expectations
Axios client (`src/services/api.ts`) calls endpoints relative to `VITE_API_BASE_URL`:
- Auth: `/auth/login`, `/auth/refresh-token`, `/auth/request-password-reset`, `/auth/reset-password`
- Users: `/users`, `/users/me`, `/users/me/image`
- Companies (superadmin): `/superadmin/companies` and related admin endpoints
- Training: `/documents`, `/documents/upload`, `/websites`, `/websites/scrape`, `/query`, downloads, and retries
- Widget: `/widget/{tenantCode}/key`, `/widget/{tenantCode}/regenerate`

Ensure your backend exposes these routes and returns required payloads.

## Project Structure (selected)
- `src/pages/auth/*` — login, forgot password
- `src/pages/admin/*` — admin dashboard, companies, users
- `src/pages/training/*` — training manager and uploads
- `src/pages/myProfile/Profile.tsx` — profile page
- `src/components/*` — UI components (dialogs, table, forms, guards)
- `src/contexts/*` — auth, snackbar, session contexts
- `src/services/*` — Axios clients and API wrappers
- `src/validation/*` — Yup schemas
- `src/theme/*` — MUI theme

## Build & Deploy
1. Build:
   - `npm run build` (outputs to `dist/`)
2. Serve:
   - Any static file server or `npm run preview` for local preview
3. Environment:
   - Set `VITE_API_BASE_URL` in build-time environment of your hosting platform

## Troubleshooting
- 401 loops / forced logout:
  - Verify `VITE_API_BASE_URL`
  - Ensure refresh token endpoint works and CORS is configured
- Broken uploads:
  - Backend must accept `multipart/form-data` for documents
- Avatar not showing:
  - Backend should return image blob for `/users/me/image`

## License
Proprietary — internal use unless stated otherwise.
