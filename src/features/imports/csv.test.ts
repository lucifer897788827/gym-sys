import { describe, expect, it } from "vitest";

import { parseCsvRows } from "./csv";

describe("parseCsvRows", () => {
  it("maps each line to the header fields", () => {
    const rows = parseCsvRows(`name,phone,source
Ravi,+919900000001,walk-in
Neha,+919900000002,instagram`);

    expect(rows).toEqual([
      { name: "Ravi", phone: "+919900000001", source: "walk-in" },
      { name: "Neha", phone: "+919900000002", source: "instagram" },
    ]);
  });
});
