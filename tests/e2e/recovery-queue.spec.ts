import { expect, test } from "@playwright/test";

test("recovery queue page renders", async ({ page }) => {
  await page.goto("/api/e2e-auth?next=/recovery");

  await expect(page.getByRole("heading", { name: "Five buckets for bringing revenue back" })).toBeVisible();
  await expect(page.locator("article")).toHaveCount(5);
  await expect(page.locator("article").filter({ hasText: "Pending payments" }).first()).toBeVisible();
});
