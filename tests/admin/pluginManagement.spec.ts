import { test, expect } from "../../fixtures/test.fixture";
import { CLASSIC_WIDGETS, HEALTH_CHECK } from "../../data/plugins";

test.describe("WordPress Plugin Management", { tag: "@admin" }, () => {
  test.beforeEach(async ({ loginPage: _ }) => {});

  test("Navigate to plugins page and verify it loads correctly", async ({
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

  test("Activate a deactivated plugin", async ({ pluginPage }) => {
    await pluginPage.navigateToPlugins();
    if (!(await pluginPage.isPluginInstalled(CLASSIC_WIDGETS.slug))) {
      if (!(await pluginPage.canInstallPlugins())) {
        test.skip(true, "Insufficient permissions to install plugins on this environment");
      }
      await pluginPage.navigateToAddNewPlugin();
      await pluginPage.searchPluginRepository(CLASSIC_WIDGETS.name);
      await pluginPage.installPlugin(CLASSIC_WIDGETS.slug);
      await pluginPage.navigateToPlugins();
    }

    if (await pluginPage.isPluginActive(CLASSIC_WIDGETS.slug)) {
      await pluginPage.deactivatePlugin(CLASSIC_WIDGETS.slug);
      await pluginPage.navigateToPlugins();
    }

    await pluginPage.expectPluginInactive(CLASSIC_WIDGETS.slug);
    await pluginPage.activatePlugin(CLASSIC_WIDGETS.slug);
    await pluginPage.expectPluginActivatedMessage();
    await pluginPage.expectPluginActive(CLASSIC_WIDGETS.slug);
  });

  test("Deactivate an active plugin", async ({ pluginPage }) => {
    await pluginPage.navigateToPlugins();
    if (!(await pluginPage.isPluginInstalled(CLASSIC_WIDGETS.slug))) {
      if (!(await pluginPage.canInstallPlugins())) {
        test.skip(true, "Insufficient permissions to install plugins on this environment");
      }
      await pluginPage.navigateToAddNewPlugin();
      await pluginPage.searchPluginRepository(CLASSIC_WIDGETS.name);
      await pluginPage.installPlugin(CLASSIC_WIDGETS.slug);
      await pluginPage.navigateToPlugins();
    }

    if (!(await pluginPage.isPluginActive(CLASSIC_WIDGETS.slug))) {
      await pluginPage.activatePlugin(CLASSIC_WIDGETS.slug);
      await pluginPage.navigateToPlugins();
    }

    await pluginPage.expectPluginActive(CLASSIC_WIDGETS.slug);
    await pluginPage.deactivatePlugin(CLASSIC_WIDGETS.slug);
    await pluginPage.expectPluginDeactivatedMessage();
    await pluginPage.expectPluginInactive(CLASSIC_WIDGETS.slug);
  });

  test("Install a plugin from WordPress repository", async ({
    pluginPage,
    page,
  }) => {
    await pluginPage.navigateToPlugins();

    if (await pluginPage.isPluginInstalled(HEALTH_CHECK.slug)) {
      await pluginPage.expectPluginInList(HEALTH_CHECK.slug);
      return;
    }

    if (!(await pluginPage.canInstallPlugins())) {
      test.skip(true, "Insufficient permissions to install plugins on this environment");
    }

    await pluginPage.navigateToAddNewPlugin();
    await expect(page).toHaveURL(/plugin-install\.php/);

    await pluginPage.searchPluginRepository(HEALTH_CHECK.name);
    await pluginPage.installPlugin(HEALTH_CHECK.slug);

    await pluginPage.navigateToPlugins();
    await pluginPage.expectPluginInList(HEALTH_CHECK.slug);
  });

  test("Delete a plugin", async ({ pluginPage }) => {
    await pluginPage.navigateToPlugins();
    if (!(await pluginPage.isPluginInstalled(HEALTH_CHECK.slug))) {
      if (!(await pluginPage.canInstallPlugins())) {
        test.skip(true, "Insufficient permissions to install plugins on this environment");
      }
      await pluginPage.navigateToAddNewPlugin();
      await pluginPage.searchPluginRepository(HEALTH_CHECK.name);
      await pluginPage.installPlugin(HEALTH_CHECK.slug);
      await pluginPage.navigateToPlugins();
    }

    await pluginPage.expectPluginInList(HEALTH_CHECK.slug);
    await pluginPage.deletePlugin(HEALTH_CHECK.slug);
    await pluginPage.expectPluginDeletedMessage();
    await pluginPage.expectPluginNotInList(HEALTH_CHECK.slug);
  });
});
