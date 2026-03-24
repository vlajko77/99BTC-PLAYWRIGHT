import { APIRequestContext } from "@playwright/test";

// ─── Response types ───────────────────────────────────────────────────────────

export interface WPPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  status: string;
  link: string;
  slug: string;
}

export interface WPPage {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  status: string;
  link: string;
  slug: string;
}

export interface WPMedia {
  id: number;
  title: { rendered: string };
  source_url: string;
  media_type: string;
  slug: string;
}

export interface WPPlugin {
  plugin: string;
  name: string;
  status: "active" | "inactive" | "network-active";
}

export interface WPUser {
  id: number;
  name: string;
  slug: string;
  roles: string[];
}

// ─── API client ───────────────────────────────────────────────────────────────

export class WordPressAPI {
  constructor(
    private readonly request: APIRequestContext,
    private readonly nonce: string = "",
  ) {}

  private get authHeaders(): Record<string, string> {
    return this.nonce ? { "X-WP-Nonce": this.nonce } : {};
  }

  // ─── Auth ──────────────────────────────────────────────────────────────────

  async getCurrentUser(): Promise<WPUser> {
    const res = await this.request.get("/wp-json/wp/v2/users/me?context=edit", {
      headers: this.authHeaders,
    });
    if (!res.ok()) throw new Error(`GET /users/me failed: ${res.status()}`);
    return res.json();
  }

  // ─── Posts ─────────────────────────────────────────────────────────────────

  async getPosts(params: Record<string, string> = {}): Promise<WPPost[]> {
    const query = new URLSearchParams(params).toString();
    const res = await this.request.get(`/wp-json/wp/v2/posts${query ? `?${query}` : ""}`, {
      headers: this.authHeaders,
    });
    if (!res.ok()) throw new Error(`GET /posts failed: ${res.status()}`);
    return res.json();
  }

  async getPost(id: number): Promise<WPPost> {
    const res = await this.request.get(`/wp-json/wp/v2/posts/${id}`, {
      headers: this.authHeaders,
    });
    if (!res.ok()) throw new Error(`GET /posts/${id} failed: ${res.status()}`);
    return res.json();
  }

  async createPost(data: {
    title: string;
    content: string;
    status?: string;
    categories?: number[];
  }): Promise<WPPost> {
    const requestedStatus = data.status ?? "publish";

    const needsTwoStep = requestedStatus === "publish" && data.categories?.length;
    const createStatus = needsTwoStep ? "draft" : requestedStatus;

    const res = await this.request.post("/wp-json/wp/v2/posts", {
      headers: this.authHeaders,
      data: { ...data, status: createStatus },
    });
    if (res.status() !== 201) throw new Error(`POST /posts failed: ${res.status()}`);
    const post: WPPost = await res.json();

    if (needsTwoStep) {
      const updateRes = await this.request.post(`/wp-json/wp/v2/posts/${post.id}`, {
        headers: this.authHeaders,
        data: { status: "publish" },
      });
      if (!updateRes.ok()) throw new Error(`POST /posts/${post.id} (publish) failed: ${updateRes.status()}`);
      return updateRes.json();
    }

    return post;
  }

  async deletePost(id: number): Promise<void> {
    await this.request.delete(`/wp-json/wp/v2/posts/${id}?force=true`, {
      headers: this.authHeaders,
    });
  }

  // ─── Pages ─────────────────────────────────────────────────────────────────

  async getPages(params: Record<string, string> = {}): Promise<WPPage[]> {
    const query = new URLSearchParams(params).toString();
    const res = await this.request.get(`/wp-json/wp/v2/pages${query ? `?${query}` : ""}`);
    if (!res.ok()) throw new Error(`GET /pages failed: ${res.status()}`);
    return res.json();
  }

  async createPage(data: {
    title: string;
    content: string;
    status?: string;
  }): Promise<WPPage> {
    const res = await this.request.post("/wp-json/wp/v2/pages", {
      headers: this.authHeaders,
      data: { status: "publish", ...data },
    });
    if (res.status() !== 201) throw new Error(`POST /pages failed: ${res.status()}`);
    return res.json();
  }

  async deletePage(id: number): Promise<void> {
    await this.request.delete(`/wp-json/wp/v2/pages/${id}?force=true`, {
      headers: this.authHeaders,
    });
  }

  // ─── Media ─────────────────────────────────────────────────────────────────

  async findMedia(search: string): Promise<WPMedia[]> {
    const res = await this.request.get(
      `/wp-json/wp/v2/media?search=${encodeURIComponent(search)}&per_page=20`,
      { headers: this.authHeaders }
    );
    if (!res.ok()) throw new Error(`GET /media failed: ${res.status()}`);
    return res.json();
  }

  async deleteMedia(id: number): Promise<void> {
    await this.request.delete(`/wp-json/wp/v2/media/${id}?force=true`, {
      headers: this.authHeaders,
    });
  }

  // ─── Plugins ───────────────────────────────────────────────────────────────

  async getPlugins(): Promise<WPPlugin[]> {
    const res = await this.request.get("/wp-json/wp/v2/plugins", {
      headers: this.authHeaders,
    });
    if (!res.ok()) throw new Error(`GET /plugins failed: ${res.status()}`);
    return res.json();
  }

  async getPlugin(slug: string): Promise<WPPlugin> {
    const res = await this.request.get(`/wp-json/wp/v2/plugins/${slug}/${slug}`, {
      headers: this.authHeaders,
    });
    if (!res.ok()) throw new Error(`GET /plugins/${slug} failed: ${res.status()}`);
    return res.json();
  }
}
