import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../BasePage";

export interface LanguageConfig {
  code: string;
  name: string;
  urlPath: string;
  sampleText: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: "en", name: "English", urlPath: "/", sampleText: "Bitcoin Guides" },
  {
    code: "de",
    name: "Deutsch",
    urlPath: "/de/",
    sampleText: "Bitcoin Leitfaden",
  },
  {
    code: "fr",
    name: "Français",
    urlPath: "/fr/",
    sampleText: "Guides Bitcoin",
  },
  {
    code: "es",
    name: "Español",
    urlPath: "/es/",
    sampleText: "Guías de Bitcoin",
  },
  { code: "kr", name: "한국어", urlPath: "/kr/", sampleText: "비트코인" },
  { code: "tr", name: "Türkiye", urlPath: "/tr/", sampleText: "Bitcoin" },
  { code: "jp", name: "日本語", urlPath: "/jp/", sampleText: "ビットコイン" },
  {
    code: "it",
    name: "Italiano",
    urlPath: "/it/",
    sampleText: "Guide Bitcoin",
  },
  {
    code: "br",
    name: "Português",
    urlPath: "/br/",
    sampleText: "Guias de Bitcoin",
  },
  { code: "nl", name: "Nederlands", urlPath: "/nl/", sampleText: "Bitcoin" },
  { code: "no", name: "Norsk", urlPath: "/no/", sampleText: "Bitcoin" },
  { code: "fi", name: "Suomi", urlPath: "/fi/", sampleText: "Bitcoin" },
  { code: "ru", name: "Русский", urlPath: "/ru/", sampleText: "Биткойн" },
];

export class HeaderSectionPage extends BasePage {
  readonly searchIcon: Locator;
  readonly searchInput: Locator;
  readonly bitcoinMenuLink: Locator;
  readonly bitcoinSubMenuLink: Locator;
  readonly bestWalletButton: Locator;
  readonly languageIcon: Locator;
  readonly languageDropdown: Locator;

  constructor(page: Page) {
    super(page);

    this.searchIcon = this.page.getByRole("img", { name: "Search" });
    this.searchInput = this.page
      .locator(
        'input[type="search"], input[aria-label*="search" i], input[placeholder*="Search" i], input[name="s"], input.search-field',
      )
      .first();
    this.bitcoinMenuLink = this.page.locator("#menu-item-25946");
    this.bitcoinSubMenuLink = this.page.locator("#menu-item-180726 a");
    this.bestWalletButton = this.page
      .locator("header")
      .locator('a[href*="bestwallet"]')
      .first();
    this.languageIcon = this.page.getByRole("img", {
      name: "99Bitcoins Languages",
    });
    this.languageDropdown = this.page.locator("ul.lang-dropdown");
  }

  async verifyHeaderElements() {
    await this.expectVisible(
      this.page.getByRole("link", { name: "99Bitcoins", exact: true }),
    );
    await this.expectVisible(this.page.getByRole("img", { name: "Search" }));
    await this.expectVisible(
      this.page.getByRole("img", { name: "99Bitcoins Languages" }),
    );
    await this.expectVisible(".btc-header__center");
  }

  async openBitcoinCasinosMenu() {
    await this.bitcoinMenuLink.hover();
    await this.bitcoinSubMenuLink.waitFor({ state: "visible", timeout: 5000 });
  }

  async clickBitcoinHistoricalPrice() {
    await this.bitcoinMenuLink.hover();
    await this.bitcoinSubMenuLink.waitFor({ state: "visible", timeout: 5000 });
    await this.bitcoinSubMenuLink.click();
  }

  async search(query: string) {
    await this.searchIcon.click();
    await this.searchInput.waitFor({ state: "visible", timeout: 5000 });
    await this.searchInput.fill(query);
    await this.searchInput.press("Enter");
  }

  async openLanguageDropdown(): Promise<void> {
    await this.languageIcon.click();
    await this.languageDropdown.waitFor({ state: "visible", timeout: 5000 });
  }

  async getAvailableLanguages(): Promise<string[]> {
    await this.openLanguageDropdown();
    const languageLinks = this.page.locator("a").filter({
      hasText:
        /^(English|Deutsch|Français|Español|한국어|Türkiye|日本語|Italiano|Português|Nederlands|Norsk|Suomi|Русский|العربية)$/,
    });
    return await languageLinks.allTextContents();
  }

  async selectLanguage(languageName: string): Promise<void> {
    await this.openLanguageDropdown();
    await this.languageDropdown
      .getByRole("link", { name: languageName, exact: true })
      .click();
  }

  async verifyLanguageDropdownVisible(): Promise<void> {
    await this.openLanguageDropdown();

    for (const lang of SUPPORTED_LANGUAGES.slice(0, 4)) {
      await expect(
        this.page.getByRole("link", { name: lang.name, exact: true }),
      ).toBeVisible();
    }
  }

  async verifyAllLanguagesPresent(): Promise<void> {
    await this.openLanguageDropdown();

    for (const lang of SUPPORTED_LANGUAGES) {
      await expect(
        this.page.getByRole("link", { name: lang.name, exact: true }),
        `Language ${lang.name} should be visible in dropdown`,
      ).toBeVisible();
    }
  }

  async switchToLanguageAndVerify(language: LanguageConfig): Promise<void> {
    await this.selectLanguage(language.name);

    await expect(this.page).toHaveURL(
      new RegExp(language.urlPath.replace("/", "\\/")),
    );

    await expect(this.page.getByText(language.sampleText).first()).toBeVisible({
      timeout: 10000,
    });
  }

  async verifyLanguageIconVisible(): Promise<void> {
    await expect(this.languageIcon).toBeVisible();
  }

  async getCurrentLanguageFromUrl(): Promise<string> {
    const url = this.page.url();
    for (const lang of SUPPORTED_LANGUAGES) {
      if (lang.urlPath !== "/" && url.includes(lang.urlPath)) {
        return lang.code;
      }
    }
    return "en";
  }
}
