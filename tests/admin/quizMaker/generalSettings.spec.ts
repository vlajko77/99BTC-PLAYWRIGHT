import { test, expect } from "../../../fixtures/test.fixture";

test.describe("Quiz Maker — General Settings", { tag: "@admin" }, () => {
  test.beforeEach(async ({ loginPage: _, generalSettingsPage }) => {
    await generalSettingsPage.navigate();
  });

  test("page loads with General Settings heading", async ({ generalSettingsPage }) => {
    await generalSettingsPage.expectPageLoaded();
  });

  test("all settings sidebar tabs are visible", async ({ generalSettingsPage }) => {
    await generalSettingsPage.expectAllTabsVisible();
  });

  test("Save changes button is visible", async ({ generalSettingsPage }) => {
    await generalSettingsPage.expectSaveButtonVisible();
  });

  test("clicking Save changes persists settings and shows success notice", async ({
    generalSettingsPage,
  }) => {
    await generalSettingsPage.saveSettings();
    await generalSettingsPage.expectSaveSuccess();
  });

  test.describe("Settings tabs navigation", () => {
    const tabs = [
      "Integrations",
      "Shortcodes",
      "Extra shortcodes",
      "Message variables",
      "Text Customizations",
    ];

    for (const tab of tabs) {
      test(`navigates to ${tab} tab`, async ({ generalSettingsPage, page }) => {
        await generalSettingsPage.clickTab(tab);
        // Each tab should keep the settings form visible
        await expect(
          page.locator("form").first()
        ).toBeVisible();
      });
    }
  });
});
