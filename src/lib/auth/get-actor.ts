import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

import { createSupabaseServerClient } from "../supabase/server";
import { getPlaywrightE2ePersona, getUser } from "./get-session";
import type { PlaywrightE2ePersona } from "./get-session";
import type { Actor, AuthUserRow, MemberRow, ResolveActorInput } from "./types";
import { isInternalActorRole } from "./types";

export function resolveActor({
  authUserId,
  userRow,
  memberRow,
}: ResolveActorInput): Actor {
  if (!authUserId) {
    return { kind: "anonymous" };
  }

  if (userRow && isInternalActorRole(userRow.role)) {
    return {
      kind: "internal",
      userId: userRow.id,
      gymId: userRow.gymId,
      role: userRow.role,
    };
  }

  if (memberRow) {
    return {
      kind: "member",
      authUserId,
      memberId: memberRow.id,
      gymId: memberRow.gymId,
    };
  }

  return {
    kind: "unprovisioned",
    authUserId,
  };
}

function resolvePlaywrightE2eActor(persona: PlaywrightE2ePersona): Actor {
  switch (persona) {
    case "internal":
      return {
        kind: "internal" as const,
        userId: "codex-e2e-user",
        gymId: "codex-e2e-gym",
        role: "owner" as const,
      };
    case "member":
      return {
        kind: "member" as const,
        authUserId: "codex-e2e-member",
        memberId: "codex-e2e-member-row",
        gymId: "codex-e2e-gym",
      };
    case "unprovisioned":
      return {
        kind: "unprovisioned" as const,
        authUserId: "codex-e2e-unprovisioned",
      };
  }
}

async function lookupUserRow(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  authUserId: string,
) {
  const result = await supabase
    .from("users")
    .select("id, gymId:gym_id, role")
    .eq("id", authUserId)
    .maybeSingle<AuthUserRow>();

  if (result.error) {
    throw new Error(
      `users lookup failed for authUserId=${authUserId}: ${result.error.message}`,
    );
  }

  return result;
}

async function lookupMemberRow(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  authUserId: string,
) {
  const result = await supabase
    .from("members")
    .select("id, gymId:gym_id")
    .eq("auth_user_id", authUserId)
    .maybeSingle<MemberRow>();

  if (result.error) {
    throw new Error(
      `members lookup failed for authUserId=${authUserId}: ${result.error.message}`,
    );
  }

  return result;
}

export const getActor = cache(async () => {
  const cookieStore = await cookies();
  const persona = getPlaywrightE2ePersona(cookieStore);

  if (persona) {
    return resolvePlaywrightE2eActor(persona);
  }

  const authUser = await getUser();

  if (!authUser) {
    return resolveActor({ authUserId: null });
  }

  const supabase = await createSupabaseServerClient();
  const [userResult, memberResult] = await Promise.all([
    lookupUserRow(supabase, authUser.id),
    lookupMemberRow(supabase, authUser.id),
  ]);

  return resolveActor({
    authUserId: authUser.id,
    userRow: userResult.data,
    memberRow: memberResult.data,
  });
});
