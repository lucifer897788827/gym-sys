import { z } from "zod";

export const memberStateValues = ["ACTIVE", "EXPIRING", "EXPIRED", "LOST"] as const;
export const memberStateSchema = z.enum(memberStateValues);

export type MemberState = z.infer<typeof memberStateSchema>;

const dayInMs = 24 * 60 * 60 * 1000;
const expiringWindowDays = 3;
const lostWindowDays = 30;

function toUtcTimestamp(value: string) {
  return new Date(value).getTime();
}

function differenceInDays(later: string, earlier: string) {
  return Math.floor((toUtcTimestamp(later) - toUtcTimestamp(earlier)) / dayInMs);
}

export function deriveMemberState(input: {
  expiryDate: string;
  today: string;
  lastVisitAt: string | null;
}): MemberState {
  const daysUntilExpiry = differenceInDays(input.expiryDate, input.today);

  if (daysUntilExpiry > expiringWindowDays) {
    return "ACTIVE";
  }

  if (daysUntilExpiry >= 0) {
    return "EXPIRING";
  }

  const daysSinceExpiry = differenceInDays(input.today, input.expiryDate);
  const daysSinceLastVisit = input.lastVisitAt
    ? differenceInDays(input.today, input.lastVisitAt)
    : Number.POSITIVE_INFINITY;

  if (daysSinceExpiry > lostWindowDays || daysSinceLastVisit > lostWindowDays) {
    return "LOST";
  }

  return "EXPIRED";
}

export const memberRecordSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  leadId: z.string().uuid().nullable().optional(),
  fullName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().nullable().optional(),
  state: memberStateSchema,
  lastVisitAt: z.string().datetime().nullable().optional(),
  joinedAt: z.string(),
});
