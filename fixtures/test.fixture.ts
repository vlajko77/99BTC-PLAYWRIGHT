import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/admin/LoginPage";
import { DashboardPage } from "../pages/admin/DashboardPage";
import { WordPressPageEditor } from "../pages/admin/CreatePage";
import { WordPressPostEditor } from "../pages/admin/CreatePost";
import { ShortcodePage } from "../pages/frontend/ShortcodePage";
import { PluginManagementPage } from "../pages/admin/PluginManagementPage";
import { HeaderSectionPage } from "../pages/frontend/HeaderSectionPage";
import { HomePageSectionsPage } from "../pages/frontend/HomePageSectionsPage";
import { WP_USERNAME, WP_PASSWORD } from "../utils/login";
import { BASE_URL } from "../utils/config";
import { WordPressAPI } from "../utils/WordPressAPI";
import { QuizzesPage } from "../pages/admin/quizMaker/QuizzesPage";
import { QuestionsPage } from "../pages/admin/quizMaker/QuestionsPage";
import { QuizCategoriesPage } from "../pages/admin/quizMaker/QuizCategoriesPage";
import { ResultsPage } from "../pages/admin/quizMaker/ResultsPage";
import { GeneralSettingsPage } from "../pages/admin/quizMaker/GeneralSettingsPage";
import { EditPostPage } from "../pages/admin/EditPostPage";
import { MediaLibraryPage } from "../pages/admin/MediaLibraryPage";
import { CategoriesPage } from "../pages/admin/CategoriesPage";
import { SiteSettingsPage } from "../pages/admin/SiteSettingsPage";
import { FooterPage } from "../pages/frontend/FooterPage";
import { ArticlePage } from "../pages/frontend/ArticlePage";
import { SearchPage } from "../pages/frontend/SearchPage";
import { CategoryPage } from "../pages/frontend/CategoryPage";
import { MobileNavPage } from "../pages/frontend/MobileNavPage";

type Fixtures = {
  screenshotOnFailure: void;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  pageEditor: WordPressPageEditor;
  postEditor: WordPressPostEditor;
  shortcodePage: ShortcodePage;
  pluginPage: PluginManagementPage;
  header: HeaderSectionPage;
  homePage: HomePageSectionsPage;
  api: WordPressAPI;
  quizzesPage: QuizzesPage;
  questionsPage: QuestionsPage;
  quizCategoriesPage: QuizCategoriesPage;
  resultsPage: ResultsPage;
  generalSettingsPage: GeneralSettingsPage;
  editPostPage: EditPostPage;
  mediaLibraryPage: MediaLibraryPage;
  categoriesPage: CategoriesPage;
  siteSettingsPage: SiteSettingsPage;
  footerPage: FooterPage;
  articlePage: ArticlePage;
  searchPage: SearchPage;
  categoryPage: CategoryPage;
  mobileNavPage: MobileNavPage;
};

export const test = base.extend<Fixtures>({
  screenshotOnFailure: [
    async ({ page }, use, testInfo) => {
      await use();
      if (testInfo.status !== testInfo.expectedStatus) {
        const screenshot = await page.screenshot({ fullPage: true });
        await testInfo.attach("screenshot", {
          body: screenshot,
          contentType: "image/png",
        });
      }
    },
    { auto: true },
  ],
  // Destructure as `loginPage: _` in tests that only need the side-effect (session auth) but not the page object itself.
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => use(new DashboardPage(page)),
  pageEditor: async ({ page }, use) => use(new WordPressPageEditor(page)),
  postEditor: async ({ page }, use) => use(new WordPressPostEditor(page)),
  shortcodePage: async ({ page }, use) => use(new ShortcodePage(page)),
  pluginPage: async ({ page }, use) => use(new PluginManagementPage(page)),
  header: async ({ page }, use) => use(new HeaderSectionPage(page)),
  homePage: async ({ page }, use) => use(new HomePageSectionsPage(page)),
  quizzesPage: async ({ page }, use) => use(new QuizzesPage(page)),
  questionsPage: async ({ page }, use) => use(new QuestionsPage(page)),
  quizCategoriesPage: async ({ page }, use) => use(new QuizCategoriesPage(page)),
  resultsPage: async ({ page }, use) => use(new ResultsPage(page)),
  generalSettingsPage: async ({ page }, use) => use(new GeneralSettingsPage(page)),
  editPostPage: async ({ page }, use) => use(new EditPostPage(page)),
  mediaLibraryPage: async ({ page }, use) => use(new MediaLibraryPage(page)),
  categoriesPage: async ({ page }, use) => use(new CategoriesPage(page)),
  siteSettingsPage: async ({ page }, use) => use(new SiteSettingsPage(page)),
  footerPage: async ({ page }, use) => use(new FooterPage(page)),
  articlePage: async ({ page }, use) => use(new ArticlePage(page)),
  searchPage: async ({ page }, use) => use(new SearchPage(page)),
  categoryPage: async ({ page }, use) => use(new CategoryPage(page)),
  mobileNavPage: async ({ page }, use) => use(new MobileNavPage(page)),
  api: async ({ page, playwright, loginPage: _ }, use) => {
    await page.goto("/wp-admin/");
    await page.waitForLoadState("networkidle");
    const nonce = await page.evaluate(
      () => (window as any).wpApiSettings?.nonce ?? "",
    );
    if (!nonce) throw new Error("Could not obtain WP REST API nonce from wp-admin — is the user logged in?");
    const storageState = await page.context().storageState();
    const apiContext = await playwright.request.newContext({
      baseURL: BASE_URL,
      ignoreHTTPSErrors: true,
      storageState,
      extraHTTPHeaders: { "X-WP-Nonce": nonce },
    });
    await use(new WordPressAPI(apiContext, nonce));
    await apiContext.dispose();
  },
});

export { expect };
