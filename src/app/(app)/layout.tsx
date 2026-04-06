import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getActor } from "../../lib/auth/get-actor";
import { SidebarNav } from "../../components/ui/sidebar-nav";
import { PulseOrb } from "../../components/3d/pulse-orb";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const actor = await getActor();

  if (actor.kind === "anonymous") {
    redirect("/login");
  }

  if (actor.kind === "unprovisioned") {
    redirect("/not-provisioned");
  }

  if (actor.kind === "member") {
    redirect("/member");
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <PulseOrb />
      <SidebarNav />

      {/* Main content — offset by sidebar on desktop */}
      <div className="lg:pl-[240px]">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8 lg:pb-8">
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
