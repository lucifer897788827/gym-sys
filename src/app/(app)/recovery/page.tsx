import { buildRecoveryBuckets } from "@/features/recovery/queries";
import type { RecoveryBuckets } from "@/features/recovery/types";
import { GlassCard } from "@/components/ui/glass-card";
import { PageHeader } from "@/components/ui/page-header";

type GlowColor = "cyan" | "purple" | "lime" | "amber" | "red" | "orange";

const bucketCopy: Array<{
  key: keyof RecoveryBuckets;
  title: string;
  description: string;
  action: string;
  icon: string;
  glow: GlowColor;
  color: string;
}> = [
  {
    key: "coldLeads",
    title: "Cold leads",
    description: "Enquiries that have gone quiet for more than 24 hours.",
    action: "Call or WhatsApp before the lead cools further.",
    icon: "❄️",
    glow: "purple",
    color: "var(--accent-electric)",
  },
  {
    key: "expiringMembers",
    title: "Expiring members",
    description: "Members whose plans end in the next three days.",
    action: "Renew before they miss a session.",
    icon: "⏰",
    glow: "amber",
    color: "var(--accent-amber)",
  },
  {
    key: "expiredUnpaid",
    title: "Expired unpaid",
    description: "Expired subscriptions that still carry an outstanding balance.",
    action: "Recover the dues before the member drops off.",
    icon: "🚨",
    glow: "red",
    color: "var(--accent-red)",
  },
  {
    key: "inactiveMembers",
    title: "Inactive members",
    description: "Members who have not checked in for a week or more.",
    action: "Send a comeback nudge with a simple next step.",
    icon: "😴",
    glow: "orange",
    color: "var(--accent-orange)",
  },
  {
    key: "pendingPayments",
    title: "Pending payments",
    description: "Members waiting on a payment to clear or verify.",
    action: "Confirm the payment and close the loop.",
    icon: "💳",
    glow: "cyan",
    color: "var(--accent-cyan)",
  },
];

const sampleBuckets = buildRecoveryBuckets({
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

export default function RecoveryPage() {
  return (
    <section className="space-y-8">
      <PageHeader
        tag="Recovery Queue"
        title="Five buckets for bringing revenue back"
        description="Cold leads, renewals, dues, inactivity, and pending payments — focused on the next best follow-up."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 stagger">
        {bucketCopy.map((bucket) => {
          const items = sampleBuckets[bucket.key];

          return (
            <GlassCard key={bucket.key} glow={bucket.glow}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{bucket.icon}</span>
                <p
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: bucket.color }}
                >
                  {bucket.title}
                </p>
              </div>
              <p
                className="text-3xl font-bold font-display"
                style={{ color: bucket.color }}
              >
                {items.length}
              </p>
              <p
                className="mt-2 text-sm leading-6"
                style={{ color: "var(--text-secondary)" }}
              >
                {bucket.description}
              </p>
              <p
                className="mt-3 rounded-lg px-3 py-2 text-sm"
                style={{
                  background: "var(--bg-surface-hover)",
                  color: "var(--text-secondary)",
                }}
              >
                {bucket.action}
              </p>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard hoverable={false}>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2
              className="text-lg font-bold font-display"
              style={{ color: "var(--text-primary)" }}
            >
              Today&apos;s queue
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              A tiny operational surface for the front desk.
            </p>
          </div>
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              background: "var(--bg-surface-hover)",
              color: "var(--text-muted)",
              border: "1px solid var(--glass-border)",
            }}
          >
            Sample data
          </span>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {bucketCopy.map((bucket) => {
            const items = sampleBuckets[bucket.key];

            return (
              <div
                key={bucket.key}
                className="flex items-center justify-between rounded-xl px-4 py-4 transition-all"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{bucket.icon}</span>
                  <div>
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                      {bucket.title}
                    </p>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {bucket.description}
                    </p>
                  </div>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-sm font-bold font-display"
                  style={{
                    background: `${bucket.color}20`,
                    color: bucket.color,
                  }}
                >
                  {items.length}
                </span>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </section>
  );
}
