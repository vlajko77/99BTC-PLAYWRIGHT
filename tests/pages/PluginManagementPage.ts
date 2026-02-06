import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PluginManagementPage extends BasePage {
  // URLs
  private readonly pluginsUrl = 'https://99bitcoins.local/wp-admin/plugins.php';
  private readonly addNewPluginUrl = 'https://99bitcoins.local/wp-admin/plugin-install.php';

  // Selectors - Plugins List Page
  private readonly pluginsTable: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly pluginCountDisplay: Locator;
  private readonly noticeMessage: Locator;

  // Selectors - Add New Plugin Page
  private readonly searchPluginsInput: Locator;

  constructor(page: Page) {
    super(page);

    // Plugins list page selectors
    this.pluginsTable = page.locator('#the-list');
    this.searchInput = page.locator('#plugin-search-input');
    this.searchButton = page.locator('#search-submit');
    this.pluginCountDisplay = page.locator('.displaying-num');
    this.noticeMessage = page.locator('.notice, #message');

    // Add new plugin page selectors
    this.searchPluginsInput = page.locator('#search-plugins');
  }

  // Navigation methods
  async navigateToPlugins(): Promise<void> {
    await this.page.goto(this.pluginsUrl);
    await this.pluginsTable.waitFor({ state: 'visible', timeout: 10000 });
  }

  async navigateToAddNewPlugin(): Promise<void> {
    await this.page.goto(this.addNewPluginUrl);
    await this.searchPluginsInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  // Search methods
  async searchInstalledPlugin(pluginName: string): Promise<void> {
    await this.searchInput.fill(pluginName);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchPluginRepository(pluginName: string): Promise<void> {
    await this.searchPluginsInput.fill(pluginName);
    await this.searchPluginsInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
    // Wait for search results to load
    await this.page.waitForSelector('.plugin-card, .no-plugin-results', { timeout: 15000 });
  }

  // Plugin row helpers
  private getPluginRow(pluginSlug: string): Locator {
    return this.page.locator(`tr[data-slug="${pluginSlug}"]`);
  }

  private getPluginRowByName(pluginName: string): Locator {
    return this.page.locator(`#the-list tr`).filter({ hasText: pluginName }).first();
  }

  // Status check methods
  async isPluginActive(pluginSlug: string): Promise<boolean> {
    const row = this.getPluginRow(pluginSlug);
    const classAttribute = await row.getAttribute('class');
    return classAttribute?.includes('active') ?? false;
  }

  async isPluginInstalled(pluginSlug: string): Promise<boolean> {
    const row = this.getPluginRow(pluginSlug);
    return await row.count() > 0;
  }

  // Activate plugin
  async activatePlugin(pluginSlug: string): Promise<void> {
    const row = this.getPluginRow(pluginSlug);
    // Hover to show row actions
    await row.hover();
    // WordPress uses different selectors - try multiple patterns
    const activateLink = row.locator('a[href*="action=activate"]').first();
    await activateLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async activatePluginByName(pluginName: string): Promise<void> {
    const row = this.getPluginRowByName(pluginName);
    await row.hover();
    const activateLink = row.locator('a[href*="action=activate"]').first();
    await activateLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Deactivate plugin
  async deactivatePlugin(pluginSlug: string): Promise<void> {
    const row = this.getPluginRow(pluginSlug);
    // Hover to show row actions
    await row.hover();
    const deactivateLink = row.locator('a[href*="action=deactivate"]').first();
    await deactivateLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async deactivatePluginByName(pluginName: string): Promise<void> {
    const row = this.getPluginRowByName(pluginName);
    await row.hover();
    const deactivateLink = row.locator('a[href*="action=deactivate"]').first();
    await deactivateLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Install plugin from repository
  async installPlugin(pluginSlug: string): Promise<void> {
    const pluginCard = this.page.locator(`.plugin-card-${pluginSlug}`);
    const installButton = pluginCard.locator('a.install-now');
    await installButton.click();

    // Wait for installation to complete (button changes to "Activate")
    await pluginCard.locator('a.activate-now').waitFor({ state: 'visible', timeout: 30000 });
  }

  async installPluginByName(pluginName: string): Promise<void> {
    const pluginCard = this.page.locator('.plugin-card').filter({ hasText: pluginName }).first();
    const installButton = pluginCard.locator('a.install-now');
    await installButton.click();

    // Wait for installation to complete
    await pluginCard.locator('a.activate-now').waitFor({ state: 'visible', timeout: 30000 });
  }

  // Activate plugin after installation (from Add New page)
  async activateInstalledPlugin(pluginSlug: string): Promise<void> {
    const pluginCard = this.page.locator(`.plugin-card-${pluginSlug}`);
    const activateButton = pluginCard.locator('a.activate-now');
    await activateButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Delete plugin
  async deletePlugin(pluginSlug: string): Promise<void> {
    const row = this.getPluginRow(pluginSlug);

    // Plugin must be deactivated before deletion
    const isActive = await this.isPluginActive(pluginSlug);
    if (isActive) {
      await this.deactivatePlugin(pluginSlug);
      // Re-navigate to get fresh state after deactivation
      await this.navigateToPlugins();
    }

    // Hover to show row actions
    await row.hover();
    const deleteLink = row.locator('a[href*="action=delete-selected"], .delete a, span.delete a').first();
    await deleteLink.click();

    // Handle confirmation dialog - WordPress shows a confirmation page
    const confirmButton = this.page.locator('input#submit, input[type="submit"]').first();
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }

    await this.page.waitForLoadState('networkidle');
  }

  async deletePluginByName(pluginName: string): Promise<void> {
    const row = this.getPluginRowByName(pluginName);
    await row.hover();
    const deleteLink = row.locator('a[href*="action=delete-selected"], .delete a, span.delete a').first();
    await deleteLink.click();

    // Handle confirmation
    const confirmButton = this.page.locator('input#submit, input[type="submit"]').first();
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }

    await this.page.waitForLoadState('networkidle');
  }

  // Verification methods
  async expectPluginActivatedMessage(): Promise<void> {
    const successMessage = this.page.locator('#message.updated, .notice-success, .notice.is-dismissible.updated').first();
    await expect(successMessage).toContainText(/plugin activated/i);
  }

  async expectPluginDeactivatedMessage(): Promise<void> {
    const successMessage = this.page.locator('#message.updated, .notice-success, .notice.is-dismissible.updated').first();
    await expect(successMessage).toContainText(/plugin deactivated/i);
  }

  async expectPluginDeletedMessage(): Promise<void> {
    const successMessage = this.page.locator('#message.updated, .notice-success, .notice.is-dismissible.updated').first();
    await expect(successMessage).toContainText(/deleted/i);
  }

  async expectPluginInList(pluginSlug: string): Promise<void> {
    const row = this.getPluginRow(pluginSlug);
    await expect(row).toBeVisible();
  }

  async expectPluginNotInList(pluginSlug: string): Promise<void> {
    const row = this.getPluginRow(pluginSlug);
    await expect(row).not.toBeVisible();
  }

  async expectPluginActive(pluginSlug: string): Promise<void> {
    const row = this.getPluginRow(pluginSlug);
    await expect(row).toHaveClass(/active/);
  }

  async expectPluginInactive(pluginSlug: string): Promise<void> {
    const row = this.getPluginRow(pluginSlug);
    await expect(row).not.toHaveClass(/active/);
  }

  async expectPluginsTableVisible(): Promise<void> {
    await expect(this.pluginsTable).toBeVisible();
  }

  async expectSearchInputVisible(): Promise<void> {
    await expect(this.searchInput).toBeVisible();
  }

  async expectPluginCountVisible(): Promise<void> {
    await expect(this.pluginCountDisplay).toBeVisible();
  }

  // Get plugin count
  async getPluginCount(): Promise<number> {
    const countText = await this.pluginCountDisplay.textContent();
    const match = countText?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
}
