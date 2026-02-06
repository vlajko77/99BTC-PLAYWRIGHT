import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  private readonly dashboardUrl = 'https://99bitcoins.local/wp-admin/';

  // Admin bar elements
  private readonly adminBar: Locator;
  private readonly mySitesLink: Locator;
  private readonly newContentButton: Locator;
  private readonly userGreeting: Locator;

  // Screen Options & Help
  private readonly screenOptionsButton: Locator;
  private readonly helpButton: Locator;

  // Dashboard widgets
  private readonly quickDraftWidget: Locator;
  private readonly atAGlanceWidget: Locator;
  private readonly activityWidget: Locator;
  private readonly siteHealthWidget: Locator;
  private readonly quizMakerWidget: Locator;
  // Quick Draft form elements
  private readonly quickDraftTitle: Locator;
  private readonly quickDraftContent: Locator;
  private readonly quickDraftSaveButton: Locator;

  constructor(page: Page) {
    super(page);

    // Admin bar
    this.adminBar = page.locator('#wpadminbar');
    this.mySitesLink = page.locator('#wp-admin-bar-my-sites');
    this.newContentButton = page.locator('#wp-admin-bar-new-content');
    this.userGreeting = page.locator('#wp-admin-bar-my-account');

    // Screen Options & Help
    this.screenOptionsButton = page.locator('#screen-options-link-wrap button, #show-settings-link');
    this.helpButton = page.locator('#contextual-help-link-wrap button, #contextual-help-link');

    // Widgets
    this.quickDraftWidget = page.locator('#dashboard_quick_press');
    this.atAGlanceWidget = page.locator('#dashboard_right_now');
    this.activityWidget = page.locator('#dashboard_activity');
    this.siteHealthWidget = page.locator('#dashboard_site_health');
    this.quizMakerWidget = page.locator('#quiz-maker');
    // Quick Draft form
    this.quickDraftTitle = page.locator('#dashboard_quick_press input[name="post_title"]');
    this.quickDraftContent = page.locator('#dashboard_quick_press textarea[name="content"]');
    this.quickDraftSaveButton = page.locator('#dashboard_quick_press #save-post');
  }

  // Navigation
  async navigateToDashboard(): Promise<void> {
    await this.page.goto(this.dashboardUrl);
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Verification methods
  async verifyDashboardLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/wp-admin\/?$/);
    const heading = this.page.locator('h1').filter({ hasText: 'Dashboard' }).first();
    await expect(heading).toBeVisible();
  }

  async verifyAdminBar(): Promise<void> {
    await expect(this.adminBar).toBeVisible();
    await expect(this.mySitesLink).toBeVisible();
    await expect(this.newContentButton).toBeVisible();
    await expect(this.userGreeting).toBeVisible();
  }

  async verifyScreenOptionsAndHelp(): Promise<void> {
    await expect(this.screenOptionsButton).toBeVisible();
    await expect(this.helpButton).toBeVisible();
  }

  async verifySidebarMenu(): Promise<void> {
    const menuItems = [
      'Dashboard',
      'Posts',
      'Media',
      'Pages',
      'Comments',
      'Appearance',
      'Plugins',
      'Users',
      'Tools',
      'Settings',
    ];

    for (const item of menuItems) {
      const menuLink = this.page.locator('#adminmenu .wp-menu-name').filter({ hasText: item }).first();
      await expect(menuLink).toBeVisible();
    }
  }

  async verifyQuickDraftWidget(): Promise<void> {
    await expect(this.quickDraftWidget).toBeVisible();
    await expect(this.quickDraftTitle).toBeVisible();
    await expect(this.quickDraftContent).toBeVisible();
    await expect(this.quickDraftSaveButton).toBeVisible();
  }

  async verifyAtAGlanceWidget(): Promise<void> {
    await expect(this.atAGlanceWidget).toBeVisible();
    // Check for posts and pages counts
    const postsLink = this.atAGlanceWidget.locator('a[href*="edit.php"]').filter({ hasText: /Post/ }).first();
    const pagesLink = this.atAGlanceWidget.locator('a[href*="edit.php"]').filter({ hasText: /Page/ }).first();
    await expect(postsLink).toBeVisible();
    await expect(pagesLink).toBeVisible();
    // WordPress version - check general text
    const widgetText = await this.atAGlanceWidget.textContent();
    expect(widgetText).toMatch(/WordPress/);
  }

  async verifyQuizMakerWidget(): Promise<void> {
    await expect(this.quizMakerWidget).toBeVisible();
    const widgetText = await this.quizMakerWidget.textContent();
    expect(widgetText).toMatch(/Quiz|Quizzes/i);
  }

  async verifySiteHealthWidget(): Promise<void> {
    await expect(this.siteHealthWidget).toBeVisible();
  }

  async verifyActivityWidget(): Promise<void> {
    await expect(this.activityWidget).toBeVisible();
    const widgetText = await this.activityWidget.textContent();
    // Should have either "Recently Published" or "Publishing Soon"
    const hasPublishing = /Recently Published|Publishing Soon/i.test(widgetText || '');
    expect(hasPublishing).toBeTruthy();
  }

  async verifyRecentComments(): Promise<void> {
    // Recent Comments are inside the Activity widget
    const recentComments = this.activityWidget.locator('h3').filter({ hasText: 'Recent Comments' });
    await expect(recentComments).toBeVisible();
  }

  // Quick Draft actions
  async createQuickDraft(title: string, content: string): Promise<void> {
    await this.quickDraftTitle.fill(title);
    await this.quickDraftContent.fill(content);
    await this.quickDraftSaveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Data extraction
  async getPostCount(): Promise<number> {
    const postsLink = this.atAGlanceWidget.locator('a[href*="edit.php"]').filter({ hasText: /Post/ }).first();
    const text = await postsLink.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async getPageCount(): Promise<number> {
    const pagesLink = this.atAGlanceWidget.locator('a[href*="edit.php"]').filter({ hasText: /Page/ }).first();
    const text = await pagesLink.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
}
