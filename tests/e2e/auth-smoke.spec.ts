import { expect, test } from "@playwright/test";

test.describe("auth and dashboard smoke flow", () => {
  test("shows signup and login forms, then protects the dashboard", async ({
    page,
  }) => {
    await page.goto("/signup");

    await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();
    await expect(page.getByLabel("Business name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();

    await page.getByRole("link", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/login(\?.*)?$/);
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();

    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/login(\?.*)?$/);
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  });
});
