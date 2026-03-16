import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../BasePage";

export interface LanguageConfig {
  code: string;
  name: string;
  urlPath: string;
  sampleText: string; // Text that should appear on the page to verify translation
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
  { code: "ar", name: "العربية", urlPath: "/ar/", sampleText: "بيتكوين" },
];

export class LanguageSelectorPage extends BasePage {
  readonly languageIcon: Locator;
  readonly languageDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.languageIcon = this.page.getByRole("img", {
      name: "99Bitcoins Languages",
    });
    this.languageDropdown = this.page.locator(
      '.btc-header__lang-dropdown, .language-dropdown, [class*="lang"] ul',
    );
  }

  async openLanguageDropdown(): Promise<void> {
    await this.languageIcon.click();
    // Wait for dropdown to be visible
    await this.page.waitForSelector(
      'a[href*="/de/"], a[href*="/fr/"], a[href*="/es/"]',
      {
        state: "visible",
        timeout: 5000,
      },
    );
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
    await this.page
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

    // Verify URL changed to correct language path
    await expect(this.page).toHaveURL(
      new RegExp(language.urlPath.replace("/", "\\/")),
    );

    // Verify page contains translated content
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
    return "en"; // Default to English if no language path found
  }
}
