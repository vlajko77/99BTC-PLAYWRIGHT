import { Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export interface HreflangEntry {
  hreflang: string;
  href: string;
}

export interface JsonLdSchema {
  "@type"?: string;
  "@context"?: string;
  [key: string]: unknown;
}

export class SeoPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Title & Description ──────────────────────────────────────────────────

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getMetaDescription(): Promise<string | null> {
    return this.page.$eval(
      'meta[name="description"]',
      (el) => el.getAttribute("content"),
    ).catch(() => null);
  }

  // ── Canonical & Robots ───────────────────────────────────────────────────

  async getCanonicalUrl(): Promise<string | null> {
    return this.page.$eval(
      'link[rel="canonical"]',
      (el) => el.getAttribute("href"),
    ).catch(() => null);
  }

  async getRobotsDirective(): Promise<string | null> {
    return this.page.$eval(
      'meta[name="robots"]',
      (el) => el.getAttribute("content"),
    ).catch(() => null);
  }

  // ── Open Graph ───────────────────────────────────────────────────────────

  async getOgTag(property: string): Promise<string | null> {
    return this.page.$eval(
      `meta[property="${property}"]`,
      (el) => el.getAttribute("content"),
    ).catch(() => null);
  }

  async getOgTitle(): Promise<string | null> {
    return this.getOgTag("og:title");
  }

  async getOgDescription(): Promise<string | null> {
    return this.getOgTag("og:description");
  }

  async getOgImage(): Promise<string | null> {
    return this.getOgTag("og:image");
  }

  async getOgUrl(): Promise<string | null> {
    return this.getOgTag("og:url");
  }

  async getOgType(): Promise<string | null> {
    return this.getOgTag("og:type");
  }

  // ── Twitter Card ─────────────────────────────────────────────────────────

  async getTwitterTag(name: string): Promise<string | null> {
    return this.page.$eval(
      `meta[name="${name}"]`,
      (el) => el.getAttribute("content"),
    ).catch(() => null);
  }

  async getTwitterCard(): Promise<string | null> {
    return this.getTwitterTag("twitter:card");
  }

  async getTwitterTitle(): Promise<string | null> {
    return this.getTwitterTag("twitter:title");
  }

  // ── Hreflang ─────────────────────────────────────────────────────────────

  async getHreflangEntries(): Promise<HreflangEntry[]> {
    return this.page.$$eval(
      'link[rel="alternate"][hreflang]',
      (links) =>
        links.map((el) => ({
          hreflang: el.getAttribute("hreflang") ?? "",
          href: el.getAttribute("href") ?? "",
        })),
    );
  }

  async getHreflangCodes(): Promise<string[]> {
    const entries = await this.getHreflangEntries();
    return entries.map((e) => e.hreflang);
  }

  // ── Heading hierarchy ────────────────────────────────────────────────────

  async getH1Count(): Promise<number> {
    return this.page.locator("h1").count();
  }

  async getH1Text(): Promise<string | null> {
    const h1 = this.page.locator("h1").first();
    return (await h1.count()) > 0 ? h1.textContent() : null;
  }

  async getH2Count(): Promise<number> {
    return this.page.locator("h2").count();
  }

  // ── Images ───────────────────────────────────────────────────────────────

  async getImagesWithoutAlt(): Promise<string[]> {
    return this.page.$$eval("img", (imgs) =>
      imgs
        .filter((img) => !img.getAttribute("alt") || img.getAttribute("alt") === "")
        .map((img) => img.getAttribute("src") ?? "(no src)"),
    );
  }

  async getImagesWithoutAltInMain(): Promise<string[]> {
    return this.page.$$eval("main img", (imgs) =>
      imgs
        .filter((img) => !img.getAttribute("alt") || img.getAttribute("alt") === "")
        .map((img) => img.getAttribute("src") ?? "(no src)"),
    );
  }

  // ── Structured Data (JSON-LD) ────────────────────────────────────────────

  async getJsonLdSchemas(): Promise<JsonLdSchema[]> {
    const scripts = await this.page.$$eval(
      'script[type="application/ld+json"]',
      (els) => els.map((el) => el.textContent ?? ""),
    );
    return scripts
      .map((text) => {
        try {
          return JSON.parse(text) as JsonLdSchema;
        } catch {
          return null;
        }
      })
      .filter((s): s is JsonLdSchema => s !== null);
  }

  async getJsonLdTypes(): Promise<string[]> {
    const schemas = await this.getJsonLdSchemas();
    return schemas
      .map((s) => s["@type"] as string | undefined)
      .filter((t): t is string => typeof t === "string");
  }

  async hasJsonLdType(type: string): Promise<boolean> {
    const types = await this.getJsonLdTypes();
    return types.some((t) => t === type || t.includes(type));
  }
}
