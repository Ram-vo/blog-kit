import { toBlogSitemap } from "blog-kit-next";
import { getPublishedPosts } from "../src/blog-data";
import { siteConfig } from "../src/site-config";

export const dynamic = "force-static";

export default async function sitemap() {
  const posts = await getPublishedPosts();

  return [
    {
      url: siteConfig.siteUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 1
    },
    ...toBlogSitemap(posts, siteConfig)
  ];
}
