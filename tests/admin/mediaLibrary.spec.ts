import { test, expect } from "../../../fixtures/test.fixture";
import { MediaLibraryPage } from "../../../pages/admin/MediaLibraryPage";

test.describe("WordPress Media Library", () => {
  let mediaPage: MediaLibraryPage;

  test.beforeEach(async ({ loginPage: _, page }) => {
    mediaPage = new MediaLibraryPage(page);
    await mediaPage.navigate();
  });

  test.describe("Media Library page", () => {
    test("media library page loads correctly", async () => {
      await mediaPage.verifyLoaded();
    });

    test("media library contains existing media items", async () => {
      await mediaPage.verifyMediaItemsExist();
    });
  });

  test.describe("Add New Media", () => {
    test("add new media page loads correctly", async () => {
      await mediaPage.navigateToAddNew();
      await mediaPage.verifyAddNewPageLoaded();
    });

    test("file upload input is present on add new page", async () => {
      await mediaPage.navigateToAddNew();
      await mediaPage.verifyFileInputPresent();
    });
  });
});
