# blog-kit-next

Next.js publishing helpers for `blog-kit`.

Use this package when your app needs reusable metadata, RSS, sitemap,
canonical URL, and structured data helpers without copying publishing
logic into route files.

## Install

```bash
pnpm add blog-kit-next blog-kit-core
```

## Use It For

- Article metadata for App Router routes
- Canonical post URLs
- RSS feed generation
- Sitemap entries
- Blog and article JSON-LD structured data
- Breadcrumb structured data

This package is helper-focused. It does not ship React components.

## Main Exports

- `createPostUrl`
- `toArticleMetadata`
- `toSitemapEntry`, `toBlogSitemap`
- `toRssItem`, `toRssFeed`, `toRssFeedFromSummaries`
- `toPublisherStructuredData`
- `toBlogStructuredData`
- `toBlogPostingStructuredData`
- `toBreadcrumbStructuredData`

## Example

```ts
import {
  toArticleMetadata,
  toBlogPostingStructuredData,
  toRssFeedFromSummaries
} from "blog-kit-next";

const metadata = toArticleMetadata(post, siteConfig);
const structuredData = toBlogPostingStructuredData(post, siteConfig);
const rss = toRssFeedFromSummaries(postSummaries, siteConfig);
```

## Design Boundary

Keep domain logic in `blog-kit-core`. Use `blog-kit-next` only for
framework and publishing concerns that are specific to Next.js apps.
