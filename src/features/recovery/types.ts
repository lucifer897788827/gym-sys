export type RecoveryLead = {
  id: string;
  name: string;
  lastContactedAt: string | null;
};

export type RecoveryMember = {
  id: string;
  name: string;
  lastVisitAt: string | null;
};

export type RecoverySubscription = {
  memberId: string;
  expiryDate: string;
  dueAmountInr: number;
};

export type RecoveryPayment = {
  memberId: string;
  status: "pending" | "paid" | "verified";
};

export type RecoveryQueueItem = {
  id: string;
  name: string;
};

export type RecoveryBuckets = {
  coldLeads: RecoveryQueueItem[];
  expiringMembers: RecoveryQueueItem[];
  expiredUnpaid: RecoveryQueueItem[];
  inactiveMembers: RecoveryQueueItem[];
  pendingPayments: RecoveryQueueItem[];
};

export type RecoveryQueueInput = {
  today: string;
  leads: RecoveryLead[];
  members: RecoveryMember[];
  subscriptions: RecoverySubscription[];
  payments: RecoveryPayment[];
};
