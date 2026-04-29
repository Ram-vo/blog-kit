# blog-kit-core

Framework-agnostic domain package for `blog-kit`.

`blog-kit-core` contains the shared vocabulary of the system: posts,
authors, categories, repository contracts, editorial types, pagination,
and pure transformation helpers.

## Install

```bash
pnpm add blog-kit-core
```

## Use It For

- Shared blog domain types
- Public blog-facing types
- Repository and editorial contracts
- Pagination helpers
- Pure filtering and relationship helpers
- Transforming domain posts into public summaries

This package does not depend on React, Next.js, Supabase, or any
provider SDK.

## Main Exports

- `Post`, `Author`, `Category`
- `SiteConfig`
- `PostRepository`, `EditorialRepository`
- `EditorSession`, `EditorPermission`
- `EditorialValidationIssue`, `validateEditorialPostInput`
- `filterPostsByCategory`, `filterPostsByTag`
- `listRelatedPosts`
- `createPaginationMeta`, `paginateItems`
- `estimateReadingTime`
- `toBlogPostSummary`, `toBlogPost`

## Example

```ts
import {
  filterPostsByTag,
  paginateItems,
  toBlogPostSummary
} from "blog-kit-core";

const summaries = posts.map((post) => toBlogPostSummary(post, siteConfig));
const taggedPosts = filterPostsByTag(posts, "nextjs");
const page = paginateItems(summaries, { page: 1, pageSize: 6 });
```

## Editorial Validation

Use `validateEditorialPostInput` before persisting drafts or publishing
posts from a host app:

```ts
import { validateEditorialPostInput } from "blog-kit-core";

const issues = validateEditorialPostInput(post, "publish");
const blockingIssues = issues.filter((issue) => issue.severity === "error");
```

Draft validation checks the fields required for safe persistence.
Publish validation adds stricter content checks for excerpts, body
content, and categories.

## Design Boundary

Use this package as the lowest-level dependency in your blog stack.

Keep app routes, provider clients, framework helpers, and visual
components outside the core. Those belong in host apps or adapter
packages.
