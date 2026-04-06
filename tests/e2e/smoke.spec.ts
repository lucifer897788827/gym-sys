import { expect, test } from "@playwright/test";

test("home page renders", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /growth and retention tooling for single-location gyms/i,
    }),
  ).toBeVisible();
});
