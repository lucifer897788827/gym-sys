import { describe, expect, it } from "vitest";

import { deriveMemberState } from "./schema";

describe("deriveMemberState", () => {
  it.each([
    {
      label: "returns ACTIVE when the membership is comfortably valid",
      input: {
        expiryDate: "2026-05-01",
        today: "2026-04-01",
        lastVisitAt: "2026-03-31",
      },
      expected: "ACTIVE",
    },
    {
      label: "returns EXPIRING within 3 days",
      input: {
        expiryDate: "2026-04-03",
        today: "2026-04-01",
        lastVisitAt: "2026-03-31",
      },
      expected: "EXPIRING",
    },
    {
      label: "returns EXPIRED after the membership ends but before the lost window",
      input: {
        expiryDate: "2026-03-25",
        today: "2026-04-01",
        lastVisitAt: "2026-03-30",
      },
      expected: "EXPIRED",
    },
    {
      label: "returns LOST after a long inactive period",
      input: {
        expiryDate: "2026-03-01",
        today: "2026-04-01",
        lastVisitAt: "2026-02-15",
      },
      expected: "LOST",
    },
    {
      label: "returns LOST when lastVisitAt is an old timestamp",
      input: {
        expiryDate: "2026-03-01",
        today: "2026-04-01",
        lastVisitAt: "2026-02-15T10:30:00.000Z",
      },
      expected: "LOST",
    },
  ])("$label", ({ input, expected }) => {
    expect(deriveMemberState(input)).toBe(expected);
  });
});
