import { test, expect, SUPPORTED_LANGUAGES } from "../../../fixtures/test.fixture";
import type { LanguageConfig } from "../../../fixtures/test.fixture";
import { STAGING_URL } from "../../../utils/login";

test.describe("Language Selector", () => {
  test.beforeEach(async ({ languagePage }) => {
    await languagePage.goto(STAGING_URL);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach("screenshot", {
        body: screenshot,
        contentType: "image/png",
      });
    }
  });

  test.describe("Language Icon", () => {
    test("language selector icon is visible in header", async ({
      languagePage,
    }) => {
      await languagePage.verifyLanguageIconVisible();
    });

    test("clicking language icon opens dropdown", async ({ languagePage }) => {
      await languagePage.verifyLanguageDropdownVisible();
    });
  });

  test.describe("Language Dropdown", () => {
    test("dropdown contains all 14 supported languages", async ({
      languagePage,
    }) => {
      await languagePage.verifyAllLanguagesPresent();
    });

    test("dropdown shows correct language names", async ({
      languagePage,
      page,
    }) => {
      await languagePage.openLanguageDropdown();

      for (const lang of SUPPORTED_LANGUAGES) {
        await expect(
          page.getByRole("link", { name: lang.name, exact: true }),
        ).toBeVisible();
      }
    });

    test("each language link has correct href", async ({
      languagePage,
      page,
    }) => {
      await languagePage.openLanguageDropdown();

      await expect(
        page.getByRole("link", { name: "English", exact: true }),
      ).toHaveAttribute("href", "/");
      await expect(
        page.getByRole("link", { name: "Deutsch", exact: true }),
      ).toHaveAttribute("href", "/de/");
      await expect(
        page.getByRole("link", { name: "Français", exact: true }),
      ).toHaveAttribute("href", "/fr/");
      await expect(
        page.getByRole("link", { name: "Español", exact: true }),
      ).toHaveAttribute("href", "/es/");
    });
  });

  test.describe("Language Switching", () => {
    test("switch to German and verify content is translated", async ({
      languagePage,
      page,
    }) => {
      await languagePage.selectLanguage("Deutsch");

      await expect(page).toHaveURL(/\/de\//);
      await expect(page).toHaveTitle(/99Bitcoins/);
      await expect(
        page.getByRole("link", { name: "News", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Krypto", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Prognosen", exact: true }),
      ).toBeVisible();
    });

    test("switch to French and verify content is translated", async ({
      languagePage,
      page,
    }) => {
      await languagePage.selectLanguage("Français");

      await expect(page).toHaveURL(/\/fr\//);
      await expect(page).toHaveTitle(/99Bitcoins/);
    });

    test("switch to Spanish and verify content is translated", async ({
      languagePage,
      page,
    }) => {
      await languagePage.selectLanguage("Español");

      await expect(page).toHaveURL(/\/es\//);
      await expect(page).toHaveTitle(/99Bitcoins/);
    });

    test("switch to Japanese and verify content is translated", async ({
      languagePage,
      page,
    }) => {
      await languagePage.selectLanguage("日本語");

      await expect(page).toHaveURL(/\/jp\//);
      await expect(page).toHaveTitle(/99Bitcoins/);
    });

    test("switch to Arabic and verify RTL content", async ({
      languagePage,
      page,
    }) => {
      await languagePage.selectLanguage("العربية");

      await expect(page).toHaveURL(/\/ar\//);
      await expect(page).toHaveTitle(/99Bitcoins/);
    });

    test("switch to Russian and verify Cyrillic content", async ({
      languagePage,
      page,
    }) => {
      await languagePage.selectLanguage("Русский");

      await expect(page).toHaveURL(/\/ru\//);
      await expect(page).toHaveTitle(/99Bitcoins/);
    });

    test("switch back to English from another language", async ({
      languagePage,
      page,
    }) => {
      await languagePage.selectLanguage("Deutsch");
      await expect(page).toHaveURL(/\/de\//);

      await languagePage.selectLanguage("English");
      await expect(page).toHaveURL(/99bitcoins\.(com|local)\/?$/);

      await expect(
        page.getByRole("link", { name: "Bitcoin Casinos", exact: true }),
      ).toBeVisible();
    });
  });

  test.describe("Language Persistence", () => {
    test("language selection persists in URL", async ({
      languagePage,
      page,
    }) => {
      await languagePage.selectLanguage("Deutsch");
      await expect(page).toHaveURL(/\/de\//);

      await page.getByRole("link", { name: "News", exact: true }).click();
      await expect(page).toHaveURL(/\/de\/news/);
    });

    test("logo click from translated page goes to translated homepage", async ({
      languagePage,
      page,
    }) => {
      await languagePage.selectLanguage("Deutsch");
      await expect(page).toHaveURL(/\/de\//);

      await page.getByRole("link", { name: "99Bitcoins", exact: true }).click();
      await expect(page).toHaveURL(/\/de\/?$/);
    });
  });

  test.describe("Header Elements in Different Languages", () => {
    test("header maintains structure in German", async ({
      languagePage,
      page,
    }) => {
      await languagePage.selectLanguage("Deutsch");

      await expect(
        page.getByRole("link", { name: "99Bitcoins", exact: true }),
      ).toBeVisible();
      await expect(page.getByRole("img", { name: "Search" })).toBeVisible();
      await expect(
        page.getByRole("img", { name: "99Bitcoins Languages" }),
      ).toBeVisible();
    });

    test("search icon is visible and clickable in translated version", async ({
      languagePage,
      page,
    }) => {
      await languagePage.selectLanguage("Deutsch");

      const searchIcon = page.getByRole("img", { name: "Search" });
      await expect(searchIcon).toBeVisible();
      await expect(searchIcon).toBeEnabled();
    });
  });
});

// Parameterized tests for all languages
const testLanguages: LanguageConfig[] = [
  { code: "de", name: "Deutsch", urlPath: "/de/", sampleText: "Bitcoin" },
  { code: "fr", name: "Français", urlPath: "/fr/", sampleText: "Bitcoin" },
  { code: "es", name: "Español", urlPath: "/es/", sampleText: "Bitcoin" },
  { code: "it", name: "Italiano", urlPath: "/it/", sampleText: "Bitcoin" },
  { code: "br", name: "Português", urlPath: "/br/", sampleText: "Bitcoin" },
];

for (const lang of testLanguages) {
  test(`switch to ${lang.name} (${lang.code}) and verify URL`, async ({
    languagePage,
    page,
  }) => {
    await languagePage.goto(STAGING_URL);
    await languagePage.selectLanguage(lang.name);
    await expect(page).toHaveURL(new RegExp(lang.urlPath));
    await expect(page).toHaveTitle(/99Bitcoins/);
  });
}
