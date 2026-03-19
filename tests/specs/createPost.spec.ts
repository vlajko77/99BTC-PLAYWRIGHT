import { test, expect } from "../../fixtures/test.fixture";

test.describe("WordPress post creation", () => {
  test("Add a new post to 99bitcoins", async ({
    loginPage: _,
    postEditor,
    page,
  }) => {
    await postEditor.gotoNewPost();

    await expect(page).toHaveURL(/post-new\.php/);

    const randomTitle = "Test Post " + Math.floor(Math.random() * 100000);
    const randomContent =
      "This post is added by Playwright. Random value: " + Math.random();

    await postEditor.fillTitleAndContent(randomTitle, randomContent);
    await postEditor.selectCategory("News");
    await postEditor.publish();

    const permalink = await postEditor.getPermalink();
    expect(permalink).toBeTruthy();

    await postEditor.openPermalink(permalink!);

    await expect(page).toHaveURL(/test-post|p=/i);

    await postEditor.expectContentVisible(randomTitle);
    await postEditor.expectContentVisible(randomContent);

    await expect(
      page.getByRole("link", { name: "News" }).first(),
    ).toBeVisible();
  });
});
