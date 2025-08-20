# Twinder Frontend — Agent Guide

## How to run

- Requirements: Node 18+, npm
- Install & start:
  npm i
  npm run dev
- Dev server: http://localhost:5173

## Env vars (local .env file, never commit)

VITE_API_BASE=http://localhost:3000/api

## API client requirement

- All API calls must use baseURL from VITE_API_BASE
- Attach token from localStorage as Authorization: Bearer <token>
- Redirect to /login if 401 is returned

## What I need added (each in a separate PR)

1. Preferences Page (user filters)
   - New route/page: Preferences
   - Fields: gender (any | male | female), ageMin, ageMax, distanceKm
   - On mount: load current prefs
   - Save via PUT /api/users/me/preferences
   - After save: refresh candidates on swipe page

2. Admin Dashboard (owner features)
   - New route: /admin
   - Show link only if current user has role:admin (API guard is main protection)
   - UI: search box → GET /api/admin/users?q=...
   - Table: email, name, verified, banned, role
   - Actions: verify, ban/unban, delete (with confirm)
   - Show toast or alert on success/error

3. API/CORS sanity
   - Ensure all API calls respect VITE_API_BASE
   - On app start, if token exists, fetch /api/users/me
   - Handle failure gracefully (no infinite spinner)
