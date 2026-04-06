import { redirect } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { PageHeader } from "@/components/ui/page-header";
import { LeadForm } from "./lead-form";
import { getWorkspace } from "@/lib/supabase/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LeadsPage() {
  const workspace = await getWorkspace();

  if (!workspace?.gymId) {
    redirect("/setup");
  }

  const supabase = await createSupabaseServerClient();
  
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("gym_id", workspace.gymId)
    .order("created_at", { ascending: false });

  return (
    <section className="space-y-8 pb-10">
      <PageHeader
        tag="Leads"
        title="Capture interest before it goes cold"
        description="A minimal intake surface for walk-ins, referrals, and WhatsApp enquiries."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Left column: Leads Table */}
        <div className="space-y-6">
          <GlassCard glow="purple" hoverable={false} className="min-h-[500px]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  className="text-lg font-bold font-display"
                  style={{ color: "var(--text-primary)" }}
                >
                  Active Leads
                </h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {leads?.length || 0} leads found in your workspace.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr 
                    className="border-b" 
                    style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
                  >
                    <th className="py-4 px-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Name</th>
                    <th className="py-4 px-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Phone</th>
                    <th className="py-4 px-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Source</th>
                    <th className="py-4 px-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Status</th>
                    <th className="py-4 px-4 text-xs font-semibold uppercase tracking-widest text-right" style={{ color: "var(--text-muted)" }}>Since</th>
                  </tr>
                </thead>
                <tbody>
                  {leads?.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center" style={{ color: "var(--text-muted)" }}>
                        No leads found. Capture your first walk-in on the right.
                      </td>
                    </tr>
                  )}
                  {leads?.map((lead) => (
                    <tr 
                      key={lead.id} 
                      className="border-b group transition-colors" 
                      style={{ borderColor: "rgba(255, 255, 255, 0.02)" }}
                    >
                      <td className="py-4 px-4">
                        <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{lead.full_name}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{lead.phone}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 uppercase tracking-tighter" style={{ color: "var(--text-secondary)" }}>
                          {lead.source?.replace('_', ' ') || 'None'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                         <span 
                           className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded" 
                           style={{ 
                             background: 
                                lead.status === 'new' ? 'rgba(56, 189, 248, 0.1)' : 
                                lead.status === 'converted' ? 'rgba(168, 224, 99, 0.1)' : 
                                'rgba(255, 255, 255, 0.05)',
                             color:
                                lead.status === 'new' ? 'var(--accent-cyan)' :
                                lead.status === 'converted' ? 'var(--accent-lime)' :
                                'var(--text-secondary)'
                           }}
                         >
                           {lead.status}
                         </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {new Date(lead.created_at).toLocaleDateString()}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right column: Lead Form Side Panel */}
        <div className="space-y-6">
          <GlassCard glow="cyan" hoverable={false}>
            <div className="mb-6">
              <h2
                className="text-lg font-bold font-display"
                style={{ color: "var(--text-primary)" }}
              >
                Lead Capture
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Add newwalk-ins to your pipeline.
              </p>
            </div>
            <LeadForm />
          </GlassCard>

          <GlassCard hoverable={false}>
            <h2
              className="text-lg font-bold font-display"
              style={{ color: "var(--text-primary)" }}
            >
              Suggested capture flow
            </h2>
            <ul className="mt-4 space-y-3 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold" style={{ background: "var(--accent-cyan)", color: "var(--bg-primary)" }}>1</span>
                Name and phone at the counter.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold" style={{ background: "var(--accent-cyan)", color: "var(--bg-primary)" }}>2</span>
                Source tag from walk-in, referral, or Instagram.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold" style={{ background: "var(--accent-cyan)", color: "var(--bg-primary)" }}>3</span>
                Follow up within 24 hours.
              </li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
