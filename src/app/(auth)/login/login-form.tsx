"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "../../../lib/supabase/browser";

import { resolvePostLoginRedirect } from "./actions";

type LoginFormProps = {
  nextPath?: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) {
      return;
    }

    setPending(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(nextPath || '/setup')}`,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setPending(false);
      return;
    }

    setSuccess(true);
    setPending(false);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <p
          className="text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: "var(--accent-electric)" }}
        >
          Sign in
        </p>
        <h2
          className="text-2xl font-bold tracking-tight font-display"
          style={{ color: "var(--text-primary)" }}
        >
          Welcome back
        </h2>
        <p className="text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
          Enter the email address and password tied to your Supabase account.
        </p>
      </div>

      {!success && (
        <>
          <label className="block space-y-2">
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Email address
            </span>
            <input
              aria-label="Email address"
              autoComplete="email"
              className="input-glass h-12"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              type="email"
              value={email}
            />
          </label>

          {error ? (
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
          ) : null}

          <button className="btn-primary w-full h-12 text-base" disabled={pending} type="submit">
            {pending ? "Sending magic link..." : "Send magic link"}
          </button>
        </>
      )}

      {success && (
         <div
          className="rounded-xl px-4 py-6 text-center text-sm"
          role="alert"
          style={{
            background: "rgba(56, 189, 248, 0.1)",
            color: "var(--text-primary)",
            border: "1px solid rgba(56, 189, 248, 0.2)",
          }}
        >
          <span className="block text-2xl mb-2">✨</span>
          <p className="font-semibold text-lg mb-1" style={{ color: "var(--accent-cyan)" }}>Check your email</p>
          <p style={{ color: "var(--text-secondary)" }}>We sent a magic link to <strong>{email}</strong></p>
        </div>
      )}
    </form>
  );
}
