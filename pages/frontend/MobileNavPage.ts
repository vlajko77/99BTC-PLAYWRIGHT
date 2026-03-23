import { Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class MobileNavPage extends BasePage {
  readonly hamburgerButton: Locator;
  readonly mobileMenu: Locator;
  readonly mobileMenuLinks: Locator;
  readonly mobileMenuClose: Locator;

  constructor(page: Page) {
    super(page);
    this.hamburgerButton = page.locator(
      "button[aria-label*='menu' i], button[class*='hamburger'], button[class*='mobile-menu'], button[class*='nav-toggle']"
    ).first();
    this.mobileMenu = page.locator(
      "[class*='mobile-menu'], [class*='mobile-nav'], nav[class*='mobile']"
    ).first();
    this.mobileMenuLinks = this.mobileMenu.getByRole("link");
    this.mobileMenuClose = page.locator(
      "button[aria-label*='close' i], button[class*='close']"
    ).first();
  }

  async navigate(): Promise<void> {
    await this.page.goto("/");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async setMobileViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 812 });
  }

  async openMobileMenu(): Promise<void> {
    await this.hamburgerButton.click();
  }

  async closeMobileMenu(): Promise<void> {
    await this.mobileMenuClose.click();
  }

  async verifyMenuOpen(): Promise<void> {
    const { expect } = await import("@playwright/test");
    await expect(this.mobileMenu).toBeVisible();
  }
}
