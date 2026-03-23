import { test, expect } from "../../../fixtures/test.fixture";
import { SeoPage } from "../../../pages/frontend/SeoPage";
import { STAGING_URL } from "../../../utils/login";

test.describe("SEO", () => {
  let seo: SeoPage;

  // ── Homepage ─────────────────────────────────────────────────────────────

  test.describe("Homepage", () => {
    test.beforeEach(async ({ page }) => {
      seo = new SeoPage(page);
      await page.goto(STAGING_URL);
      await page.waitForLoadState("domcontentloaded");
    });

    test.describe("Title & Description", () => {
      test("page title is set and contains 99Bitcoins", async () => {
        const title = await seo.getTitle();
        expect(title).toBeTruthy();
        expect(title).toMatch(/99Bitcoins/i);
      });

      test("meta description is present and non-empty", async () => {
        const desc = await seo.getMetaDescription();
        expect(desc).not.toBeNull();
        expect(desc!.length).toBeGreaterThan(10);
      });
    });

    test.describe("Canonical & Robots", () => {
      test("canonical URL is present", async () => {
        const canonical = await seo.getCanonicalUrl();
        expect(canonical).not.toBeNull();
        expect(canonical).toMatch(/99bitcoins/i);
      });

      test("page is not set to noindex", async () => {
        const robots = await seo.getRobotsDirective();
        if (robots) {
          expect(robots.toLowerCase()).not.toContain("noindex");
        }
      });
    });

    test.describe("Open Graph", () => {
      test("og:title is set", async () => {
        const ogTitle = await seo.getOgTitle();
        expect(ogTitle).not.toBeNull();
        expect(ogTitle!.length).toBeGreaterThan(0);
      });

      test("og:description is set", async () => {
        const ogDesc = await seo.getOgDescription();
        expect(ogDesc).not.toBeNull();
        expect(ogDesc!.length).toBeGreaterThan(0);
      });

      test("og:image is set and has a URL", async () => {
        const ogImage = await seo.getOgImage();
        expect(ogImage).not.toBeNull();
        expect(ogImage).toMatch(/^https?:\/\//);
      });

      test("og:url is set", async () => {
        const ogUrl = await seo.getOgUrl();
        expect(ogUrl).not.toBeNull();
        expect(ogUrl).toMatch(/99bitcoins/i);
      });

      test("og:type is set", async () => {
        const ogType = await seo.getOgType();
        expect(ogType).not.toBeNull();
      });
    });

    test.describe("Twitter Card", () => {
      test("twitter:card is set", async () => {
        const card = await seo.getTwitterCard();
        expect(card).not.toBeNull();
      });

      test("twitter:title is set", async () => {
        const twitterTitle = await seo.getTwitterTitle();
        expect(twitterTitle).not.toBeNull();
        expect(twitterTitle!.length).toBeGreaterThan(0);
      });
    });

    test.describe("Heading hierarchy", () => {
      test("page has exactly one h1", async () => {
        const count = await seo.getH1Count();
        expect(count).toBe(1);
      });

      test("h1 text is non-empty", async () => {
        const text = await seo.getH1Text();
        expect(text?.trim().length).toBeGreaterThan(0);
      });

      test("page has h2 headings in content", async () => {
        const count = await seo.getH2Count();
        expect(count).toBeGreaterThan(0);
      });
    });

    test.describe("Structured Data", () => {
      test("at least one JSON-LD schema is present", async () => {
        const schemas = await seo.getJsonLdSchemas();
        expect(schemas.length).toBeGreaterThan(0);
      });

      test("WebSite schema is present on homepage", async () => {
        const hasWebSite = await seo.hasJsonLdType("WebSite");
        expect(hasWebSite).toBe(true);
      });
    });
  });

  // ── Article Page ─────────────────────────────────────────────────────────

  test.describe("Article Page", () => {
    test.beforeEach(async ({ page }) => {
      seo = new SeoPage(page);
      await page.goto(STAGING_URL);
      await page.waitForLoadState("domcontentloaded");
      const articleLink = page.locator(".nnbtc-news a, .nnbtc-topstories a").first();
      await articleLink.click();
      await page.waitForLoadState("domcontentloaded");
    });

    test("article page title is set and non-empty", async () => {
      const title = await seo.getTitle();
      expect(title.trim().length).toBeGreaterThan(0);
    });

    test("article has meta description", async () => {
      const desc = await seo.getMetaDescription();
      expect(desc).not.toBeNull();
      expect(desc!.length).toBeGreaterThan(10);
    });

    test("article has canonical URL", async () => {
      const canonical = await seo.getCanonicalUrl();
      expect(canonical).not.toBeNull();
    });

    test("article is not set to noindex", async () => {
      const robots = await seo.getRobotsDirective();
      if (robots) {
        expect(robots.toLowerCase()).not.toContain("noindex");
      }
    });

    test("article has exactly one h1", async () => {
      const count = await seo.getH1Count();
      expect(count).toBe(1);
    });

    test("article og:type is 'article'", async () => {
      const ogType = await seo.getOgType();
      expect(ogType?.toLowerCase()).toBe("article");
    });

    test("article has JSON-LD structured data", async () => {
      const schemas = await seo.getJsonLdSchemas();
      expect(schemas.length).toBeGreaterThan(0);
    });

    test("main content images have alt attributes", async () => {
      const withoutAlt = await seo.getImagesWithoutAltInMain();
      expect(withoutAlt).toEqual([]);
    });
  });

  // ── Hreflang ─────────────────────────────────────────────────────────────

  test.describe("Hreflang", () => {
    test.beforeEach(async ({ page }) => {
      seo = new SeoPage(page);
      await page.goto(STAGING_URL);
      await page.waitForLoadState("domcontentloaded");
    });

    test("homepage declares hreflang entries", async () => {
      const entries = await seo.getHreflangEntries();
      expect(entries.length).toBeGreaterThan(0);
    });

    test("hreflang includes x-default", async () => {
      const codes = await seo.getHreflangCodes();
      expect(codes).toContain("x-default");
    });

    test("hreflang includes en", async () => {
      const codes = await seo.getHreflangCodes();
      expect(codes).toContain("en");
    });

    test("all hreflang entries have valid href", async () => {
      const entries = await seo.getHreflangEntries();
      for (const entry of entries) {
        expect(entry.href).toMatch(/^https?:\/\//);
      }
    });

    test("German hreflang points to /de/ path", async () => {
      const entries = await seo.getHreflangEntries();
      const de = entries.find((e) => e.hreflang === "de");
      expect(de).toBeDefined();
      expect(de!.href).toMatch(/\/de\//);
    });

    test("French hreflang points to /fr/ path", async () => {
      const entries = await seo.getHreflangEntries();
      const fr = entries.find((e) => e.hreflang === "fr");
      expect(fr).toBeDefined();
      expect(fr!.href).toMatch(/\/fr\//);
    });
  });

  // ── Crawlability ─────────────────────────────────────────────────────────

  test.describe("Crawlability", () => {
    test("robots.txt returns 200", async ({ page }) => {
      const response = await page.goto(new URL("/robots.txt", STAGING_URL).toString());
      expect(response?.status()).toBe(200);
    });

    test("robots.txt contains Sitemap directive", async ({ page }) => {
      await page.goto(new URL("/robots.txt", STAGING_URL).toString());
      const body = await page.locator("body, pre").first().textContent();
      expect(body?.toLowerCase()).toMatch(/sitemap/);
    });

    test("sitemap.xml returns 200", async ({ page }) => {
      const response = await page.goto(new URL("/sitemap.xml", STAGING_URL).toString());
      expect(response?.status()).toBe(200);
    });

    test("sitemap.xml contains urlset", async ({ page }) => {
      await page.goto(new URL("/sitemap.xml", STAGING_URL).toString());
      const content = await page.content();
      expect(content).toMatch(/urlset|sitemapindex/i);
    });
  });
});
