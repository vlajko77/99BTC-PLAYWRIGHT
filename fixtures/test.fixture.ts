import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { WordPressPageEditor } from "../pages/CreatePage";
import { WordPressPostEditor } from "../pages/CreatePost";
import { KeyTakeawaysPage } from "../pages/KeyTakeawaysPage";
import { PluginManagementPage } from "../pages/PluginManagementPage";
import {
  HeaderSectionPage,
  SUPPORTED_LANGUAGES,
  LanguageConfig,
} from "../pages/regression/HeaderSectionPage";
import { WP_USERNAME, WP_PASSWORD } from "../utils/login";

type Fixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  pageEditor: WordPressPageEditor;
  postEditor: WordPressPostEditor;
  keyTakeawaysPage: KeyTakeawaysPage;
  pluginPage: PluginManagementPage;
  header: HeaderSectionPage;
  languagePage: HeaderSectionPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => use(new DashboardPage(page)),
  pageEditor: async ({ page }, use) => use(new WordPressPageEditor(page)),
  postEditor: async ({ page }, use) => use(new WordPressPostEditor(page)),
  keyTakeawaysPage: async ({ page }, use) => use(new KeyTakeawaysPage(page)),
  pluginPage: async ({ page }, use) => use(new PluginManagementPage(page)),
  header: async ({ page }, use) => use(new HeaderSectionPage(page)),
  languagePage: async ({ page }, use) => use(new HeaderSectionPage(page)),
});

export { expect, SUPPORTED_LANGUAGES };
export type { LanguageConfig };
