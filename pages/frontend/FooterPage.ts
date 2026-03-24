import { Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class FooterPage extends BasePage {
  readonly footer: Locator;
  readonly footerLogo: Locator;
  readonly footerTagline: Locator;
  readonly followUsSection: Locator;
  readonly twitterLink: Locator;
  readonly facebookLink: Locator;
  readonly youtubeLink: Locator;
  readonly newsletterSection: Locator;
  readonly newsletterEmailInput: Locator;
  readonly newsletterSubmitButton: Locator;
  readonly newsletterCrashCourseCheckbox: Locator;
  readonly newsletterRecaptchaNotice: Locator;
  readonly footerNavLinks: Locator;
  readonly copyrightText: Locator;

  constructor(page: Page) {
    super(page);
    this.footer = page.locator("footer");
    this.footerLogo = this.footer.getByRole("link", { name: /99Bitcoins/i }).first();
    this.footerTagline = this.footer.locator(".footer__tagline, .site-description").first();
    this.followUsSection = this.footer.locator(".follow-us, .social-links, [class*='social']").first();
    this.twitterLink = this.footer.getByRole("link", { name: /twitter|x\.com/i });
    this.facebookLink = this.footer.getByRole("link", { name: /facebook/i });
    this.youtubeLink = this.footer.getByRole("link", { name: /youtube/i });
    this.newsletterSection = this.footer.locator("p").filter({ hasText: "Subscribe to our Newsletter" }).first();
    this.newsletterEmailInput = this.footer.getByPlaceholder("Type your email");
    this.newsletterSubmitButton = this.footer.getByRole("button", { name: "Subscribe now" });
    this.newsletterCrashCourseCheckbox = this.footer.getByRole("checkbox", { name: /sign up for bitcoin crash course/i });
    this.newsletterRecaptchaNotice = this.footer
      .locator("div, p, span")
      .filter({ hasText: /This site is protected by reCAPTCHA/ })
      .first();
    this.footerNavLinks = this.footer.getByRole("link");
    this.copyrightText = this.footer.getByText(/©|\d{4}.*99Bitcoins/i).first();
  }

  async navigate(): Promise<void> {
    await this.page.goto("/");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async scrollToFooter(): Promise<void> {
    await this.footer.scrollIntoViewIfNeeded();
  }

  async verifyFooterVisible(): Promise<void> {
    await this.scrollToFooter();
    const { expect } = await import("@playwright/test");
    await expect(this.footer).toBeVisible();
  }

  async getFooterLinkCount(): Promise<number> {
    return this.footerNavLinks.count();
  }
}
