"use client";

import { KpiValue } from "./ui/animated-counter";

type GlowColor = "cyan" | "purple" | "lime" | "amber" | "red" | "orange";

type KpiCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: string;
  glow?: GlowColor;
};

const glowMap: Record<GlowColor, string> = {
  cyan: "glow-cyan",
  purple: "glow-purple",
  lime: "glow-lime",
  amber: "glow-amber",
  red: "glow-red",
  orange: "glow-orange",
};

const colorMap: Record<GlowColor, string> = {
  cyan: "var(--accent-cyan)",
  purple: "var(--accent-electric)",
  lime: "var(--accent-lime)",
  amber: "var(--accent-amber)",
  red: "var(--accent-red)",
  orange: "var(--accent-orange)",
};

export function KpiCard({ label, value, hint, icon, glow = "cyan" }: KpiCardProps) {
  return (
    <article
      className={`glass p-5 animate-fade-in-up ${glowMap[glow]}`}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {label}
        </p>
        {icon ? (
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm"
            style={{
              background: `${colorMap[glow]}20`,
              color: colorMap[glow],
            }}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight" style={{ color: colorMap[glow] }}>
        <KpiValue>{value}</KpiValue>
      </p>
      {hint ? (
        <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
          {hint}
        </p>
      ) : null}
    </article>
  );
}
