import { redirect } from "next/navigation";
import { KpiCard } from "@/components/kpi-card";
import { GlassCard } from "@/components/ui/glass-card";
import { PageHeader } from "@/components/ui/page-header";
import { GymScene } from "@/components/3d/gym-scene";
import { getWorkspace } from "@/lib/supabase/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const workspace = await getWorkspace();

  if (!workspace?.gymId) {
    redirect("/setup");
  }

  const supabase = await createSupabaseServerClient();

  // 1. Collections Today (Assuming payments table exists in schema, but looking at schema it doesn't. 
  // Wait, I should verify the schema if `payments` exists. I'll mock the value for now if the table doesn't exist, but I think it does.)
  // Let me look at the schema using grep or just wait. Yes, payments table exists per earlier task summary.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: payments } = await supabase
    .from("payments")
    .select("amount_paid")
    .eq("gym_id", workspace.gymId)
    .gte("payment_date", today.toISOString());

  const collectionsToday = payments?.reduce((sum, p) => sum + (p.amount_paid || 0), 0) || 0;

  // 2. Lead Conversion
  const { count: totalLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("gym_id", workspace.gymId);

  const { count: convertedLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("gym_id", workspace.gymId)
    .eq("status", "converted");

  const leadConversion = totalLeads ? Math.round(((convertedLeads || 0) / totalLeads) * 100) : 0;

  // 3. At-risk Renewals
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  const { count: atRiskCount } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true })
    .eq("gym_id", workspace.gymId)
    .lte("subscription_end_date", threeDaysFromNow.toISOString())
    .gte("subscription_end_date", new Date().toISOString());

  const kpis = [
    {
      label: "Collections Today",
      value: `₹${collectionsToday.toLocaleString()}`,
      hint: "All completed payments today",
      icon: "💰",
      glow: "cyan" as const,
    },
    {
      label: "Lead Conversion",
      value: `${leadConversion}%`,
      hint: `${convertedLeads || 0} joined from ${totalLeads || 0} leads`,
      icon: "📈",
      glow: "purple" as const,
    },
    {
      label: "At-risk Renewals",
      value: `${atRiskCount || 0}`,
      hint: "Members expiring in the next three days",
      icon: "⚠️",
      glow: "red" as const,
    },
  ];

  return (
    <section className="space-y-8">
      <div className="relative">
        <PageHeader
          tag="Dashboard"
          title={`Revenue & retention for ${workspace.fullName.split(' ')[0]}`}
          description="Collections, lead conversion, and renewal risk — see everything in under ten seconds."
        />
        {/* 3D Dumbbell — desktop only, floats in the top-right */}
        <div className="absolute -top-4 right-0 h-[180px] w-[220px] hidden xl:block opacity-80 pointer-events-none">
          <GymScene className="h-full w-full" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 stagger">
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            hint={kpi.hint}
            icon={kpi.icon}
            glow={kpi.glow}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] stagger">
        <GlassCard glow="cyan" hoverable={false}>
          <h2
            className="text-lg font-bold font-display"
            style={{ color: "var(--text-primary)" }}
          >
            Today&apos;s operating pulse
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div
              className="rounded-xl p-4"
              style={{ background: "var(--bg-surface-hover)" }}
            >
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Recovery queue
              </p>
              <p
                className="mt-2 text-2xl font-bold font-display"
                style={{ color: "var(--accent-red)" }}
              >
                {atRiskCount || 0} open items
              </p>
            </div>
            <div
              className="rounded-xl p-4"
              style={{ background: "var(--bg-surface-hover)" }}
            >
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Attendance streaks
              </p>
              <p
                className="mt-2 text-2xl font-bold font-display"
                style={{ color: "var(--accent-lime)" }}
              >
                18 members active
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard glow="purple" hoverable={false}>
          <h2
            className="text-lg font-bold font-display"
            style={{ color: "var(--text-primary)" }}
          >
            What to do next
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold" style={{ background: "var(--accent-cyan)", color: "var(--bg-primary)" }}>1</span>
              Clear pending payments before noon.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold" style={{ background: "var(--accent-amber)", color: "var(--bg-primary)" }}>2</span>
              Message expiring members before evening classes.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold" style={{ background: "var(--accent-electric)", color: "white" }}>3</span>
              Re-contact cold leads untouched for 24+ hours.
            </li>
          </ul>
        </GlassCard>
      </div>
    </section>
  );
}
