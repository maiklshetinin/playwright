import { expect, test } from "@playwright/test"

test("Login OIB 1", async ({ page }) => {
  await page.goto("http://172.20.255.251:8080/authWeb/")
  const icon = page.locator("img.logo")
  expect(icon).toBeVisible
})