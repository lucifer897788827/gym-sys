import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get() {
      return undefined;
    },
  })),
}));
vi.mock("./get-session", () => ({
  getUser: vi.fn(),
  getPlaywrightE2ePersona: vi.fn(() => null),
  PLAYWRIGHT_E2E_AUTH_COOKIE: "playwright_e2e_auth",
  PLAYWRIGHT_E2E_AUTH_SECRET_COOKIE: "playwright_e2e_auth_secret",
}));
vi.mock("../supabase/server", () => ({
  createSupabaseServerClient: vi.fn(),
}));

import { getActor, resolveActor } from "./get-actor";

describe("resolveActor", () => {
  it("returns anonymous without an auth user", () => {
    expect(resolveActor({ authUserId: null })).toEqual({ kind: "anonymous" });
  });

  it("returns unprovisioned with the auth user id", () => {
    expect(resolveActor({ authUserId: "auth-1" })).toEqual({
      kind: "unprovisioned",
      authUserId: "auth-1",
    });
  });

  it("returns an internal owner actor", () => {
    expect(
      resolveActor({
        authUserId: "auth-2",
        userRow: {
          id: "user-1",
          gymId: "gym-1",
          role: "owner",
        },
      }),
    ).toEqual({
      kind: "internal",
      userId: "user-1",
      gymId: "gym-1",
      role: "owner",
    });
  });

  it("returns a member actor", () => {
    expect(
      resolveActor({
        authUserId: "auth-3",
        memberRow: {
          id: "member-1",
          gymId: "gym-2",
        },
      }),
    ).toEqual({
      kind: "member",
      authUserId: "auth-3",
      memberId: "member-1",
      gymId: "gym-2",
    });
  });
});

describe("getActor", () => {
  it("maps an internal auth user to an internal actor using users.id", async () => {
    const { getUser } = await import("./get-session");
    const { createSupabaseServerClient } = await import("../supabase/server");

    vi.mocked(getUser).mockResolvedValueOnce({ id: "auth-internal" } as never);
    vi.mocked(createSupabaseServerClient).mockResolvedValueOnce({
      from(table: string) {
        if (table === "users") {
          return {
            select() {
              return {
                eq(column: string, value: string) {
                  expect(column).toBe("id");
                  expect(value).toBe("auth-internal");
                  return {
                    maybeSingle: vi.fn().mockResolvedValue({
                      data: { id: "user-7", gymId: "gym-7", role: "staff" },
                      error: null,
                    }),
                  };
                },
              };
            },
          };
        }

        if (table === "members") {
          return {
            select() {
              return {
                eq() {
                  return {
                    maybeSingle: vi.fn().mockResolvedValue({
                      data: null,
                      error: null,
                    }),
                  };
                },
              };
            },
          };
        }

        throw new Error(`Unexpected table: ${table}`);
      },
    } as never);

    await expect(getActor()).resolves.toEqual({
      kind: "internal",
      userId: "user-7",
      gymId: "gym-7",
      role: "staff",
    });
  });

  it("maps a member auth user to a member actor using auth_user_id", async () => {
    const { getUser } = await import("./get-session");
    const { createSupabaseServerClient } = await import("../supabase/server");

    vi.mocked(getUser).mockResolvedValueOnce({ id: "auth-member" } as never);
    vi.mocked(createSupabaseServerClient).mockResolvedValueOnce({
      from(table: string) {
        if (table === "users") {
          return {
            select() {
              return {
                eq() {
                  return {
                    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                  };
                },
              };
            },
          };
        }

        if (table === "members") {
          return {
            select() {
              return {
                eq(column: string, value: string) {
                  expect(column).toBe("auth_user_id");
                  expect(value).toBe("auth-member");
                  return {
                    maybeSingle: vi.fn().mockResolvedValue({
                      data: { id: "member-9", gymId: "gym-9" },
                      error: null,
                    }),
                  };
                },
              };
            },
          };
        }

        throw new Error(`Unexpected table: ${table}`);
      },
    } as never);

    await expect(getActor()).resolves.toEqual({
      kind: "member",
      authUserId: "auth-member",
      memberId: "member-9",
      gymId: "gym-9",
    });
  });

  it("prefers the internal actor when both internal and member rows exist", async () => {
    const { getUser } = await import("./get-session");
    const { createSupabaseServerClient } = await import("../supabase/server");

    vi.mocked(getUser).mockResolvedValueOnce({ id: "auth-both" } as never);
    vi.mocked(createSupabaseServerClient).mockResolvedValueOnce({
      from(table: string) {
        if (table === "users") {
          return {
            select() {
              return {
                eq() {
                  return {
                    maybeSingle: vi.fn().mockResolvedValue({
                      data: { id: "user-8", gymId: "gym-8", role: "owner" },
                      error: null,
                    }),
                  };
                },
              };
            },
          };
        }

        if (table === "members") {
          return {
            select() {
              return {
                eq() {
                  return {
                    maybeSingle: vi.fn().mockResolvedValue({
                      data: { id: "member-8", gymId: "gym-8" },
                      error: null,
                    }),
                  };
                },
              };
            },
          };
        }

        throw new Error(`Unexpected table: ${table}`);
      },
    } as never);

    await expect(getActor()).resolves.toEqual({
      kind: "internal",
      userId: "user-8",
      gymId: "gym-8",
      role: "owner",
    });
  });

  it("maps a user with no profile to unprovisioned", async () => {
    const { getUser } = await import("./get-session");
    const { createSupabaseServerClient } = await import("../supabase/server");

    vi.mocked(getUser).mockResolvedValueOnce({ id: "auth-new" } as never);
    vi.mocked(createSupabaseServerClient).mockResolvedValueOnce({
      from(table: string) {
        if (table === "users") {
          return {
            select() {
              return {
                eq() {
                  return {
                    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                  };
                },
              };
            },
          };
        }

        if (table === "members") {
          return {
            select() {
              return {
                eq() {
                  return {
                    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                  };
                },
              };
            },
          };
        }

        throw new Error(`Unexpected table: ${table}`);
      },
    } as never);

    await expect(getActor()).resolves.toEqual({
      kind: "unprovisioned",
      authUserId: "auth-new",
    });
  });

  it("surfaces lookup errors with context", async () => {
    const { getUser } = await import("./get-session");
    const { createSupabaseServerClient } = await import("../supabase/server");

    vi.mocked(getUser).mockResolvedValueOnce({ id: "auth-error" } as never);
    vi.mocked(createSupabaseServerClient).mockResolvedValueOnce({
      from(table: string) {
        return {
          select() {
            return {
              eq() {
                return {
                  maybeSingle: vi.fn().mockResolvedValue({
                    data: null,
                    error: table === "users" ? { message: "boom" } : null,
                  }),
                };
              },
            };
          },
        };
      },
    } as never);

    await expect(getActor()).rejects.toThrow(/users lookup failed/i);
  });
});
