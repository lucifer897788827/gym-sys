"use client";

import { useState } from "react";
import { createLead } from "@/features/leads/actions";

export function LeadForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) return;
    setPending(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const result = await createLead(formData);

    if (result.error) {
      setError(result.error);
      setPending(false);
    } else {
      setSuccess(true);
      setPending(false);
      (event.target as HTMLFormElement).reset();
      // Wait for revalidation to propagate
      setTimeout(() => setSuccess(false), 3000);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          <span>Name</span>
          <input
            name="name"
            type="text"
            className="input-glass h-11"
            placeholder="e.g. Rahul Sharma"
            required
          />
        </label>
        <label className="space-y-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          <span>Phone</span>
          <input
            name="phone"
            type="tel"
            className="input-glass h-11"
            placeholder="e.g. 9876543210"
            required
            pattern="[0-9]{10,}"
            title="Please enter at least 10 digits"
          />
        </label>
      </div>

      <label className="block space-y-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
        <span>Source</span>
        <select
          name="source"
          className="input-glass h-11"
          required
        >
          <option value="walk_in">Walk-in</option>
          <option value="referral">Referral</option>
          <option value="instagram">Instagram</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="facebook">Facebook</option>
          <option value="google">Google</option>
        </select>
      </label>

      {error && (
        <div 
          className="rounded-xl px-4 py-3 text-sm"
          style={{ 
            background: "rgba(255, 0, 110, 0.1)", 
            color: "var(--accent-red)",
            border: "1px solid rgba(255, 0, 110, 0.2)"
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div 
          className="rounded-xl px-4 py-3 text-sm"
          style={{ 
            background: "rgba(0, 245, 255, 0.1)", 
            color: "var(--accent-cyan)",
            border: "1px solid rgba(0, 245, 255, 0.2)"
          }}
        >
          ✓ Lead added successfully!
        </div>
      )}

      <button 
        type="submit" 
        className="btn-primary w-full h-11 text-base font-semibold"
        disabled={pending}
      >
        {pending ? "Adding Lead..." : "Add Lead"}
      </button>
    </form>
  );
}
