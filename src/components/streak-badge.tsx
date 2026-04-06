"use client";

export function StreakBadge({ days }: { days: number }) {
  const label = days > 0 ? `${days}-day streak` : "No current streak";
  const isHot = days >= 7;
  const isActive = days > 0;

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold font-display"
      style={{
        background: isActive
          ? "linear-gradient(135deg, rgba(255, 190, 11, 0.2), rgba(251, 139, 36, 0.2))"
          : "var(--bg-surface)",
        color: isActive ? "var(--accent-amber)" : "var(--text-muted)",
        border: `1px solid ${isActive ? "rgba(255, 190, 11, 0.3)" : "var(--glass-border)"}`,
        boxShadow: isHot ? "0 0 20px rgba(255, 190, 11, 0.3)" : "none",
      }}
    >
      <span
        className="text-base"
        style={{
          filter: isHot ? "drop-shadow(0 0 4px rgba(255, 190, 11, 0.6))" : "none",
        }}
      >
        {isActive ? "🔥" : "❄️"}
      </span>
      {label}
    </span>
  );
}
