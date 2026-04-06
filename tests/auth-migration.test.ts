import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = resolve(
  process.cwd(),
  "supabase/migrations/202604010002_auth_roles_and_member_access.sql",
);

describe("auth roles and member access migration", () => {
  it("adds member auth linkage, tightens internal roles, and enables row level security", () => {
    const migration = readFileSync(migrationPath, "utf8");

    expect(migration).toMatch(
      /alter table public\.members\s+add column if not exists auth_user_id uuid unique references auth\.users\(id\) on delete set null;/,
    );
    expect(migration).toContain(
      "alter table public.users drop constraint if exists users_role_check;",
    );
    expect(migration).toMatch(
      /update public\.users\s+set role = 'staff'\s+where role in \('manager', 'coach'\);/,
    );
    expect(migration).toContain(
      "alter table public.users add constraint users_role_check check (role in ('owner', 'staff'));",
    );
    expect(migration).toContain(
      "create index if not exists members_auth_user_id_idx on public.members (auth_user_id);",
    );
    expect(migration).toContain(
      "alter table public.users enable row level security;",
    );
    expect(migration).toContain(
      "alter table public.members enable row level security;",
    );
    expect(migration).toContain(
      "alter table public.member_subscriptions enable row level security;",
    );
    expect(migration).toContain(
      "alter table public.payments enable row level security;",
    );
    expect(migration).toContain(
      "alter table public.attendance_logs enable row level security;",
    );
    expect(migration).toMatch(
      /create policy users_same_gym_read on public\.users[\s\S]*using \(public\.is_internal_user_for_gym\(users\.gym_id\)\);/,
    );
    expect(migration).toMatch(
      /create policy members_same_gym_or_self_read on public\.members[\s\S]*using \(public\.is_internal_user_for_gym\(members\.gym_id\) or members\.auth_user_id = auth\.uid\(\)\);/,
    );
  });
});
