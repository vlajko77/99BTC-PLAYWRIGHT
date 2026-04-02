import { test, expect } from "../../fixtures/test.fixture";

test.describe("WordPress Post Editing", { tag: "@admin" }, () => {
  test.beforeEach(async ({ loginPage: _ }) => {});

  test.describe("Post list", () => {
    test("posts list page loads with correct heading", async ({ editPostPage, page }) => {
      await editPostPage.navigateToPostsList();
      await expect(editPostPage.postsHeading).toBeVisible();
      await expect(page).toHaveURL(/edit\.php/);
    });

    test("posts list contains entries", async ({ editPostPage }) => {
      await editPostPage.navigateToPostsList();
      const count = await editPostPage.postListRows.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe("Post editing", () => {
    test("can edit a post title and update successfully", async ({ editPostPage, page, api }) => {
      // Arrange — create a post via API
      const originalTitle = `Edit Me ${crypto.randomUUID()}`;
      const post = await api.createPost({ title: originalTitle, content: "Original content.", status: "publish" });
      await page.goto(`/wp-admin/post.php?post=${post.id}&action=edit`);
      await page.waitForLoadState("domcontentloaded");

      // Act — change the title
      const updatedTitle = `Updated ${crypto.randomUUID()}`;
      await editPostPage.updateTitle(updatedTitle);
      await editPostPage.updatePost();

      // Assert
      await editPostPage.verifyUpdateSuccess();

      await api.deletePost(post.id);
    });
  });

  test.describe("Post status transitions", () => {
    test("newly created post appears in post list with Published status", async ({ editPostPage, api }) => {
      const title = `Status Test ${crypto.randomUUID()}`;
      const post = await api.createPost({ title, content: "Status test content.", status: "publish" });

      await editPostPage.navigateToPostsList();
      await editPostPage.verifyPostInList(title);

      await api.deletePost(post.id);
    });
  });

  test.describe("Post deletion", () => {
    test("can move a post to trash", async ({ editPostPage, page, api }) => {
      // Arrange — create a post via API
      const title = `Trash Me ${crypto.randomUUID()}`;
      const post = await api.createPost({ title, content: "This will be trashed.", status: "publish" });
      await page.goto(`/wp-admin/post.php?post=${post.id}&action=edit`);
      await page.waitForLoadState("domcontentloaded");

      // Act — trash it
      await editPostPage.trashCurrentPost();

      // Assert
      await editPostPage.verifyTrashSuccess();
    });
  });
});
