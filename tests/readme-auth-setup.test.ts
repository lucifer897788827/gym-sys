import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const readmePath = resolve(process.cwd(), "README.md");

describe("README auth setup", () => {
  it("documents the required env vars and Supabase auth setup", () => {
    const readme = readFileSync(readmePath, "utf8");

    expect(readme).toContain("NEXT_PUBLIC_SUPABASE_URL");
    expect(readme).toContain("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    expect(readme).toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(readme).toContain("email/password");
    expect(readme).toContain("PLAYWRIGHT_E2E_AUTH");
    expect(readme).toContain("PLAYWRIGHT_E2E_AUTH_SECRET");
    expect(readme).toContain("Supabase dashboard");
  });
});
