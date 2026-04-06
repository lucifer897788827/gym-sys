import { buildWhatsappMessage } from "@/features/whatsapp/build-message";
import { whatsappTemplates } from "@/features/whatsapp/templates";
import { GlassCard } from "@/components/ui/glass-card";
import { PageHeader } from "@/components/ui/page-header";

const templates = [
  {
    name: "Lead follow-up",
    goal: "Bring fresh enquiries back into the gym within 24 hours.",
    preview: buildWhatsappMessage("lead_follow_up", {
      name: "Asha",
      gymName: "Strong Box",
    }),
  },
  {
    name: "Expiry reminder",
    goal: "Save renewals before the plan lapses.",
    preview: buildWhatsappMessage("expiry_reminder", {
      name: "Ravi",
      expiryDate: "2026-04-03",
      gymName: "Strong Box",
    }),
  },
  {
    name: "Comeback message",
    goal: "Re-activate inactive members with a low-friction prompt.",
    preview: buildWhatsappMessage("comeback_message", {
      name: "Neha",
      gymName: "Strong Box",
    }),
  },
];

export default function WhatsappSettingsPage() {
  return (
    <section className="space-y-8">
      <PageHeader
        tag="WhatsApp"
        title="Follow-up templates"
        description="V1 keeps templates editable in code, with live previews to make the eventual API handoff straightforward."
      />

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] stagger">
        <GlassCard glow="emerald" hoverable={false}>
          <h2
            className="text-lg font-bold font-display"
            style={{ color: "var(--text-primary)" }}
          >
            Template library
          </h2>
          <div className="mt-5 space-y-3">
            {templates.map((template) => (
              <div
                key={template.name}
                className="rounded-xl px-4 py-4"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">💬</span>
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                    {template.name}
                  </p>
                </div>
                <p className="mt-1 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
                  {template.goal}
                </p>
                {/* Chat bubble style preview */}
                <div
                  className="mt-3 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-6"
                  style={{
                    background: "rgba(37, 211, 102, 0.1)",
                    color: "var(--text-primary)",
                    border: "1px solid rgba(37, 211, 102, 0.2)",
                  }}
                >
                  {template.preview}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard hoverable={false}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2
                className="text-lg font-bold font-display"
                style={{ color: "var(--text-primary)" }}
              >
                Live preview
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Shared template keys ready for click-to-chat previews.
              </p>
            </div>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                background: "rgba(37, 211, 102, 0.15)",
                color: "var(--accent-emerald)",
                border: "1px solid rgba(37, 211, 102, 0.25)",
              }}
            >
              Preview
            </span>
          </div>

          <div
            className="mt-5 rounded-xl p-5"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <div className="flex flex-wrap gap-2">
              {Object.keys(whatsappTemplates).map((key) => (
                <span
                  key={key}
                  className="rounded-lg px-3 py-1.5 text-xs font-mono font-medium"
                  style={{
                    background: "rgba(37, 211, 102, 0.12)",
                    color: "var(--accent-emerald)",
                    border: "1px solid rgba(37, 211, 102, 0.2)",
                  }}
                >
                  {key}
                </span>
              ))}
            </div>
          </div>

          {/* WhatsApp phone mockup */}
          <div className="mt-6 flex justify-center">
            <div
              className="w-64 rounded-3xl p-4"
              style={{
                background: "var(--bg-surface-hover)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center text-sm"
                  style={{ background: "var(--accent-emerald)" }}
                >
                  🏋️
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Strong Box Gym</p>
                  <p className="text-[10px]" style={{ color: "var(--accent-emerald)" }}>online</p>
                </div>
              </div>
              <div
                className="rounded-xl rounded-tl-sm px-3 py-2 text-[11px] leading-5"
                style={{
                  background: "rgba(37, 211, 102, 0.12)",
                  color: "var(--text-primary)",
                }}
              >
                {templates[0].preview}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
