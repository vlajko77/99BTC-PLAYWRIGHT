import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class HeaderSectionPage extends BasePage {
  readonly searchIcon: Locator;
  readonly searchInput: Locator;
  readonly bitcoinMenuLink: Locator;
  readonly bitcoinSubMenuLink: Locator;

  constructor(page: Page) {
    super(page);
  
    this.searchIcon = this.page.getByRole('img', { name: 'Search' });
    this.searchInput = this.page.locator(
      'input[type="search"], input[aria-label*="search" i], input[placeholder*="Search" i], input[name="s"], input.search-field'
    ).first();
    this.bitcoinMenuLink = this.page.locator('#menu-item-25946');
    this.bitcoinSubMenuLink = this.page.locator('li#menu-item-25946 ul.sub-menu').locator('a:has-text("Bitcoin Historical Price")');
  }

  async verifyHeaderElements() {
    await this.expectVisible(this.page.getByRole('link', { name: '99Bitcoins', exact: true }));
    await this.expectVisible(this.page.getByRole('img', { name: 'Search' }));
    await this.expectVisible(this.page.getByRole('img', { name: '99Bitcoins Languages' }));
    await this.expectVisible('.btc-header__center');
  }

  async openBitcoinCasinosMenu() {
    await this.page.getByRole('link', { name: 'Bitcoin Casinos', exact: true }).click();
    await this.bitcoinMenuLink.hover();
    await this.bitcoinSubMenuLink.waitFor({ state: 'visible', timeout: 5000 });
  }

  async clickBitcoinHistoricalPrice() {
    await this.bitcoinSubMenuLink.click();
  }

  async search(query: string) {
    await this.searchIcon.click();
    await this.searchInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }
}
