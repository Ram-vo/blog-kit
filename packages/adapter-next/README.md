# blog-kit-next

Next.js-focused helpers for `blog-kit`.

This package provides publishing utilities that are commonly needed in a
blog application built on top of `blog-kit-core`.

## Scope

Use `blog-kit-next` when you need:

- article metadata helpers
- canonical URL helpers
- sitemap helpers
- RSS feed generation
- structured data helpers for blog pages

## Main Exports

- `createPostUrl`
- `toArticleMetadata`
- `toSitemapEntry`
- `toBlogSitemap`
- `toRssItem`
- `toRssFeed`
- `toRssFeedFromSummaries`
- `toPublisherStructuredData`
- `toBlogStructuredData`
- `toBlogPostingStructuredData`
- `toBreadcrumbStructuredData`

## Notes

This package is helper-focused. It does not currently ship React
components.

It is designed to reduce app-level duplication around metadata,
structured data, and publishing outputs.
