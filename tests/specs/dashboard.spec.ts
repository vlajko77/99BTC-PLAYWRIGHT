import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/loginPage";
import { DashboardPage } from "../../pages/DashboardPage";
import { WP_USERNAME, WP_PASSWORD } from "../../utils/login";

test.describe("WordPress Admin Dashboard", () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.loginWithSession(WP_USERNAME, WP_PASSWORD);
    await dashboardPage.navigateToDashboard();
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

  test.describe("Dashboard Load", () => {
    test("should load dashboard and display heading", async () => {
      await dashboardPage.verifyDashboardLoaded();
    });
  });

  test.describe("Admin Bar", () => {
    test("should display admin bar with key elements", async () => {
      await dashboardPage.verifyAdminBar();
      await dashboardPage.verifyScreenOptionsAndHelp();
    });
  });

  test.describe("Sidebar Menu", () => {
    test("should display all main sidebar menu items", async () => {
      await dashboardPage.verifySidebarMenu();
    });
  });

  test.describe("Quick Draft Widget", () => {
    test("should display Quick Draft widget with form elements", async () => {
      await dashboardPage.verifyQuickDraftWidget();
    });

    test("should save a quick draft successfully", async ({ page }) => {
      const timestamp = Date.now();
      const title = `Test Draft ${timestamp}`;
      const content = `Draft content for testing ${timestamp}`;

      await dashboardPage.createQuickDraft(title, content);

      // After saving, the page reloads and the draft should appear in Recent Drafts
      const recentDrafts = page.locator("#dashboard_quick_press .drafts");
      await expect(recentDrafts).toBeVisible();
      await expect(recentDrafts.getByText(title)).toBeVisible();
    });
  });

  test.describe("At a Glance Widget", () => {
    test("should display content statistics", async () => {
      await dashboardPage.verifyAtAGlanceWidget();

      const postCount = await dashboardPage.getPostCount();
      expect(postCount).toBeGreaterThan(0);

      const pageCount = await dashboardPage.getPageCount();
      expect(pageCount).toBeGreaterThan(0);
    });
  });

  test.describe("Quiz Maker Status Widget", () => {
    test("should display quiz statistics", async ({ page }) => {
      await dashboardPage.verifyQuizMakerWidget();

      // Verify the widget shows quiz-related statistics
      const widget = page.locator("#quiz-maker");
      const widgetText = await widget.textContent();
      expect(widgetText).toMatch(/Quiz|Question|Result/i);
    });
  });

  test.describe("Activity Widget", () => {
    test("should display recent activity", async () => {
      await dashboardPage.verifyActivityWidget();
    });

    test("should display recent comments", async () => {
      await dashboardPage.verifyRecentComments();
    });
  });

  test.describe("Site Health Widget", () => {
    test("should display site health status", async () => {
      await dashboardPage.verifySiteHealthWidget();
    });
  });
});
