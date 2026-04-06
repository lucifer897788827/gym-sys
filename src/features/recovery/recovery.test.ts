import { describe, expect, it } from "vitest";

import { buildRecoveryBuckets } from "./queries";

describe("buildRecoveryBuckets", () => {
  it("sorts work into the five recovery buckets with pending payments taking precedence", () => {
    const result = buildRecoveryBuckets({
      today: "2026-04-01T09:00:00.000Z",
      leads: [
        {
          id: "lead-1",
          name: "Asha",
          lastContactedAt: "2026-03-30T08:00:00.000Z",
        },
        {
          id: "lead-2",
          name: "Vikram",
          lastContactedAt: "2026-03-31T12:30:00.000Z",
        },
      ],
      members: [
        { id: "member-1", name: "Ravi", lastVisitAt: "2026-03-29T09:00:00.000Z" },
        { id: "member-2", name: "Neha", lastVisitAt: "2026-03-28T09:00:00.000Z" },
        { id: "member-3", name: "Kiran", lastVisitAt: "2026-03-20T09:00:00.000Z" },
        { id: "member-4", name: "Zoya", lastVisitAt: "2026-03-31T09:00:00.000Z" },
      ],
      subscriptions: [
        {
          memberId: "member-1",
          expiryDate: "2026-04-03T09:00:00.000Z",
          dueAmountInr: 0,
        },
        {
          memberId: "member-2",
          expiryDate: "2026-03-29T09:00:00.000Z",
          dueAmountInr: 500,
        },
        {
          memberId: "member-4",
          expiryDate: "2026-03-31T09:00:00.000Z",
          dueAmountInr: 1200,
        },
      ],
      payments: [
        {
          memberId: "member-4",
          status: "pending",
        },
      ],
    });

    expect(result.coldLeads).toEqual([{ id: "lead-1", name: "Asha" }]);
    expect(result.expiringMembers).toEqual([{ id: "member-1", name: "Ravi" }]);
    expect(result.expiredUnpaid).toEqual([{ id: "member-2", name: "Neha" }]);
    expect(result.inactiveMembers).toEqual([{ id: "member-3", name: "Kiran" }]);
    expect(result.pendingPayments).toEqual([{ id: "member-4", name: "Zoya" }]);
  });

  it("keeps a lead warm until it is older than 24 hours", () => {
    const result = buildRecoveryBuckets({
      today: "2026-04-01T09:00:00.000Z",
      leads: [
        {
          id: "lead-3",
          name: "Meera",
          lastContactedAt: "2026-03-31T09:30:00.000Z",
        },
      ],
      members: [],
      subscriptions: [],
      payments: [],
    });

    expect(result.coldLeads).toHaveLength(0);
  });
});
