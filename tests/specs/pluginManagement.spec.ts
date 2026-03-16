import { test, expect } from "../../fixtures/test.fixture";
import { PluginManagementPage } from "../../pages/PluginManagementPage";

test.describe("WordPress Plugin Management", () => {
  async function ensurePluginInstalled(
    pluginPage: PluginManagementPage,
    slug: string,
    name: string,
  ) {
    await pluginPage.navigateToPlugins();
    if (!(await pluginPage.isPluginInstalled(slug))) {
      await pluginPage.navigateToAddNewPlugin();
      await pluginPage.searchPluginRepository(name);
      await pluginPage.installPlugin(slug);
      await pluginPage.navigateToPlugins();
    }
  }

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach("screenshot", {
        body: screenshot,
        contentType: "image/png",
      });
    }
  });

  test("Navigate to plugins page and verify it loads correctly", async ({
    loginPage: _,
    pluginPage,
    page,
  }) => {
    await pluginPage.navigateToPlugins();

    await expect(page).toHaveURL(/plugins\.php/);
    await pluginPage.expectPluginsTableVisible();
    await pluginPage.expectSearchInputVisible();

    const pluginCount = await pluginPage.getPluginCount();
    expect(pluginCount).toBeGreaterThan(0);
  });

  test("Activate a deactivated plugin", async ({ loginPage: _, pluginPage }) => {
    const testPluginSlug = "classic-widgets";
    const testPluginName = "Classic Widgets";

    await ensurePluginInstalled(pluginPage, testPluginSlug, testPluginName);

    if (await pluginPage.isPluginActive(testPluginSlug)) {
      await pluginPage.deactivatePlugin(testPluginSlug);
      await pluginPage.navigateToPlugins();
    }

    await pluginPage.expectPluginInactive(testPluginSlug);
    await pluginPage.activatePlugin(testPluginSlug);
    await pluginPage.expectPluginActivatedMessage();
    await pluginPage.expectPluginActive(testPluginSlug);
  });

  test("Deactivate an active plugin", async ({ loginPage: _, pluginPage }) => {
    const testPluginSlug = "classic-widgets";
    const testPluginName = "Classic Widgets";

    await ensurePluginInstalled(pluginPage, testPluginSlug, testPluginName);

    if (!(await pluginPage.isPluginActive(testPluginSlug))) {
      await pluginPage.activatePlugin(testPluginSlug);
      await pluginPage.navigateToPlugins();
    }

    await pluginPage.expectPluginActive(testPluginSlug);
    await pluginPage.deactivatePlugin(testPluginSlug);
    await pluginPage.expectPluginDeactivatedMessage();
    await pluginPage.expectPluginInactive(testPluginSlug);
  });

  test("Install a plugin from WordPress repository", async ({
    loginPage: _,
    pluginPage,
    page,
  }) => {
    const testPluginSlug = "health-check";
    const testPluginName = "Health Check";

    await pluginPage.navigateToPlugins();

    if (await pluginPage.isPluginInstalled(testPluginSlug)) {
      await pluginPage.expectPluginInList(testPluginSlug);
      return;
    }

    await pluginPage.navigateToAddNewPlugin();
    await expect(page).toHaveURL(/plugin-install\.php/);

    await pluginPage.searchPluginRepository(testPluginName);
    await pluginPage.installPlugin(testPluginSlug);

    await pluginPage.navigateToPlugins();
    await pluginPage.expectPluginInList(testPluginSlug);
  });

  test("Delete a plugin", async ({ loginPage: _, pluginPage }) => {
    const testPluginSlug = "health-check";
    const testPluginName = "Health Check";

    await ensurePluginInstalled(pluginPage, testPluginSlug, testPluginName);

    await pluginPage.expectPluginInList(testPluginSlug);
    await pluginPage.deletePlugin(testPluginSlug);
    await pluginPage.expectPluginDeletedMessage();
    await pluginPage.expectPluginNotInList(testPluginSlug);
  });
});
