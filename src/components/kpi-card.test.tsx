import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { KpiCard } from "./kpi-card";

describe("KpiCard", () => {
  it("renders the label, value, and hint", () => {
    render(<KpiCard label="Collections Today" value="INR 12,000" hint="Pending: INR 8,000" />);

    expect(screen.getByText("Collections Today")).toBeTruthy();
    expect(screen.getByText("INR 12,000")).toBeTruthy();
    expect(screen.getByText("Pending: INR 8,000")).toBeTruthy();
  });
});
