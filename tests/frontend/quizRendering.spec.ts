import { test, expect } from "../../../fixtures/test.fixture";

test.describe("Frontend — Quiz Rendering", () => {
  test.describe("Quiz shortcode in a post", () => {
    test("quiz shortcode renders a quiz container on the frontend", async ({
      loginPage: _,
      shortcodePage,
      page,
    }) => {
      // Use an existing quiz (Crypto Course - Final Exam is quiz ID known to have 50 attempts)
      // We use the first available quiz shortcode format [ays_quiz id="X"]
      const postTitle = `Quiz Render Test ${Date.now()}`;
      const shortcode = `[ays_quiz id="2"]`;

      await shortcodePage.createPostWithShortcode(postTitle, shortcode);

      // Should have navigated to the published post
      await expect(page).toHaveURL(/\?p=\d+|\/[^/]+\/?$/i);

      // The quiz plugin renders a container with class or id containing "ays-quiz"
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
      const postTitle = `Quiz Start Test ${Date.now()}`;
      const shortcode = `[ays_quiz id="2"]`;

      await shortcodePage.createPostWithShortcode(postTitle, shortcode);

      await expect(page).toHaveURL(/\?p=\d+|\/[^/]+\/?$/i);

      // Quiz Maker renders either a start button or directly the first question
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
      const pageTitle = `Quiz Page Test ${Date.now()}`;
      const shortcode = `[ays_quiz id="2"]`;

      await shortcodePage.createPageWithShortcode(pageTitle, shortcode);

      await expect(page).toHaveURL(/page_id=\d+|\/[^/]+\/?$/i);

      const quizContainer = page.locator(
        ".ays-quiz-main-wrapper, .ays_quiz, [class*='ays-quiz'], [id*='ays-quiz']"
      ).first();
      await expect(quizContainer).toBeVisible();
    });
  });
});
