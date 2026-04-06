import { GlassCard } from "@/components/ui/glass-card";
import { PageHeader } from "@/components/ui/page-header";

const memberHighlights = [
  {
    label: "Next class",
    value: "Strength circuit",
    detail: "Today at 6:30 PM",
    icon: "🏋️",
    color: "var(--accent-cyan)",
  },
  {
    label: "Check-in streak",
    value: "12 days",
    detail: "Keep the momentum going",
    icon: "🔥",
    color: "var(--accent-amber)",
  },
  {
    label: "Plan status",
    value: "Active",
    detail: "Renews on 2026-05-01",
    icon: "✅",
    color: "var(--accent-lime)",
  },
];

export default function MemberPage() {
  return (
    <section className="space-y-8">
      <PageHeader
        tag="Member"
        title="Your member hub"
        description="View the basics that matter most: today's plan, streak momentum, and your membership status."
        gradient={false}
      />

      <div className="grid gap-4 md:grid-cols-3 stagger">
        {memberHighlights.map((item) => (
          <GlassCard key={item.label} glow="gold">
            <div className="flex items-start justify-between">
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {item.label}
              </p>
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm"
                style={{ background: `${item.color}20` }}
              >
                {item.icon}
              </span>
            </div>
            <p
              className="mt-2 text-2xl font-bold font-display"
              style={{ color: item.color }}
            >
              {item.value}
            </p>
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {item.detail}
            </p>
          </GlassCard>
        ))}
      </div>

      <GlassCard hoverable={false} glow="gold">
        <h2
          className="text-lg font-bold font-display"
          style={{ color: "var(--text-primary)" }}
        >
          Today&apos;s focus
        </h2>
        <div
          className="mt-4 rounded-xl p-4"
          style={{
            background: "linear-gradient(135deg, rgba(244, 197, 66, 0.08), rgba(255, 190, 11, 0.05))",
            border: "1px solid rgba(244, 197, 66, 0.15)",
          }}
        >
          <p className="text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
            Show the next workout, a quick reminder, or a friendly tip here once
            live member data is connected.
          </p>
        </div>

        {/* Achievement badges */}
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            Achievements
          </p>
          <div className="flex flex-wrap gap-2">
            {["🎯 First Week", "🔥 10-Day Streak", "💪 Month Strong"].map((badge) => (
              <span
                key={badge}
                className="rounded-full px-3 py-1.5 text-xs font-semibold"
                style={{
                  background: "rgba(244, 197, 66, 0.12)",
                  color: "var(--accent-gold)",
                  border: "1px solid rgba(244, 197, 66, 0.2)",
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
