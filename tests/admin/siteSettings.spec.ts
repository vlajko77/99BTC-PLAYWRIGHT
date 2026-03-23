import { test, expect } from "../../fixtures/test.fixture";
import { SiteSettingsPage } from "../../pages/admin/SiteSettingsPage";

test.describe("WordPress Site Settings", () => {
  let settingsPage: SiteSettingsPage;

  test.beforeEach(async ({ loginPage: _, page }) => {
    settingsPage = new SiteSettingsPage(page);
  });

  test.describe("General Settings", () => {
    test.beforeEach(async () => {
      await settingsPage.navigate();
    });

    test("general settings page loads correctly", async () => {
      await settingsPage.verifyLoaded();
    });

    test("site title is set and not empty", async () => {
      await settingsPage.verifySiteTitleNotEmpty();
    });

    test("tagline is set and not empty", async () => {
      await settingsPage.verifyTaglineNotEmpty();
    });

    test("site URL is a valid URL", async () => {
      await settingsPage.verifySiteUrl();
    });
  });

  test.describe("Permalink Settings", () => {
    test.beforeEach(async () => {
      await settingsPage.navigateToPermalinks();
    });

    test("permalink settings page loads correctly", async () => {
      await settingsPage.verifyPermalinksLoaded();
    });

    test("a permalink structure is selected", async () => {
      await settingsPage.verifyPermalinkStructureSet();
    });
  });
});
