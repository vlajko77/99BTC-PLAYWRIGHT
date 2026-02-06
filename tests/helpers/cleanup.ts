import { Page } from '@playwright/test';

/**
 * Helper functions for cleaning up test data after tests
 */

export type PluginState = 'active' | 'inactive';

export interface PluginStateRecord {
  slug: string;
  state: PluginState;
}

/**
 * Delete a WordPress page by its ID
 */
export async function deleteTestPage(page: Page, pageId: string | number): Promise<void> {
  const deleteUrl = `https://99bitcoins.local/wp-admin/post.php?post=${pageId}&action=trash`;
  await page.goto(deleteUrl);
  await page.waitForLoadState('networkidle');
}

/**
 * Delete a WordPress post by its ID
 */
export async function deleteTestPost(page: Page, postId: string | number): Promise<void> {
  const deleteUrl = `https://99bitcoins.local/wp-admin/post.php?post=${postId}&action=trash`;
  await page.goto(deleteUrl);
  await page.waitForLoadState('networkidle');
}

/**
 * Permanently delete a page/post from trash
 */
export async function permanentlyDelete(page: Page, postId: string | number): Promise<void> {
  const deleteUrl = `https://99bitcoins.local/wp-admin/post.php?post=${postId}&action=delete`;
  await page.goto(deleteUrl);
  await page.waitForLoadState('networkidle');
}

/**
 * Restore plugin to its original state (active or inactive)
 */
export async function restorePluginState(
  page: Page,
  pluginSlug: string,
  originalState: PluginState
): Promise<void> {
  await page.goto('https://99bitcoins.local/wp-admin/plugins.php');
  await page.waitForLoadState('networkidle');

  const pluginRow = page.locator(`tr[data-slug="${pluginSlug}"]`);
  const classAttribute = await pluginRow.getAttribute('class');
  const isCurrentlyActive = classAttribute?.includes('active') ?? false;

  if (originalState === 'active' && !isCurrentlyActive) {
    // Need to activate
    const activateLink = pluginRow.locator('a.edit[href*="action=activate"]');
    await activateLink.click();
    await page.waitForLoadState('networkidle');
  } else if (originalState === 'inactive' && isCurrentlyActive) {
    // Need to deactivate
    const deactivateLink = pluginRow.locator('a[href*="action=deactivate"]');
    await deactivateLink.click();
    await page.waitForLoadState('networkidle');
  }
}

/**
 * Get current plugin state
 */
export async function getPluginState(page: Page, pluginSlug: string): Promise<PluginState> {
  await page.goto('https://99bitcoins.local/wp-admin/plugins.php');
  await page.waitForLoadState('networkidle');

  const pluginRow = page.locator(`tr[data-slug="${pluginSlug}"]`);
  const classAttribute = await pluginRow.getAttribute('class');
  return classAttribute?.includes('active') ? 'active' : 'inactive';
}

/**
 * Batch cleanup function - delete multiple pages/posts
 */
export async function cleanupTestContent(
  page: Page,
  items: Array<{ id: string | number; type: 'page' | 'post' }>
): Promise<void> {
  for (const item of items) {
    if (item.type === 'page') {
      await deleteTestPage(page, item.id);
    } else {
      await deleteTestPost(page, item.id);
    }
  }
}

/**
 * Batch restore plugin states
 */
export async function restorePluginStates(
  page: Page,
  states: PluginStateRecord[]
): Promise<void> {
  for (const record of states) {
    await restorePluginState(page, record.slug, record.state);
  }
}

/**
 * Extract post/page ID from permalink or edit URL
 */
export function extractPostId(url: string): string | null {
  // Try to extract from URL patterns like ?p=123 or ?page_id=123 or post=123
  const patterns = [
    /[?&]p=(\d+)/,
    /[?&]page_id=(\d+)/,
    /[?&]post=(\d+)/,
    /\/(\d+)\/?$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Delete all test pages/posts matching a title pattern
 * Useful for cleaning up after test runs
 */
export async function deleteTestContentByTitlePattern(
  page: Page,
  titlePattern: string,
  contentType: 'page' | 'post' = 'page'
): Promise<number> {
  const listUrl = contentType === 'page'
    ? 'https://99bitcoins.local/wp-admin/edit.php?post_type=page'
    : 'https://99bitcoins.local/wp-admin/edit.php';

  await page.goto(listUrl);
  await page.waitForLoadState('networkidle');

  // Search for items matching the pattern
  const searchInput = page.locator('#post-search-input');
  await searchInput.fill(titlePattern);
  await page.locator('#search-submit').click();
  await page.waitForLoadState('networkidle');

  // Get all matching items
  const rows = page.locator('#the-list tr');
  const count = await rows.count();
  let deletedCount = 0;

  // Move each to trash
  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    const trashLink = row.locator('a.submitdelete');
    if (await trashLink.count() > 0) {
      await trashLink.click();
      await page.waitForLoadState('networkidle');
      deletedCount++;

      // Go back to list to continue
      await page.goto(listUrl);
      await searchInput.fill(titlePattern);
      await page.locator('#search-submit').click();
      await page.waitForLoadState('networkidle');
    }
  }

  return deletedCount;
}
