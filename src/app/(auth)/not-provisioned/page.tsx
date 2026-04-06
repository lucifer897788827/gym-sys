import { redirect } from "next/navigation";

import { getActor } from "../../../lib/auth/get-actor";

export default async function NotProvisionedPage() {
  const actor = await getActor();

  if (actor.kind === "anonymous") {
    redirect("/login");
  }

  if (actor.kind === "internal") {
    redirect("/dashboard");
  }

  if (actor.kind === "member") {
    redirect("/member");
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center px-6"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* Ambient background */}
      <div className="ambient-bg" aria-hidden="true">
        <div className="ambient-orb ambient-orb-1" />
      </div>

      <div
        className="relative z-10 max-w-xl space-y-5 glass-static p-8 text-center"
        style={{ borderRadius: "var(--radius-2xl)" }}
      >
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
          style={{
            background: "rgba(255, 190, 11, 0.15)",
            border: "1px solid rgba(255, 190, 11, 0.25)",
          }}
        >
          ⏳
        </div>
        <p
          className="text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: "var(--text-muted)" }}
        >
          Gym Growth OS
        </p>
        <h1 className="text-3xl font-bold tracking-tight font-display gradient-text">
          Your account is not provisioned yet
        </h1>
        <p className="text-base leading-7" style={{ color: "var(--text-secondary)" }}>
          You&apos;re signed in, but no internal or member record has been mapped
          to this auth account yet. Ask an owner or staff member to provision it.
        </p>
        <a className="btn-primary inline-flex" href="/login">
          Back to login
        </a>
      </div>
    </main>
  );
}
