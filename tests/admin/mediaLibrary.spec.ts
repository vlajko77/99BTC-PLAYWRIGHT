import { test } from "../../fixtures/test.fixture";
import { MediaLibraryPage } from "../../pages/admin/MediaLibraryPage";
import path from "path";
import fs from "fs";
import os from "os";

test.describe("WordPress Media Library", { tag: "@admin" }, () => {
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

  test.describe("File Upload", () => {
    let uploadName: string;
    let tempPath: string;

    test.beforeEach(async () => {
      // Use a unique filename each run to avoid filesystem collisions with leftover files
      uploadName = `test-upload-${Date.now()}.png`;
      tempPath = path.join(os.tmpdir(), uploadName);
      fs.copyFileSync(
        path.resolve(__dirname, "../../fixtures/files/test-upload.png"),
        tempPath
      );
    });

    test.afterEach(async ({ api }) => {
      fs.rmSync(tempPath, { force: true });
      const uploaded = await api.findMedia(uploadName.replace(".png", ""));
      for (const item of uploaded) {
        await api.deleteMedia(item.id);
      }
    });

    test("can upload a PNG and it appears in the upload area", async ({ api: _ }) => {
      // Act
      await mediaPage.navigateToAddNew();
      await mediaPage.uploadFile(tempPath);

      // Assert — plupload shows the filename once the server confirms the upload
      await mediaPage.verifyUploadSuccess(uploadName);
    });
  });
});
