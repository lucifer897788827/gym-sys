import { parseCsvRows } from "@/features/imports/csv";
import { GlassCard } from "@/components/ui/glass-card";
import { PageHeader } from "@/components/ui/page-header";

const sampleCsv = `name,phone,source
Ravi,+919900000001,walk-in
Neha,+919900000002,instagram`;

const previewRows = parseCsvRows(sampleCsv);

export default function ImportsPage() {
  return (
    <section className="space-y-8">
      <PageHeader
        tag="Imports"
        title="Turn exported rows into today's action list"
        description="Start with a dead simple CSV pipeline so gyms can move off scattered spreadsheets without drama."
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] stagger">
        <GlassCard glow="orange" hoverable={false}>
          <h2
            className="text-lg font-bold font-display"
            style={{ color: "var(--text-primary)" }}
          >
            Import checklist
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold" style={{ background: "var(--accent-orange)", color: "var(--bg-primary)" }}>1</span>
              Export members or leads as CSV from the current tool.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold" style={{ background: "var(--accent-orange)", color: "var(--bg-primary)" }}>2</span>
              Keep the first row as headers: name, phone, source.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold" style={{ background: "var(--accent-orange)", color: "var(--bg-primary)" }}>3</span>
              Review the preview before writing anything to the database.
            </li>
          </ul>

          {/* Drop zone visual */}
          <div
            className="mt-5 flex h-24 items-center justify-center rounded-xl border-2 border-dashed transition-colors"
            style={{
              borderColor: "rgba(251, 139, 36, 0.3)",
              background: "rgba(251, 139, 36, 0.05)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              📥 Drop CSV file here
            </p>
          </div>
        </GlassCard>

        <GlassCard hoverable={false}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2
                className="text-lg font-bold font-display"
                style={{ color: "var(--text-primary)" }}
              >
                Preview rows
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Parsed with the shared CSV utility.
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

          <div className="mt-5 overflow-hidden rounded-xl" style={{ border: "1px solid var(--glass-border)" }}>
            <table className="min-w-full divide-y text-left text-sm" style={{ borderColor: "var(--glass-border)" }}>
              <thead style={{ background: "var(--bg-surface-hover)" }}>
                <tr>
                  <th className="px-4 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Name</th>
                  <th className="px-4 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Phone</th>
                  <th className="px-4 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Source</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row) => (
                  <tr
                    key={row.phone}
                    className="transition-colors"
                    style={{ borderTop: "1px solid var(--glass-border)" }}
                  >
                    <td className="px-4 py-3" style={{ color: "var(--text-primary)" }}>{row.name}</td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--accent-cyan)" }}>{row.phone}</td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded-md px-2 py-0.5 text-xs font-medium"
                        style={{
                          background: "rgba(108, 92, 231, 0.15)",
                          color: "var(--accent-electric)",
                        }}
                      >
                        {row.source}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
