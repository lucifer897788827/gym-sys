import { z } from "zod";

export const paymentMethodValues = ["cash", "UPI", "card", "other"] as const;
export const paymentStatusValues = ["pending", "paid", "verified"] as const;

export const paymentMethodSchema = z.enum(paymentMethodValues);
export const paymentStatusSchema = z.enum(paymentStatusValues);

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

export const paymentSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  memberId: z.string().uuid(),
  memberSubscriptionId: z.string().uuid().nullable().optional(),
  amountInr: z.number().positive(),
  paymentMethod: paymentMethodSchema,
  status: paymentStatusSchema,
  referenceNumber: z.string().nullable().optional(),
  paidAt: z.string().datetime().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const paymentFormSchema = paymentSchema
  .omit({ id: true, gymId: true })
  .extend({
    amountInr: z.coerce.number().positive(),
  });
