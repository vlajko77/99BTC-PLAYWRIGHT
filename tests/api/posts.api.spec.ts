import { test, expect } from "../../fixtures/test.fixture";
import {
  KEY_TAKEAWAYS_SHORTCODE,
  GREEN_CHECKMARKS_SHORTCODE,
  PROS_AND_CONS_SHORTCODE,
} from "../../data/shortcodes";

// ─── Authentication ───────────────────────────────────────────────────────────

test.describe("REST API — Authentication", { tag: "@smoke" }, () => {
  test("session is valid and user is an administrator", async ({ api }) => {
    const user = await api.getCurrentUser();

    expect(user.id).toBeGreaterThan(0);
    expect(user.name).toBeTruthy();
    expect(user.roles).toContain("administrator");
  });
});

// ─── Posts — read ─────────────────────────────────────────────────────────────

test.describe("REST API — Posts (read)", { tag: "@smoke" }, () => {
  test("GET /posts returns published posts with required fields", async ({ api }) => {
    const posts = await api.getPosts({ status: "publish", per_page: "5" });

    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      expect(post.id).toBeGreaterThan(0);
      expect(post.title.rendered).toBeTruthy();
      expect(post.link).toMatch(/^https?:\/\//);
      expect(post.status).toBe("publish");
    }
  });

  test("GET /posts/:id returns correct post", async ({ api }) => {
    const [firstPost] = await api.getPosts({ per_page: "1" });
    const fetched = await api.getPost(firstPost.id);

    expect(fetched.id).toBe(firstPost.id);
    expect(fetched.title.rendered).toBe(firstPost.title.rendered);
  });
});

// ─── Posts — write ────────────────────────────────────────────────────────────

// Category 1 (Uncategorized) is forbidden by theme — use a valid category.
const TEST_CATEGORY_ID = 47; // "News"

test.describe("REST API — Posts (write)", () => {
  test("POST /posts creates a post and DELETE removes it", async ({ api }) => {
    const title = `API Test Post ${Date.now()}`;

    const created = await api.createPost({ title, content: "Created via REST API", categories: [TEST_CATEGORY_ID] });
    expect(created.id).toBeGreaterThan(0);
    expect(created.title.rendered).toBe(title);
    expect(created.status).toBe("publish");

    const fetched = await api.getPost(created.id);
    expect(fetched.id).toBe(created.id);

    await api.deletePost(created.id);

    // Confirm deletion
    try {
      await api.getPost(created.id);
      throw new Error("Post still exists after deletion");
    } catch (e: any) {
      expect(e.message).toMatch(/404|failed/i);
    }
  });
});

// ─── API setup + UI assertion (shortcode rendering) ───────────────────────────

test.describe("REST API — shortcode rendering in posts", () => {
  let postId: number;

  test.afterEach(async ({ api }) => {
    if (postId) {
      await api.deletePost(postId);
      postId = 0;
    }
  });

  test("Key Takeaways shortcode created via API renders in browser", async ({
    api,
    page,
  }) => {
    const post = await api.createPost({
      title: `API Shortcode Test ${Date.now()}`,
      content: KEY_TAKEAWAYS_SHORTCODE,
      categories: [TEST_CATEGORY_ID],
    });
    postId = post.id;

    await page.goto(post.link);

    await expect(page.getByRole("heading", { name: "Key Takeaways", exact: true })).toBeVisible();
    await expect(
      page.getByText("User-friendly interfaces designed for both beginners and experienced traders"),
    ).toBeVisible();
    await expect(
      page.getByText("Wide range of cryptocurrencies available for trading"),
    ).toBeVisible();
  });

  test("Green checkmarks shortcode created via API renders in browser", async ({
    api,
    page,
  }) => {
    const post = await api.createPost({
      title: `API Checkmarks Test ${Date.now()}`,
      content: GREEN_CHECKMARKS_SHORTCODE,
      categories: [TEST_CATEGORY_ID],
    });
    postId = post.id;

    await page.goto(post.link);

    await expect(page.getByText("User-Friendly Interface")).toBeVisible();
    await expect(page.getByText("Trading Fees")).toBeVisible();
    await expect(page.getByText("Customer Support")).toBeVisible();
  });

  test("Pros and Cons shortcode created via API renders in browser", async ({
    api,
    page,
  }) => {
    const post = await api.createPost({
      title: `API Pros Cons Test ${Date.now()}`,
      content: PROS_AND_CONS_SHORTCODE,
      categories: [TEST_CATEGORY_ID],
    });
    postId = post.id;

    await page.goto(post.link);

    await expect(page.getByText("Innovative social trading features")).toBeVisible();
    await expect(page.getByText("Limited payment options")).toBeVisible();
  });
});

// ─── Pages — read ─────────────────────────────────────────────────────────────

test.describe("REST API — Pages (read)", () => {
  test("GET /pages returns published pages with required fields", async ({ api }) => {
    const pages = await api.getPages({ status: "publish", per_page: "5" });

    expect(pages.length).toBeGreaterThan(0);
    for (const page of pages) {
      expect(page.id).toBeGreaterThan(0);
      expect(page.title.rendered).toBeTruthy();
      expect(page.link).toMatch(/^https?:\/\//);
    }
  });
});

// ─── Pages — API setup + UI assertion ─────────────────────────────────────────

test.describe("REST API — shortcode rendering in pages", () => {
  let pageId: number;

  test.afterEach(async ({ api }) => {
    if (pageId) {
      await api.deletePage(pageId);
      pageId = 0;
    }
  });

  test("Key Takeaways shortcode created via API renders in a page", async ({
    api,
    page,
  }) => {
    const created = await api.createPage({
      title: `API Page Shortcode Test ${Date.now()}`,
      content: KEY_TAKEAWAYS_SHORTCODE,
    });
    pageId = created.id;

    await page.goto(created.link);

    await expect(page.getByRole("heading", { name: "Key Takeaways", exact: true })).toBeVisible();
  });
});

// ─── Plugins ──────────────────────────────────────────────────────────────────

test.describe("REST API — Plugins", () => {
  test("GET /plugins returns list with status for each plugin", async ({ api }) => {
    const plugins = await api.getPlugins();

    expect(plugins.length).toBeGreaterThan(0);
    for (const plugin of plugins) {
      expect(plugin.name).toBeTruthy();
      expect(["active", "inactive", "network-active"]).toContain(plugin.status);
    }
  });

  test("at least one plugin is active", async ({ api }) => {
    const plugins = await api.getPlugins();
    const activePlugins = plugins.filter((p) => p.status === "active");

    expect(activePlugins.length).toBeGreaterThan(0);
  });
});
