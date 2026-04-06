import { expect, test } from "@playwright/test";

const e2eAuthSecret = "test-e2e-auth-secret";

test("redirects unauthenticated users to login", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login(?:\?.*)?$/);
});

test("internal persona can access the internal workspace", async ({ page }) => {
  await page.goto(
    `/api/e2e-auth?persona=internal&secret=${e2eAuthSecret}&next=/dashboard`,
  );

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText("Internal workspace")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /revenue and retention in one morning view/i }),
  ).toBeVisible();
});

test("member persona is redirected away from the internal workspace", async ({
  page,
}) => {
  await page.goto(
    `/api/e2e-auth?persona=member&secret=${e2eAuthSecret}&next=/dashboard`,
  );

  await expect(page).toHaveURL(/\/member$/);
  await expect(page.getByRole("heading", { name: "Your member hub" })).toBeVisible();
});

test("unprovisioned persona lands on the provisioning page", async ({ page }) => {
  await page.goto(
    `/api/e2e-auth?persona=unprovisioned&secret=${e2eAuthSecret}&next=/dashboard`,
  );

  await expect(page).toHaveURL(/\/not-provisioned$/);
  await expect(
    page.getByRole("heading", { name: "Your account is not provisioned yet" }),
  ).toBeVisible();
});
