import type { Metadata } from "next";

import { LoginForm } from "./login-form";
import { GymScene } from "@/components/3d/gym-scene";

export const metadata: Metadata = {
  title: "Login | Gym Growth OS",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

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

      {/* 3D Dumbbell — desktop only, behind the form */}
      <div className="absolute inset-0 hidden lg:flex items-center justify-center opacity-30 pointer-events-none">
        <div className="h-[400px] w-[400px]">
          <GymScene className="h-full w-full" />
        </div>
      </div>

      <div className="relative z-10 grid w-full max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-center space-y-6">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--text-muted)" }}
          >
            Gym Growth OS
          </p>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-display gradient-text">
              Sign in to Gym Growth OS
            </h1>
            <p
              className="max-w-xl text-base leading-7"
              style={{ color: "var(--text-secondary)" }}
            >
              Use your Supabase account to get back into the workspace. Members
              and internal users will be routed to the right place after sign-in.
            </p>
          </div>
          <div
            className="grid gap-3 text-sm sm:grid-cols-2"
            style={{ color: "var(--text-secondary)" }}
          >
            <div className="glass-static p-4" style={{ borderRadius: "var(--radius-xl)" }}>
              <span className="text-base mr-2">🏢</span>
              Owner and staff users keep the internal workspace.
            </div>
            <div className="glass-static p-4" style={{ borderRadius: "var(--radius-xl)" }}>
              <span className="text-base mr-2">💪</span>
              Members are redirected to their member hub automatically.
            </div>
          </div>
        </section>

        <section
          className="glass-static p-6 sm:p-8"
          style={{ borderRadius: "var(--radius-2xl)" }}
        >
          <LoginForm nextPath={resolvedSearchParams?.next} />
        </section>
      </div>
    </main>
  );
}
