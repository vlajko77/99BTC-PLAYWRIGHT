import { test, expect } from "../../../fixtures/test.fixture";
import { EditPostPage } from "../../../pages/admin/EditPostPage";

test.describe("WordPress Post Editing", () => {
  let editPostPage: EditPostPage;

  test.beforeEach(async ({ loginPage: _, page }) => {
    editPostPage = new EditPostPage(page);
  });

  test.describe("Post list", () => {
    test("posts list page loads with correct heading", async ({ page }) => {
      await page.goto("/wp-admin/edit.php");
      await expect(page.getByRole("heading", { name: /posts/i }).first()).toBeVisible();
      await expect(page).toHaveURL(/edit\.php/);
    });

    test("posts list contains entries", async ({ page }) => {
      await page.goto("/wp-admin/edit.php");
      const rows = page.locator("#the-list tr:not(.no-items)");
      const count = await rows.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe("Post editing", () => {
    test("can edit a post title and update successfully", async ({ page }) => {
      // Arrange — create a post first so we have something stable to edit
      await editPostPage.gotoNewPost();
      const originalTitle = `Edit Me ${Date.now()}`;
      await editPostPage.fillTitleAndContent(originalTitle, "Original content.");
      await editPostPage.publish();

      // Navigate to posts list and open for edit
      await editPostPage.navigateToPostsList();
      await editPostPage.openPostForEdit(originalTitle);

      // Act — change the title
      const updatedTitle = `Updated ${Date.now()}`;
      await editPostPage.updateTitle(updatedTitle);
      await editPostPage.updatePost();

      // Assert
      await editPostPage.verifyUpdateSuccess();
    });
  });

  test.describe("Post status transitions", () => {
    test("newly created post appears in post list with Published status", async ({ page }) => {
      await editPostPage.gotoNewPost();
      const title = `Status Test ${Date.now()}`;
      await editPostPage.fillTitleAndContent(title, "Status test content.");
      await editPostPage.publish();

      await editPostPage.navigateToPostsList();
      await editPostPage.verifyPostInList(title);
    });
  });

  test.describe("Post deletion", () => {
    test("can move a post to trash", async ({ page }) => {
      // Arrange — create a post to delete
      await editPostPage.gotoNewPost();
      const title = `Trash Me ${Date.now()}`;
      await editPostPage.fillTitleAndContent(title, "This will be trashed.");
      await editPostPage.publish();

      // Open the post for edit
      await editPostPage.navigateToPostsList();
      await editPostPage.openPostForEdit(title);

      // Act — trash it
      await editPostPage.trashCurrentPost();

      // Assert
      await editPostPage.verifyTrashSuccess();
    });
  });
});
