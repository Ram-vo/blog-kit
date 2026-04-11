import { describe, expect, it } from "vitest";
import type { BlogPostSummary, Post } from "blog-kit-core";
import {
  createPostUrl,
  toArticleMetadata,
  toBlogPostingStructuredData,
  toBlogSitemap,
  toBreadcrumbStructuredData,
  toRssFeedFromSummaries
} from "./index";

const site = {
  name: "Blog Kit",
  description: "A modular blog toolkit.",
  siteUrl: "https://example.com",
  locale: "en-US",
  publisher: {
    name: "Blog Kit",
    url: "https://example.com",
    logoUrl: "/logo.png"
  },
  defaultAuthorName: "Starter Team"
} as const;

const post: Post = {
  id: "post-1",
  slug: "modular-publishing",
  title: "Modular publishing",
  excerpt: "A post about package boundaries.",
  categories: [{ id: "cat-1", name: "Architecture", slug: "architecture" }],
  tags: ["nextjs", "architecture"],
  content: "A modular system keeps product logic out of shared packages.",
  coverImageUrl: "/cover.png",
  publishedAt: "2026-04-01T10:00:00.000Z",
  isDraft: false,
  authorId: "author-1",
  author: {
    id: "author-1",
    fullName: "Ramon Valdes",
    bio: "Writes about product architecture.",
    avatarUrl: undefined,
    socialLinks: undefined,
    createdAt: "2026-04-01T10:00:00.000Z",
    updatedAt: "2026-04-01T10:00:00.000Z"
  },
  createdAt: "2026-04-01T10:00:00.000Z",
  updatedAt: "2026-04-02T10:00:00.000Z"
};

const summary: BlogPostSummary = {
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt ?? "",
  coverImage: post.coverImageUrl ?? null,
  categories: post.categories,
  tags: [...post.tags],
  author: post.author ? post.author.fullName : "Starter Team",
  publishedAt: post.publishedAt ?? "",
  isDraft: post.isDraft,
  readingTime: 1,
  authorDetails: {
    id: post.author ? post.author.id : "starter-team",
    name: post.author ? post.author.fullName : "Starter Team",
    headline: null,
    role: null,
    bio: post.author?.bio ?? "",
    avatar: null,
    twitter: null,
    linkedin: null,
    facebook: null,
    instagram: null,
    github: null
  }
};

describe("blog-kit-next helpers", () => {
  it("creates article metadata and canonical post URLs", () => {
    expect(createPostUrl(post, site)).toBe("https://example.com/blog/modular-publishing");
    expect(toArticleMetadata(post, site).alternates.canonical).toBe(
      "https://example.com/blog/modular-publishing"
    );
  });

  it("creates sitemap and RSS outputs from public blog data", () => {
    const sitemap = toBlogSitemap([post], site);
    const rss = toRssFeedFromSummaries([summary], site);

    expect(sitemap[0]?.url).toBe("https://example.com/blog/modular-publishing");
    expect(rss).toContain("<rss version=\"2.0\">");
    expect(rss).toContain("<title>Modular publishing</title>");
  });

  it("creates structured data for articles and breadcrumbs", () => {
    const article = toBlogPostingStructuredData(post, site, {
      updatedAt: post.updatedAt
    });
    const breadcrumbs = toBreadcrumbStructuredData(
      [
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path: `/blog/${post.slug}` }
      ],
      site
    );

    expect(article["@type"]).toBe("BlogPosting");
    expect(article.mainEntityOfPage).toEqual({
      "@type": "WebPage",
      "@id": "https://example.com/blog/modular-publishing"
    });
    expect(breadcrumbs["@type"]).toBe("BreadcrumbList");
  });
});
