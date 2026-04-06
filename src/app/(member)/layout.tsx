import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getActor } from "../../lib/auth/get-actor";

export default async function MemberLayout({
  children,
}: {
  children: ReactNode;
}) {
  const actor = await getActor();

  if (actor.kind === "anonymous") {
    redirect("/login");
  }

  if (actor.kind === "unprovisioned") {
    redirect("/not-provisioned");
  }

  if (actor.kind === "internal") {
    redirect("/dashboard");
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* Ambient warm glow for member portal */}
      <div className="ambient-bg" aria-hidden="true">
        <div
          className="ambient-orb"
          style={{
            width: "500px",
            height: "500px",
            background: "var(--accent-gold)",
            top: "-15%",
            right: "10%",
            opacity: "0.08",
          }}
        />
        <div
          className="ambient-orb"
          style={{
            width: "350px",
            height: "350px",
            background: "var(--accent-amber)",
            bottom: "5%",
            left: "5%",
            opacity: "0.06",
            animationDelay: "-8s",
          }}
        />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header
          className="mb-8 flex items-center justify-between pb-4"
          style={{ borderBottom: "1px solid var(--glass-border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
              style={{
                background: "linear-gradient(135deg, var(--accent-gold), var(--accent-amber))",
              }}
            >
              🏋️
            </div>
            <div>
              <p
                className="text-sm font-bold font-display"
                style={{ color: "var(--text-primary)" }}
              >
                Gym Growth OS
              </p>
              <p
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--accent-gold)" }}
              >
                Member Hub
              </p>
            </div>
          </div>
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              background: "rgba(244, 197, 66, 0.15)",
              color: "var(--accent-gold)",
              border: "1px solid rgba(244, 197, 66, 0.25)",
            }}
          >
            Member
          </span>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
