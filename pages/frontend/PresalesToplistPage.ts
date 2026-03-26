import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../BasePage";

export const PRESALES_SUBMENU_PAGES = [
  {
    name: "Crypto Presales",
    path: "/cryptocurrency/crypto-presales/",
    navText: "Crypto Presales",
  },
  {
    name: "Next 1000x Crypto",
    path: "/cryptocurrency/next-1000x-crypto/",
    navText: "Next 1000x Crypto",
  },
  {
    name: "Best Crypto to Buy",
    path: "/cryptocurrency/best-crypto-to-buy/",
    navText: "Best Crypto to Buy",
  },
  {
    name: "Best Solana Meme Coins",
    path: "/cryptocurrency/best-solana-meme-coins/",
    navText: "Best Solana Meme Coins",
  },
  {
    name: "Best Meme Coin ICOs",
    path: "/cryptocurrency/best-meme-coin-icos/",
    navText: "Best Meme Coin ICOs",
  },
  {
    name: "Next Crypto to Hit $1",
    path: "/cryptocurrency/next-crypto-to-hit-1-dollar/",
    navText: "Next Crypto to Hit $1",
  },
] as const;

export class PresalesToplistPage extends BasePage {
  readonly toplistWrapper: Locator;
  readonly offersList: Locator;
  readonly offers: Locator;
  // The parent <li> in the nav that owns the "Crypto Presales" item and its sub-menu
  private readonly presalesNavLi: Locator;

  constructor(page: Page) {
    super(page);
    this.toplistWrapper = page.locator(".cbm-presale-toplist__wrapper").first();
    this.offersList = page.locator(".cbm-presale-toplist__offers-list").first();
    this.offers = page.locator(".cbm-presale-toplist__offer");
    // Scope to the desktop nav only (mobile nav is hidden and would cause duplicate matches)
    this.presalesNavLi = page
      .locator("nav.btc-header__nav li.menu-item-has-children")
      .filter({ has: page.locator("a", { hasText: /^Crypto Presales$/ }) });
  }

  get navPresalesLink(): Locator {
    return this.presalesNavLi.locator("a", { hasText: /^Crypto Presales$/ });
  }

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState("domcontentloaded");
    // Wait for first offer to appear (toplist data loads asynchronously via CBM widget SDK)
    await this.offers.first().waitFor({ state: "visible", timeout: PresalesToplistPage.TIMEOUT_WIDGET });
  }

  async hoverNavPresales(): Promise<void> {
    await this.navPresalesLink.hover();
    // Allow CSS transition to show sub-menu
    await this.page.waitForTimeout(300);
  }

  submenuLink(text: string): Locator {
    return this.presalesNavLi.locator(".sub-menu a", { hasText: text });
  }

  async verifyToplistVisible(): Promise<void> {
    await expect(this.toplistWrapper).toBeVisible();
  }

  async getOfferCount(): Promise<number> {
    return this.offers.count();
  }

  offerTitle(offer: Locator): Locator {
    // .offer-title is an <a> tag
    return offer.locator(".cbm-presale-toplist__offer-title");
  }

  offerLogo(offer: Locator): Locator {
    return offer.locator(".cbm-presale-toplist__offer-logo img");
  }

  offerCtaButton(offer: Locator): Locator {
    // .offer-cta-button is an <a> tag
    return offer.locator(".cbm-presale-toplist__offer-cta-button");
  }

  offerPros(offer: Locator): Locator {
    return offer.locator(".cbm-presale-toplist__offer-pros");
  }

  offerPurchaseMethods(offer: Locator): Locator {
    return offer.locator(".cbm-presale-toplist__offer-purchase-methods");
  }

  async verifyOfferHasRequiredElements(offer: Locator): Promise<void> {
    await expect(this.offerTitle(offer)).toBeVisible();
    await expect(this.offerCtaButton(offer)).toBeVisible();
    await expect(this.offerLogo(offer)).toBeVisible();
  }
}
