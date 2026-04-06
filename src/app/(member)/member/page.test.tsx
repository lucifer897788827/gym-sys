import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  redirect: vi.fn((to: string) => {
    throw new Error(`redirect:${to}`);
  }),
}));
vi.mock("../../../lib/auth/get-actor", () => ({
  getActor: vi.fn(),
}));

import MemberPage from "./page";
import AppLayout from "../../(app)/layout";
import NotProvisionedPage from "../../(auth)/not-provisioned/page";
import { getActor } from "../../../lib/auth/get-actor";

describe("MemberPage", () => {
  it("renders the member landing page", () => {
    render(<MemberPage />);

    expect(
      screen.getByRole("heading", { name: /your member hub/i }),
    ).toBeTruthy();
  });
});

describe("AppLayout", () => {
  it("redirects member actors to the member area", async () => {
    vi.mocked(getActor).mockResolvedValueOnce({
      kind: "member",
      authUserId: "auth-1",
      memberId: "member-1",
      gymId: "gym-1",
    });

    await expect(AppLayout({ children: <div>child</div> })).rejects.toThrow(
      "redirect:/member",
    );
  });
});

describe("NotProvisionedPage", () => {
  it("redirects anonymous actors to login", async () => {
    vi.mocked(getActor).mockResolvedValueOnce({ kind: "anonymous" } as never);

    await expect(NotProvisionedPage()).rejects.toThrow("redirect:/login");
  });

  it("redirects internal actors to the dashboard", async () => {
    vi.mocked(getActor).mockResolvedValueOnce({
      kind: "internal",
      userId: "user-1",
      gymId: "gym-1",
      role: "staff",
    } as never);

    await expect(NotProvisionedPage()).rejects.toThrow("redirect:/dashboard");
  });

  it("redirects member actors to the member area", async () => {
    vi.mocked(getActor).mockResolvedValueOnce({
      kind: "member",
      authUserId: "auth-2",
      memberId: "member-2",
      gymId: "gym-2",
    } as never);

    await expect(NotProvisionedPage()).rejects.toThrow("redirect:/member");
  });

  it("renders the page for unprovisioned actors", async () => {
    vi.mocked(getActor).mockResolvedValueOnce({
      kind: "unprovisioned",
      authUserId: "auth-3",
    } as never);

    render(await NotProvisionedPage());

    expect(
      screen.getByRole("heading", {
        name: /your account is not provisioned yet/i,
      }),
    ).toBeTruthy();
  });
});
