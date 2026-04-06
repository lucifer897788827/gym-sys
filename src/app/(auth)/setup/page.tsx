import { redirect } from "next/navigation";
import { getWorkspace } from "@/lib/supabase/queries";
import { SetupForm } from "./setup-form";

export const metadata = {
  title: "Setup Your Gym | Gym Growth OS",
};

export default async function SetupPage() {
  const workspace = await getWorkspace();

  if (!workspace) {
    // Not authenticated
    redirect("/login");
  }

  if (workspace.gymId) {
    // Already has a gym!
    redirect("/dashboard");
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center px-6"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* Ambient background */}
      <div className="ambient-bg" aria-hidden="true">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--text-muted)" }}
          >
            Almost there
          </p>
          <h1 className="text-3xl font-bold tracking-tight font-display gradient-text">
            Name your Workspace
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Let&apos;s create a dedicated instance for your Gym.
          </p>
        </div>

        <section
          className="glass-static p-6 sm:p-8"
          style={{ borderRadius: "var(--radius-2xl)" }}
        >
          <SetupForm />
        </section>
      </div>
    </main>
  );
}
