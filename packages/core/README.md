# blog-kit-core

Core package for `blog-kit`.

This package contains the framework-agnostic building blocks of the
project:

- domain entities
- public blog-facing types
- repository contracts
- site configuration types
- pagination types
- pure use cases
- pure utility helpers

## Scope

Use `blog-kit-core` when you want:

- shared blog domain types
- reusable repository interfaces
- pure helpers with no runtime dependency on Next.js or Supabase

This package should remain free of provider and framework logic.

## Main Exports

- domain entities and repository contracts
- `SiteConfig`
- public blog-facing types
- `filterPostsByCategory`
- `filterPostsByTag`
- `listRelatedPosts`
- `createPaginationMeta`
- `paginateItems`
- `estimateReadingTime`
- `toBlogPostSummary`
- `toBlogPost`

## Pagination Helpers

The core package exposes pagination primitives for apps and adapters
that need a stable, framework-agnostic pagination model.

Relevant exports:

- `PaginationInput`
- `PaginationMeta`
- `PaginatedResult`
- `createPaginationMeta`
- `paginateItems`

Use `createPaginationMeta` when you already have a data slice from an
external source and only need consistent metadata.

Use `paginateItems` when you are paginating an in-memory collection in
the app or adapter layer.

Example:

```ts
import { paginateItems } from "blog-kit-core";

const paginatedPosts = paginateItems(allPosts, {
  page: 2,
  pageSize: 6
});
```

The returned object always includes:

- `items`
- `meta.page`
- `meta.pageSize`
- `meta.totalItems`
- `meta.totalPages`
- `meta.hasPreviousPage`
- `meta.hasNextPage`
- `meta.startIndex`
- `meta.endIndex`

## Intended Usage

This package is meant to be consumed by adapters and apps. It should be
the lowest-level dependency in the `blog-kit` package graph.
