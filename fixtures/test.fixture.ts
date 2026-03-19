import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { WordPressPageEditor } from "../pages/CreatePage";
import { WordPressPostEditor } from "../pages/CreatePost";
import { ShortcodePostPage } from "../pages/ShortcodePostPage";
import { KeyTakeawaysPage } from "../pages/KeyTakeawaysPage";
import { PluginManagementPage } from "../pages/PluginManagementPage";
import {
  HeaderSectionPage,
  SUPPORTED_LANGUAGES,
  LanguageConfig,
} from "../pages/regression/HeaderSectionPage";
import { HomePageSectionsPage } from "../pages/regression/HomePageSectionsPage";
import { WP_USERNAME, WP_PASSWORD } from "../utils/login";

type Fixtures = {
  screenshotOnFailure: void;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  pageEditor: WordPressPageEditor;
  postEditor: WordPressPostEditor;
  shortcodePostPage: ShortcodePostPage;
  keyTakeawaysPage: KeyTakeawaysPage;
  pluginPage: PluginManagementPage;
  header: HeaderSectionPage;
  languagePage: HeaderSectionPage;
  homePage: HomePageSectionsPage;
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
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => use(new DashboardPage(page)),
  pageEditor: async ({ page }, use) => use(new WordPressPageEditor(page)),
  postEditor: async ({ page }, use) => use(new WordPressPostEditor(page)),
  shortcodePostPage: async ({ page }, use) => use(new ShortcodePostPage(page)),
  keyTakeawaysPage: async ({ page }, use) => use(new KeyTakeawaysPage(page)),
  pluginPage: async ({ page }, use) => use(new PluginManagementPage(page)),
  header: async ({ page }, use) => use(new HeaderSectionPage(page)),
  languagePage: async ({ page }, use) => use(new HeaderSectionPage(page)),
  homePage: async ({ page }, use) => use(new HomePageSectionsPage(page)),
});

export { expect, SUPPORTED_LANGUAGES };
export type { LanguageConfig };
