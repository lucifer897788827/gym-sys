import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("Home", () => {
  it("renders the landing copy", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /growth and retention tooling for single-location gyms/i,
      }),
    ).toBeTruthy();
  });
});
