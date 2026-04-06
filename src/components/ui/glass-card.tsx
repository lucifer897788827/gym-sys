"use client";

import type { ReactNode } from "react";

type GlowColor = "cyan" | "purple" | "lime" | "amber" | "red" | "orange" | "emerald" | "gold";

type GlassCardProps = {
  children: ReactNode;
  glow?: GlowColor;
  className?: string;
  hoverable?: boolean;
  accentBar?: GlowColor;
};

const glowMap: Record<GlowColor, string> = {
  cyan: "glow-cyan",
  purple: "glow-purple",
  lime: "glow-lime",
  amber: "glow-amber",
  red: "glow-red",
  orange: "glow-orange",
  emerald: "glow-emerald",
  gold: "glow-gold",
};

const accentBarMap: Record<GlowColor, string> = {
  cyan: "accent-bar accent-bar-cyan",
  purple: "accent-bar accent-bar-purple",
  lime: "accent-bar accent-bar-lime",
  amber: "accent-bar accent-bar-amber",
  red: "accent-bar accent-bar-red",
  orange: "accent-bar accent-bar-orange",
  emerald: "accent-bar accent-bar-emerald",
  gold: "accent-bar",
};

export function GlassCard({
  children,
  glow,
  className = "",
  hoverable = true,
  accentBar,
}: GlassCardProps) {
  const baseClass = hoverable ? "glass" : "glass-static";
  const glowClass = glow ? glowMap[glow] : "";
  const barClass = accentBar ? accentBarMap[accentBar] : "";

  return (
    <div
      className={`${baseClass} ${glowClass} ${barClass} p-5 ${className} animate-fade-in-up`}
    >
      {accentBar ? <div className="pl-4">{children}</div> : children}
    </div>
  );
}
