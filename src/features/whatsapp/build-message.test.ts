import { describe, expect, it } from "vitest";

import { buildWhatsappMessage } from "./build-message";

describe("buildWhatsappMessage", () => {
  it("fills the expiry reminder template", () => {
    const result = buildWhatsappMessage("expiry_reminder", {
      name: "Ravi",
      expiryDate: "2026-04-03",
      gymName: "Strong Box",
    });

    expect(result).toContain("Ravi");
    expect(result).toContain("2026-04-03");
    expect(result).not.toContain("{{");
  });
});
