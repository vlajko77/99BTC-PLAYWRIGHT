import { test, expect } from "../../fixtures/test.fixture";
import { STAGING_URL } from "../../utils/login";

test.describe("Search Results", () => {
  test("search returns results for bitcoin", async ({ header, page }) => {
    await header.goto(STAGING_URL);
    await header.search("bitcoin");

    await expect(page).toHaveURL(/[?&]s=bitcoin/i);
    await expect(page.getByText(/you searched for/i)).toBeVisible();
  });

  test("search results page has a content area", async ({ header, page }) => {
    await header.goto(STAGING_URL);
    await header.search("bitcoin");

    await expect(page).toHaveURL(/[?&]s=bitcoin/i);
    await expect(page.locator("main")).toBeVisible();
  });

  test("search with no results shows appropriate message", async ({
    header,
    page,
  }) => {
    await header.goto(STAGING_URL);
    await header.search("xyznonexistent99btcabc");

    await expect(page).toHaveURL(/s=xyznonexistent99btcabc/i);
    await expect(
      page.getByText(/no results|nothing found|not found/i)
    ).toBeVisible();
  });

  test("search results contain article cards", async ({ header, page }) => {
    await header.goto(STAGING_URL);
    await header.search("bitcoin");

    await expect(page).toHaveURL(/[?&]s=bitcoin/i);
    await page.waitForLoadState("networkidle");
    const cards = page.locator(".nnbtc-card, main a[href*='/']");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });
});
