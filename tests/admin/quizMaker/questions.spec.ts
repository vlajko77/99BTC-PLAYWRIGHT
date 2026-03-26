import { test } from "../../../fixtures/test.fixture";

test.describe("Quiz Maker — Questions", { tag: "@admin" }, () => {
  test.beforeEach(async ({ loginPage: _, questionsPage }) => {
    await questionsPage.navigate();
  });

  test.describe("Questions list", () => {
    test("page loads with heading", async ({ questionsPage }) => {
      await questionsPage.expectPageLoaded();
    });

    test("table displays all required columns", async ({ questionsPage }) => {
      await questionsPage.expectColumnsVisible();
    });
  });

  test.describe("Create question", () => {
    const questionTitle = `Test Radio Question ${crypto.randomUUID()}`;
    const answers = ["Answer A", "Answer B", "Answer C"];

    test("creates a Radio question with answers and it appears in the list", async ({
      questionsPage,
    }) => {
      await questionsPage.createRadioQuestion(questionTitle, answers);

      await questionsPage.navigate();
      await questionsPage.expectQuestionInList(questionTitle);
    });
  });

  test.describe("Filter by type", () => {
    test("filters questions list by type Radio and shows matching results", async ({
      questionsPage,
    }) => {
      await questionsPage.filterByType("radio");

      // All visible rows should show "Radio" in the Type column
      await questionsPage.expectFilteredByType("Radio");
    });
  });
});
