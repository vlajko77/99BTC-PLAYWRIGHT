import { test, expect } from "../../fixtures/test.fixture";
import { SUPPORTED_LANGUAGES } from "../../pages/frontend/HeaderSectionPage";

const TEST_LANGUAGE_CODES = ["de", "fr", "es", "it", "br"];
const TEST_LANGUAGES = SUPPORTED_LANGUAGES.filter((lang) =>
  TEST_LANGUAGE_CODES.includes(lang.code)
);

test.describe("Header", { tag: "@regression" }, () => {
  test.beforeEach(async ({ header }) => {
    await header.goto("/");
  });

  test.describe("Logo", { tag: "@smoke" }, () => {
    test("clicking logo navigates to home and shows site title", async ({
      page,
    }) => {
      const logo = page.getByRole("link", { name: "99Bitcoins", exact: true });
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute("href", /^(\/|https?:\/\/[^/]+\/?$)/);
      await logo.click();
      await expect(page).toHaveURL(/99bitcoins\.(com|local)\/?$/);
      await expect(page).toHaveTitle(/99Bitcoins/i);
      await expect(
        page.getByRole("heading", { name: /99Bitcoins/i }).first(),
      ).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("search returns results for bitcoin", async ({ header, page }) => {
      await expect(header.searchIcon).toBeVisible();
      await header.search("bitcoin");

      await expect(page).toHaveURL(/[?&]s=bitcoin/i);
      await expect(page.locator("main, #content, .content")).toBeVisible();
      await expect(page.getByRole("link", { name: "All Results" })).toBeVisible();
    });

    test("search with no results shows appropriate message", async ({
      header,
      page,
    }) => {
      await header.search("xyznonexistent123");

      await expect(page).toHaveURL(/[?&]s=xyznonexistent123/i);
      await expect(
        page.getByText(/no results|nothing found|not found/i),
      ).toBeVisible();
    });
  });

  test.describe("Best Wallet Button", () => {
    test("best wallet button is visible in header", async ({ header }) => {
      await expect(header.bestWalletButton).toBeVisible();
    });

    test("best wallet button has correct href", async ({ header }) => {
      await expect(header.bestWalletButton).toHaveAttribute(
        "href",
        /goto\/bestwallet/,
      );
    });

    test("clicking best wallet button navigates to best wallet page", async ({
      header,
      page,
    }) => {
      const [newPage] = await Promise.all([
        page.context().waitForEvent("page"),
        header.bestWalletButton.click(),
      ]);
      await expect(newPage).toHaveURL(/bestwallet/i);
    });
  });

  test.describe("Navigation", () => {
    test("verify header section elements are visible", async ({ header }) => {
      await header.verifyHeaderElements();
    });

    test("verify navigation menu opens submenu on hover", async ({ header }) => {
      await header.openBitcoinCasinosMenu();
      await expect(header.bitcoinSubMenuLink).toBeVisible();
    });

    test("verify submenu navigation works correctly", async ({
      header,
      page,
    }) => {
      await header.openBitcoinCasinosMenu();
      await header.clickBitcoinHistoricalPrice();
      await expect(page).toHaveURL(/historical-price/i);
      await expect(
        page.getByRole("heading", { name: "Bitcoin Historical Price &" }),
      ).toBeVisible();
    });
  });

  test.describe("Language Selector", () => {
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
      test("dropdown contains all 13 supported languages", async ({
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
        await expect(page).toHaveTitle(/99bitcoins/i);
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
        await expect(page).toHaveTitle(/99bitcoins/i);
      });

      test("switch to Spanish and verify content is translated", async ({
        languagePage,
        page,
      }) => {
        await languagePage.selectLanguage("Español");

        await expect(page).toHaveURL(/\/es\//);
        await expect(page).toHaveTitle(/99bitcoins/i);
      });

      test("switch to Japanese and verify content is translated", async ({
        languagePage,
        page,
      }) => {
        await languagePage.selectLanguage("日本語");

        await expect(page).toHaveURL(/\/jp\//);
        await expect(page).toHaveTitle(/99bitcoins/i);
      });

      test("switch to Russian and verify Cyrillic content", async ({
        languagePage,
        page,
      }) => {
        await languagePage.selectLanguage("Русский");

        await expect(page).toHaveURL(/\/ru\//);
        await expect(page).toHaveTitle(/99bitcoins/i);
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

        await page
          .getByRole("link", { name: "99Bitcoins", exact: true })
          .click();
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

    test.describe("Parameterized Language Switching", () => {
      for (const lang of TEST_LANGUAGES) {
        test(`switch to ${lang.name} (${lang.code}) and verify URL`, async ({
          languagePage,
          page,
        }) => {
          await languagePage.selectLanguage(lang.name);
          await expect(page).toHaveURL(new RegExp(lang.urlPath));
          await expect(page).toHaveTitle(/99bitcoins/i);
        });
      }
    });
  });
});
