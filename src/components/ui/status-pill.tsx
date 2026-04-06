type MemberState = "ACTIVE" | "EXPIRING" | "EXPIRED" | "LOST";

type StatusPillProps = {
  state: MemberState;
  className?: string;
};

const stateConfig: Record<
  MemberState,
  { label: string; bg: string; text: string; dot: string }
> = {
  ACTIVE: {
    label: "Active",
    bg: "rgba(168, 224, 99, 0.15)",
    text: "var(--accent-lime)",
    dot: "var(--accent-lime)",
  },
  EXPIRING: {
    label: "Expiring",
    bg: "rgba(255, 190, 11, 0.15)",
    text: "var(--accent-amber)",
    dot: "var(--accent-amber)",
  },
  EXPIRED: {
    label: "Expired",
    bg: "rgba(255, 0, 110, 0.15)",
    text: "var(--accent-red)",
    dot: "var(--accent-red)",
  },
  LOST: {
    label: "Lost",
    bg: "rgba(240, 240, 245, 0.08)",
    text: "var(--text-secondary)",
    dot: "var(--text-muted)",
  },
};

export function StatusPill({ state, className = "" }: StatusPillProps) {
  const config = stateConfig[state];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${className}`}
      style={{ background: config.bg, color: config.text }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{
          background: config.dot,
          boxShadow: state === "EXPIRING" ? `0 0 6px ${config.dot}` : "none",
        }}
      />
      {config.label}
    </span>
  );
}
