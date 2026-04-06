import type { User } from "@supabase/supabase-js";

export type AuthUserId = User["id"];

export type InternalActorRole = "owner" | "staff";

export type AnonymousActor = {
  kind: "anonymous";
};

export type UnprovisionedActor = {
  kind: "unprovisioned";
  authUserId: AuthUserId;
};

export type InternalActor = {
  kind: "internal";
  userId: string;
  gymId: string;
  role: InternalActorRole;
};

export type MemberActor = {
  kind: "member";
  authUserId: AuthUserId;
  memberId: string;
  gymId: string;
};

export type Actor = AnonymousActor | UnprovisionedActor | InternalActor | MemberActor;

export type AuthUserRow = {
  id: string;
  gymId: string;
  role: string;
};

export type MemberRow = {
  id: string;
  gymId: string;
};

export type ResolveActorInput = {
  authUserId: AuthUserId | null;
  userRow?: AuthUserRow | null;
  memberRow?: MemberRow | null;
};

export function isInternalActorRole(role: string): role is InternalActorRole {
  return role === "owner" || role === "staff";
}
