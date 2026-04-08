import type { Post, SiteConfig } from "blog-kit-core";

export function toArticleMetadata(post: Post, site: SiteConfig) {
  return {
    title: post.title,
    description: post.excerpt ?? "",
    alternates: {
      canonical: `${site.siteUrl}/blog/${post.slug}`
    }
  };
}
