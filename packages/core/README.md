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

## Intended Usage

This package is meant to be consumed by adapters and apps. It should be
the lowest-level dependency in the `blog-kit` package graph.
