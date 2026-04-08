import { toRssFeed } from "blog-kit-next";
import { getPublishedPosts } from "../../../src/blog-data";
import { siteConfig } from "../../../src/site-config";

export async function GET() {
  const posts = await getPublishedPosts();
  const xml = toRssFeed(posts, siteConfig);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
