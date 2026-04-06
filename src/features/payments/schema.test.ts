import { describe, expect, it } from "vitest";

import {
  paymentMethodSchema,
  paymentSchema,
  paymentStatusSchema,
} from "./schema";

describe("payment schema enums", () => {
  it("accepts only the plan-intent payment methods", () => {
    expect(paymentMethodSchema.safeParse("cash").success).toBe(true);
    expect(paymentMethodSchema.safeParse("UPI").success).toBe(true);
    expect(paymentMethodSchema.safeParse("card").success).toBe(true);
    expect(paymentMethodSchema.safeParse("other").success).toBe(true);
    expect(paymentMethodSchema.safeParse("upi").success).toBe(false);
  });

  it("accepts only the plan-intent payment statuses", () => {
    expect(paymentStatusSchema.safeParse("pending").success).toBe(true);
    expect(paymentStatusSchema.safeParse("paid").success).toBe(true);
    expect(paymentStatusSchema.safeParse("verified").success).toBe(true);
    expect(paymentStatusSchema.safeParse("failed").success).toBe(false);
    expect(paymentStatusSchema.safeParse("refunded").success).toBe(false);
  });

  it("rejects zero-amount payments in the payment schema", () => {
    expect(
      paymentSchema.safeParse({
        id: "11111111-1111-4111-8111-111111111111",
        gymId: "22222222-2222-4222-8222-222222222222",
        memberId: "33333333-3333-4333-8333-333333333333",
        amountInr: 0,
        paymentMethod: "cash",
        status: "pending",
      }).success,
    ).toBe(false);
  });
});
