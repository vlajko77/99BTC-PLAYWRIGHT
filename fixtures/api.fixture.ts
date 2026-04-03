import { test as authTest } from "./auth.fixture";
import { BASE_URL } from "../utils/config";
import { WordPressAPI } from "../utils/WordPressAPI";

type ApiFixtures = {
  api: WordPressAPI;
};

export const test = authTest.extend<ApiFixtures>({
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
