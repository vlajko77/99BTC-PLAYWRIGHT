import { test, expect } from "../../fixtures/test.fixture";

test.describe("WordPress Admin Dashboard", () => {
  test.beforeEach(async ({ loginPage: _, dashboardPage }) => {
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
    test("should load dashboard and display heading", async ({
      dashboardPage,
    }) => {
      await dashboardPage.verifyDashboardLoaded();
    });
  });

  test.describe("Admin Bar", () => {
    test("should display admin bar with key elements", async ({
      dashboardPage,
    }) => {
      await dashboardPage.verifyAdminBar();
      await dashboardPage.verifyScreenOptionsAndHelp();
    });
  });

  test.describe("Sidebar Menu", () => {
    test("should display all main sidebar menu items", async ({
      dashboardPage,
    }) => {
      await dashboardPage.verifySidebarMenu();
    });
  });

  test.describe("Quick Draft Widget", () => {
    test("should display Quick Draft widget with form elements", async ({
      dashboardPage,
    }) => {
      await dashboardPage.verifyQuickDraftWidget();
    });

    test("should save a quick draft successfully", async ({ dashboardPage }) => {
      const timestamp = Date.now();
      const title = `Test Draft ${timestamp}`;
      const content = `Draft content for testing ${timestamp}`;

      await dashboardPage.createQuickDraft(title, content);
      await dashboardPage.verifyRecentDrafts(title);
    });
  });

  test.describe("At a Glance Widget", () => {
    test("should display content statistics", async ({ dashboardPage }) => {
      await dashboardPage.verifyAtAGlanceWidget();

      const postCount = await dashboardPage.getPostCount();
      expect(postCount).toBeGreaterThan(0);

      const pageCount = await dashboardPage.getPageCount();
      expect(pageCount).toBeGreaterThan(0);
    });
  });

  test.describe("Quiz Maker Status Widget", () => {
    test("should display quiz statistics", async ({ dashboardPage }) => {
      await dashboardPage.verifyQuizMakerWidget();
    });
  });

  test.describe("Activity Widget", () => {
    test("should display recent activity", async ({ dashboardPage }) => {
      await dashboardPage.verifyActivityWidget();
    });

    test("should display recent comments", async ({ dashboardPage }) => {
      await dashboardPage.verifyRecentComments();
    });
  });

  test.describe("Site Health Widget", () => {
    test("should display site health status", async ({ dashboardPage }) => {
      await dashboardPage.verifySiteHealthWidget();
    });
  });
});
