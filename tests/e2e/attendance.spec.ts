import { expect, test } from "@playwright/test";

test("attendance page highlights the active streak", async ({ page }) => {
  await page.goto("/api/e2e-auth?next=/attendance");

  await expect(
    page.getByRole("heading", { name: "Build streaks from daily check-ins" }),
  ).toBeVisible();
  await expect(page.getByText("3-day streak")).toBeVisible();
});
