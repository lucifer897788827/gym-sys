import { describe, expect, it } from "vitest";

import { calculateAttendanceStreak } from "./queries";

describe("calculateAttendanceStreak", () => {
  it("returns zero streaks for empty input", () => {
    expect(calculateAttendanceStreak([])).toEqual({ currentStreak: 0, bestStreak: 0 });
  });

  it("deduplicates repeated dates", () => {
    expect(
      calculateAttendanceStreak([
        "2026-04-01",
        "2026-04-01",
        "2026-04-02",
      ]),
    ).toEqual({ currentStreak: 2, bestStreak: 2 });
  });

  it("resets the current streak after gaps", () => {
    expect(
      calculateAttendanceStreak([
        "2026-03-28",
        "2026-03-29",
        "2026-04-01",
      ]),
    ).toEqual({ currentStreak: 1, bestStreak: 2 });
  });

  it("handles unsorted input by using the most recent visit sequence", () => {
    expect(
      calculateAttendanceStreak([
        "2026-04-01",
        "2026-03-30",
        "2026-03-31",
      ]),
    ).toEqual({ currentStreak: 3, bestStreak: 3 });
  });

  it("normalizes timestamp strings to the day", () => {
    expect(
      calculateAttendanceStreak([
        "2026-03-30T18:30:00.000Z",
        "2026-03-31T02:15:00.000Z",
        "2026-04-01T11:45:00.000Z",
      ]),
    ).toEqual({ currentStreak: 3, bestStreak: 3 });
  });
});
