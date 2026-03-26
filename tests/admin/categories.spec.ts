import { test, expect } from "../../fixtures/test.fixture";
import { CategoriesPage } from "../../pages/admin/CategoriesPage";

test.describe("WordPress Categories", { tag: "@admin" }, () => {
  let categoriesPage: CategoriesPage;

  test.beforeEach(async ({ loginPage: _, page }) => {
    categoriesPage = new CategoriesPage(page);
    await categoriesPage.navigate();
  });

  test.describe("Categories list", () => {
    test("categories page loads correctly", async () => {
      await categoriesPage.verifyLoaded();
    });

    test("default categories exist in the list", async () => {
      await categoriesPage.verifyDefaultCategoriesExist();
    });
  });

  test.describe("Create category", () => {
    test("can create a new category and it appears in the list", async ({ page }) => {
      const categoryName = `Test Category ${crypto.randomUUID()}`;

      await categoriesPage.addCategory(categoryName);
      await categoriesPage.verifyCategoryInList(categoryName);
    });
  });

  test.describe("Delete category", () => {
    test("can delete a created category", async ({ page }) => {
      const categoryName = `Delete Me ${crypto.randomUUID()}`;

      await categoriesPage.addCategory(categoryName);
      await categoriesPage.verifyCategoryInList(categoryName);

      await categoriesPage.deleteCategory(categoryName);
      await categoriesPage.verifyCategoryNotInList(categoryName);
    });
  });
});
