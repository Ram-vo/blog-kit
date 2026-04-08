import type { BlogPostSummary, Post, SiteConfig } from "blog-kit-core";

export interface SitemapEntry {
  url: string;
  lastModified?: string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

export interface RssItem {
  title: string;
  description: string;
  url: string;
  guid?: string;
  publishedAt?: string;
  authorName?: string;
  categories?: string[];
}

function stripTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function createPostUrl(post: Pick<Post, "slug">, site: SiteConfig): string {
  return `${stripTrailingSlash(site.siteUrl)}/blog/${post.slug}`;
}

export function toArticleMetadata(post: Post, site: SiteConfig) {
  return {
    title: post.title,
    description: post.excerpt ?? "",
    alternates: {
      canonical: createPostUrl(post, site)
    }
  };
}

export function toSitemapEntry(
  post: Pick<Post, "slug" | "updatedAt" | "publishedAt">,
  site: SiteConfig
): SitemapEntry {
  return {
    url: createPostUrl(post, site),
    lastModified: post.updatedAt ?? post.publishedAt,
    changeFrequency: "weekly",
    priority: 0.7
  };
}

export function toBlogSitemap(
  posts: Array<Pick<Post, "slug" | "updatedAt" | "publishedAt">>,
  site: SiteConfig
): SitemapEntry[] {
  return posts.map((post) => toSitemapEntry(post, site));
}

export function toRssItem(
  post: Pick<Post, "slug" | "title" | "excerpt" | "publishedAt" | "categories" | "author">,
  site: SiteConfig
): RssItem {
  return {
    title: post.title,
    description: post.excerpt ?? "",
    url: createPostUrl(post, site),
    guid: createPostUrl(post, site),
    publishedAt: post.publishedAt,
    authorName: post.author?.fullName,
    categories: post.categories.map((category) => category.name)
  };
}

export function toRssFeed(
  posts: Array<Pick<Post, "slug" | "title" | "excerpt" | "publishedAt" | "categories" | "author">>,
  site: SiteConfig
): string {
  const siteUrl = stripTrailingSlash(site.siteUrl);
  const items = posts
    .map((post) => toRssItem(post, site))
    .map((item) => {
      const categories = (item.categories ?? [])
        .map((category) => `<category>${escapeXml(category)}</category>`)
        .join("");

      const pubDate = item.publishedAt
        ? `<pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>`
        : "";

      const author = item.authorName
        ? `<author>${escapeXml(item.authorName)}</author>`
        : "";

      return [
        "<item>",
        `<title>${escapeXml(item.title)}</title>`,
        `<link>${escapeXml(item.url)}</link>`,
        `<guid>${escapeXml(item.guid ?? item.url)}</guid>`,
        `<description>${escapeXml(item.description)}</description>`,
        pubDate,
        author,
        categories,
        "</item>"
      ].join("");
    })
    .join("");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "<channel>",
    `<title>${escapeXml(site.name)}</title>`,
    `<link>${escapeXml(siteUrl)}</link>`,
    `<description>${escapeXml(site.description)}</description>`,
    items,
    "</channel>",
    "</rss>"
  ].join("");
}

export function toRssFeedFromSummaries(
  posts: BlogPostSummary[],
  site: SiteConfig
): string {
  return toRssFeed(
    posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      categories: post.categories,
      author: post.authorDetails
        ? {
            id: post.authorDetails.id,
            fullName: post.authorDetails.name,
            bio: post.authorDetails.bio,
            avatarUrl: post.authorDetails.avatar ?? undefined,
            socialLinks: {
              linkedin: post.authorDetails.linkedin ?? undefined,
              x: post.authorDetails.twitter ?? undefined,
              facebook: post.authorDetails.facebook ?? undefined,
              instagram: post.authorDetails.instagram ?? undefined,
              github: post.authorDetails.github ?? undefined
            },
            createdAt: "",
            updatedAt: ""
          }
        : undefined
    })),
    site
  );
}
