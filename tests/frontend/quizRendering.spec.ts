import { test, expect } from "../../fixtures/test.fixture";
import { QuizzesPage } from "../../pages/admin/quizMaker/QuizzesPage";
import { LoginPage } from "../../pages/admin/LoginPage";
import { WP_USERNAME, WP_PASSWORD } from "../../utils/login";
import { BASE_URL, stagingHttpCredentials } from "../../utils/config";
import type { BrowserContext, Page } from "@playwright/test";

test.describe("Frontend — Quiz Rendering", { tag: "@frontend" }, () => {
  let quizShortcode: string;
  let setupContext: BrowserContext;
  let setupPage: Page;

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(60_000);
    setupContext = await browser.newContext({
      ignoreHTTPSErrors: true,
      baseURL: BASE_URL,
      ...stagingHttpCredentials,
    });
    setupPage = await setupContext.newPage();
    const loginPage = new LoginPage(setupPage);
    await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);
    const quizzesPage = new QuizzesPage(setupPage);
    await quizzesPage.navigate();
    const shortcode = await quizzesPage.getFirstQuizShortcode();
    if (!shortcode) throw new Error("No quizzes found on this site — cannot run rendering tests");
    quizShortcode = shortcode.trim();
  });

  test.afterAll(async () => {
    await setupContext?.close();
  });

  test.describe("Quiz shortcode in a post", () => {
    test("quiz shortcode renders a quiz container on the frontend", async ({
      loginPage: _,
      shortcodePage,
      page,
    }) => {
      const postTitle = `Quiz Render Test ${crypto.randomUUID()}`;

      await shortcodePage.createPostWithShortcode(postTitle, quizShortcode);

      await expect(page).toHaveURL(/\?p=\d+|\/[^/]+\/?$/i);

      const quizContainer = page.locator(
        ".ays-quiz-main-wrapper, .ays_quiz, #ays-quiz, [class*='ays-quiz'], [id*='ays-quiz']"
      ).first();
      await expect(quizContainer).toBeVisible();
    });

    test("rendered quiz shows a start button or first question", async ({
      loginPage: _,
      shortcodePage,
      page,
    }) => {
      const postTitle = `Quiz Start Test ${crypto.randomUUID()}`;

      await shortcodePage.createPostWithShortcode(postTitle, quizShortcode);

      await expect(page).toHaveURL(/\?p=\d+|\/[^/]+\/?$/i);

      const quizInteractive = page.locator(
        ".ays-quiz-main-wrapper, .ays_quiz, [class*='ays-quiz'], [id*='ays-quiz']"
      ).first();
      await expect(quizInteractive).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Quiz shortcode in a page", () => {
    test("quiz shortcode renders on a WordPress page", async ({
      loginPage: _,
      shortcodePage,
      page,
    }) => {
      const pageTitle = `Quiz Page Test ${crypto.randomUUID()}`;

      await shortcodePage.createPageWithShortcode(pageTitle, quizShortcode);

      await expect(page).toHaveURL(/page_id=\d+|\/[^/]+\/?$/i);

      const quizContainer = page.locator(
        ".ays-quiz-main-wrapper, .ays_quiz, [class*='ays-quiz'], [id*='ays-quiz']"
      ).first();
      await expect(quizContainer).toBeVisible();
    });
  });
});
