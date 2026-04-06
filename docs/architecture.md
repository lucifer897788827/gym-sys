# Architecture

## Stack

- Next.js App Router for the product shell
- Supabase Auth and PostgreSQL for tenancy and data integrity
- TypeScript and Zod for shared domain validation
- Vitest and Playwright for unit and end-to-end checks

## Product modules

- `src/app` contains route groups for login and the authenticated workspace.
- `src/features` holds the domain logic for leads, members, payments,
  attendance, recovery, imports, and WhatsApp messaging.
- `src/components` contains presentational building blocks such as streak and
  KPI cards.
- `supabase` stores the schema migration and seed data used to bootstrap gyms.

## Operating model

The product is designed around a recovery-first workflow:

- imports surface value quickly from spreadsheets
- dashboard cards expose money and retention risks
- recovery buckets derive action lists from leads, subscriptions, payments, and attendance
- WhatsApp templates provide the final action layer without requiring API automation in V1
