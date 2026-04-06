"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWorkspace } from "./actions";

export function SetupForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) return;
    setPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await createWorkspace(formData);

    if (result?.error) {
      setError(result.error);
      setPending(false);
    } else {
      router.refresh(); // Reload to hit the dashboard redirect
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block space-y-2">
        <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          Gym Name
        </span>
        <input
          className="input-glass h-12"
          name="gymName"
          placeholder="e.g. Iron Forge Fitness"
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          Your Full Name
        </span>
        <input
          className="input-glass h-12"
          name="fullName"
          placeholder="e.g. John Doe"
          required
        />
      </label>

      {error && (
        <p
          className="rounded-xl px-4 py-3 text-sm"
          role="alert"
          style={{
            background: "rgba(255, 0, 110, 0.1)",
            color: "var(--accent-red)",
            border: "1px solid rgba(255, 0, 110, 0.2)",
          }}
        >
          {error}
        </p>
      )}

      <button className="btn-primary w-full h-12 text-base mt-2" disabled={pending} type="submit">
        {pending ? "Creating Workspace..." : "Let's Go"}
      </button>
    </form>
  );
}
