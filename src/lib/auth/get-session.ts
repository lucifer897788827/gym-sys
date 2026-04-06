import "server-only";

import type { User } from "@supabase/supabase-js";
import { cache } from "react";
import { cookies } from "next/headers";

import { createSupabaseServerClient } from "../supabase/server";

export type PlaywrightE2ePersona = "internal" | "member" | "unprovisioned";

export const PLAYWRIGHT_E2E_AUTH_COOKIE = "playwright_e2e_auth";
export const PLAYWRIGHT_E2E_AUTH_SECRET_COOKIE = "playwright_e2e_auth_secret";

export function getPlaywrightE2ePersona(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): PlaywrightE2ePersona | null {
  if (process.env.PLAYWRIGHT_E2E_AUTH !== "1") {
    return null;
  }

  const expectedSecret = process.env.PLAYWRIGHT_E2E_AUTH_SECRET;
  const secretValue = cookieStore.get(PLAYWRIGHT_E2E_AUTH_SECRET_COOKIE)?.value;

  if (!expectedSecret || secretValue !== expectedSecret) {
    return null;
  }

  const value = cookieStore.get(PLAYWRIGHT_E2E_AUTH_COOKIE)?.value;

  if (value === "1" || value === "internal") {
    return "internal";
  }

  if (value === "member" || value === "unprovisioned") {
    return value;
  }

  return null;
}

export const getUser = cache(async () => {
  const cookieStore = await cookies();

  const persona = getPlaywrightE2ePersona(cookieStore);

  if (persona) {
    return { id: `codex-e2e-${persona}` } as User;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
});
