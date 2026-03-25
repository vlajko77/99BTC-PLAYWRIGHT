import { test, expect } from "../../fixtures/test.fixture";

test.describe("Utility Bar", { tag: "@regression" }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto("/");
  });

  test("utility bar section is visible", async ({ page }) => {
    const utilityBar = page.locator("section.nnbtc-utility-bar");
    await utilityBar.scrollIntoViewIfNeeded();
    await expect(utilityBar).toBeVisible();
  });

  test("Follow Us social links are present", async ({ page }) => {
    const utilityBar = page.locator("section.nnbtc-utility-bar");
    await utilityBar.scrollIntoViewIfNeeded();
    const links = utilityBar.getByRole("link");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test("YouTube link is present in utility bar", async ({ page }) => {
    const utilityBar = page.locator("section.nnbtc-utility-bar");
    await utilityBar.scrollIntoViewIfNeeded();
    const youtubeLink = utilityBar.getByRole("link", { name: /youtube/i });
    await expect(youtubeLink).toBeVisible();
  });

  test("newsletter section is visible in utility bar", async ({ page }) => {
    const utilityBar = page.locator("section.nnbtc-utility-bar");
    await utilityBar.scrollIntoViewIfNeeded();
    const utilityText = await utilityBar.textContent();
    expect(utilityText?.toLowerCase()).toMatch(/newsletter|subscribe|email/);
  });
});
