import { test, expect } from "../../fixtures/test.fixture";
import { EditPostPage } from "../../pages/admin/EditPostPage";

test.describe("WordPress Page Editing", { tag: "@admin" }, () => {
  let editPageHelper: EditPostPage;

  test.beforeEach(async ({ loginPage: _, page }) => {
    editPageHelper = new EditPostPage(page);
  });

  test.describe("Pages list", () => {
    test("pages list loads with correct heading", async ({ page }) => {
      await page.goto("/wp-admin/edit.php?post_type=page");
      await expect(page.getByRole("heading", { name: /pages/i }).first()).toBeVisible();
      await expect(page).toHaveURL(/post_type=page/);
    });

    test("pages list contains published pages", async ({ page }) => {
      await page.goto("/wp-admin/edit.php?post_type=page");
      const rows = page.locator("#the-list tr:not(.no-items)");
      const count = await rows.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe("Page editing", () => {
    test("can edit a page and update it successfully", async ({ page }) => {
      // Arrange
      await page.goto("/wp-admin/post-new.php?post_type=page");
      const originalTitle = `Edit Page ${crypto.randomUUID()}`;
      await editPageHelper.fillTitleAndContent(originalTitle, "Original page content.");
      await editPageHelper.publish();

      // Navigate to pages list
      await editPageHelper.navigateToPagesList();
      await editPageHelper.openPostForEdit(originalTitle);

      // Act
      const updatedTitle = `Updated Page ${crypto.randomUUID()}`;
      await editPageHelper.updateTitle(updatedTitle);
      await editPageHelper.updatePost();

      // Assert
      await editPageHelper.verifyUpdateSuccess();
    });
  });

  test.describe("Page deletion", () => {
    test("can trash a page", async ({ page }) => {
      // Arrange
      await page.goto("/wp-admin/post-new.php?post_type=page");
      const title = `Trash Page ${crypto.randomUUID()}`;
      await editPageHelper.fillTitleAndContent(title, "Page to be trashed.");
      await editPageHelper.publish();

      await editPageHelper.navigateToPagesList();
      await editPageHelper.openPostForEdit(title);

      // Act
      await editPageHelper.trashCurrentPost();

      // Assert
      await editPageHelper.verifyTrashSuccess();
    });
  });
});
