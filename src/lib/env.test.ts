import { describe, expect, it } from "vitest";

import { envSchema } from "./env";

describe("envSchema", () => {
  it("requires the public Supabase runtime values", () => {
    expect(
      envSchema.safeParse({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
      }).success,
    ).toBe(true);
  });
});
