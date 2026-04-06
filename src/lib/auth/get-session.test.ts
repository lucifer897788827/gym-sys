import { describe, expect, it, afterEach, beforeEach, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  getPlaywrightE2ePersona,
  PLAYWRIGHT_E2E_AUTH_COOKIE,
  PLAYWRIGHT_E2E_AUTH_SECRET_COOKIE,
} from "./get-session";

function cookieStore(value?: string) {
  return {
    get(name: string) {
      if (name !== PLAYWRIGHT_E2E_AUTH_COOKIE || value === undefined) {
        return undefined;
      }

      return { value };
    },
  };
}

describe("getPlaywrightE2ePersona", () => {
  const original = process.env.PLAYWRIGHT_E2E_AUTH_SECRET;

  beforeEach(() => {
    process.env.PLAYWRIGHT_E2E_AUTH = "1";
    process.env.PLAYWRIGHT_E2E_AUTH_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env.PLAYWRIGHT_E2E_AUTH = undefined;
    process.env.PLAYWRIGHT_E2E_AUTH_SECRET = original;
    vi.unstubAllEnvs?.();
  });

  it("requires the matching secret for the internal persona", () => {
    expect(
      getPlaywrightE2ePersona({
        ...cookieStore("internal"),
        get(name: string) {
          if (name === PLAYWRIGHT_E2E_AUTH_SECRET_COOKIE) {
            return { value: "test-secret" };
          }

          return cookieStore("internal").get(name);
        },
      } as never),
    ).toBe("internal");
  });

  it("rejects a persona cookie without the secret cookie", () => {
    expect(getPlaywrightE2ePersona(cookieStore("member") as never)).toBeNull();
  });

  it("rejects an incorrect secret", () => {
    expect(
      getPlaywrightE2ePersona({
        get(name: string) {
          if (name === PLAYWRIGHT_E2E_AUTH_COOKIE) {
            return { value: "unprovisioned" };
          }

          if (name === PLAYWRIGHT_E2E_AUTH_SECRET_COOKIE) {
            return { value: "wrong" };
          }

          return undefined;
        },
      } as never),
    ).toBeNull();
  });
});
