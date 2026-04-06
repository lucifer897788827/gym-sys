import type {
  RecoveryBuckets,
  RecoveryMember,
  RecoveryQueueInput,
  RecoveryQueueItem,
} from "./types";

const dayInMs = 24 * 60 * 60 * 1000;
const expiringWindowDays = 3;
const inactiveWindowDays = 7;

function parseUtcInstant(value: string) {
  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    throw new Error(`Invalid recovery date: ${value}`);
  }

  return timestamp;
}

function isOlderThanHours(earlier: string | null, laterTimestamp: number, hours: number) {
  if (!earlier) {
    return true;
  }

  return laterTimestamp - parseUtcInstant(earlier) > hours * 60 * 60 * 1000;
}

function toQueueItem(member: RecoveryMember): RecoveryQueueItem {
  return { id: member.id, name: member.name };
}

export function buildRecoveryBuckets(input: RecoveryQueueInput): RecoveryBuckets {
  const now = parseUtcInstant(input.today);
  const pendingPaymentMembers = new Set(
    input.payments.filter((payment) => payment.status === "pending").map((payment) => payment.memberId),
  );

  const coldLeads = [...input.leads]
    .filter((lead) => isOlderThanHours(lead.lastContactedAt, now, 24))
    .sort((left, right) => {
      if (!left.lastContactedAt) {
        return -1;
      }

      if (!right.lastContactedAt) {
        return 1;
      }

      return parseUtcInstant(left.lastContactedAt) - parseUtcInstant(right.lastContactedAt);
    })
    .map(({ id, name }) => ({ id, name }));

  const pendingPayments: RecoveryQueueItem[] = [];
  const expiredUnpaid: RecoveryQueueItem[] = [];
  const expiringMembers: RecoveryQueueItem[] = [];
  const inactiveMembers: RecoveryQueueItem[] = [];

  const subscriptionsByMember = new Map<string, RecoveryQueueInput["subscriptions"][number][]>();

  for (const subscription of input.subscriptions) {
    const list = subscriptionsByMember.get(subscription.memberId) ?? [];
    list.push(subscription);
    subscriptionsByMember.set(subscription.memberId, list);
  }

  for (const member of input.members) {
    const subscriptions = subscriptionsByMember.get(member.id) ?? [];
    const hasPendingPayment = pendingPaymentMembers.has(member.id);

    const isExpiredUnpaid = subscriptions.some((subscription) => {
      const expiryTimestamp = parseUtcInstant(subscription.expiryDate);
      return expiryTimestamp < now && subscription.dueAmountInr > 0;
    });

    const isExpiring = subscriptions.some((subscription) => {
      const expiryTimestamp = parseUtcInstant(subscription.expiryDate);
      const daysUntilExpiry = (expiryTimestamp - now) / dayInMs;
      return daysUntilExpiry >= 0 && daysUntilExpiry <= expiringWindowDays;
    });

    const isInactive = !member.lastVisitAt
      || now - parseUtcInstant(member.lastVisitAt) > inactiveWindowDays * dayInMs;

    if (hasPendingPayment) {
      pendingPayments.push(toQueueItem(member));
      continue;
    }

    if (isExpiredUnpaid) {
      expiredUnpaid.push(toQueueItem(member));
      continue;
    }

    if (isExpiring) {
      expiringMembers.push(toQueueItem(member));
      continue;
    }

    if (isInactive) {
      inactiveMembers.push(toQueueItem(member));
    }
  }

  return {
    coldLeads,
    expiringMembers,
    expiredUnpaid,
    inactiveMembers,
    pendingPayments,
  };
}
