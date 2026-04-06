import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ImportsPage from "./page";

describe("ImportsPage", () => {
  it("renders a CSV preview for the recovery-first onboarding flow", () => {
    render(<ImportsPage />);

    expect(screen.getByRole("heading", { name: /turn exported rows into today's action list/i })).toBeTruthy();
    expect(screen.getByText("Ravi")).toBeTruthy();
    expect(screen.getByText("instagram")).toBeTruthy();
  });
});
