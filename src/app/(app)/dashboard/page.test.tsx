import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DashboardPage from "./page";

describe("DashboardPage", () => {
  it("renders the sellable revenue and retention cards", () => {
    render(<DashboardPage />);

    expect(screen.getByText("Collections Today")).toBeTruthy();
    expect(screen.getByText("INR 12,000")).toBeTruthy();
    expect(screen.getByText("Lead Conversion")).toBeTruthy();
    expect(screen.getByText("30%")).toBeTruthy();
  });
});
