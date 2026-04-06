import Link from "next/link";
import { GymScene } from "@/components/3d/gym-scene";

export default function HomePage() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* Ambient background */}
      <div className="ambient-bg" aria-hidden="true">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        {/* Extra accent orb */}
        <div
          className="ambient-orb"
          style={{
            width: "300px",
            height: "300px",
            background: "var(--accent-lime)",
            top: "60%",
            right: "20%",
            opacity: "0.06",
            animationDelay: "-5s",
          }}
        />
      </div>

      {/* 3D Dumbbell — large background element */}
      <div className="absolute inset-0 hidden lg:flex items-center justify-center opacity-20 pointer-events-none">
        <div className="h-[500px] w-[500px]">
          <GymScene className="h-full w-full" />
        </div>
      </div>

      <div className="relative z-10 max-w-3xl text-center space-y-8 animate-fade-in-up">
        {/* Logo/Brand */}
        <div className="flex justify-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
            style={{
              background: "linear-gradient(135deg, var(--accent-electric), var(--accent-cyan))",
              boxShadow: "0 8px 30px var(--accent-electric-glow)",
            }}
          >
            🏋️
          </div>
        </div>

        <p
          className="text-xs font-semibold uppercase tracking-[0.4em]"
          style={{ color: "var(--text-muted)" }}
        >
          Revenue &amp; Retention OS
        </p>

        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl font-display">
          <span className="gradient-text">Gym Growth</span>{" "}
          <span style={{ color: "var(--text-primary)" }}>OS</span>
        </h1>

        <p
          className="mx-auto max-w-xl text-lg leading-8"
          style={{ color: "var(--text-secondary)" }}
        >
          The operating system for single-location gyms in India.
          Collections, lead conversion, and retention — all in one place.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/login" className="btn-primary h-14 px-8 text-base">
            Get started →
          </Link>
          <Link
            href="/login"
            className="inline-flex h-14 items-center justify-center rounded-xl px-8 text-base font-semibold transition-all"
            style={{
              color: "var(--text-secondary)",
              background: "var(--bg-surface)",
              border: "1px solid var(--glass-border)",
            }}
          >
            Sign in
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="grid gap-4 pt-8 sm:grid-cols-3 stagger">
          {[
            { icon: "💰", label: "Collections", desc: "Track revenue daily" },
            { icon: "🎯", label: "Lead Capture", desc: "Convert walk-ins" },
            { icon: "🚨", label: "Recovery Queue", desc: "Save churn risk" },
          ].map((feature) => (
            <div key={feature.label} className="glass-static p-4 animate-fade-in-up" style={{ borderRadius: "var(--radius-xl)" }}>
              <span className="text-2xl">{feature.icon}</span>
              <p className="mt-2 font-semibold font-display" style={{ color: "var(--text-primary)" }}>
                {feature.label}
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
