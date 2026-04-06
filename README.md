# Gym Growth OS Web

## Local Setup

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for the project you want to point the app at.
3. Keep `SUPABASE_SERVICE_ROLE_KEY` available for server-side admin work, even if the current app slice does not use it yet.

## Supabase Auth

This worktree expects Supabase email/password auth to be enabled.

In the Supabase dashboard:

1. Open `Authentication` > `Providers`.
2. Enable `Email`.
3. Use email/password sign-in for the seeded accounts below.
4. Confirm the user records are allowed to sign in without extra OAuth providers.

Seeded accounts for manual verification:

- `owner@strong-box.test` / `Password123!`
- `staff@strong-box.test` / `Password123!`
- `member@strong-box.test` / `Password123!`

The seed data links the internal users through `public.users.id` and the member through `public.members.auth_user_id`, so the auth boundary can be checked without hand-editing rows.

## E2E Auth Mode

Playwright uses `PLAYWRIGHT_E2E_AUTH=1` and `PLAYWRIGHT_E2E_AUTH_SECRET` to unlock the cookie-based bypass route at `/api/e2e-auth`.

Use it like this:

- `/api/e2e-auth?persona=internal&secret=...&next=/dashboard` to land on internal pages in tests.
- `/api/e2e-auth?persona=member&secret=...&next=/member` to exercise member-facing routes under the bypass session.
- `/api/e2e-auth?persona=unprovisioned&secret=...&next=/dashboard` to verify the provisioning redirect.

When `PLAYWRIGHT_E2E_AUTH` is not set, the bypass route returns 404 and the authenticated shell redirects anonymous users to `/login`.
