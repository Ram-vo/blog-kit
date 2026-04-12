# blog-kit

Convenience metapackage for `blog-kit`.

This package is for teams that want a simpler install surface without
managing the package split themselves.

## Scope

Use `blog-kit` when you want:

- core domain helpers from `blog-kit-core`
- publishing helpers from `blog-kit-next`
- an optional Supabase subpath when you need adapter access

## Entry Points

- `blog-kit`
  Re-exports `blog-kit-core` and `blog-kit-next`

- `blog-kit/supabase`
  Re-exports `blog-kit-supabase`

## Example

```ts
import { paginateItems, toArticleMetadata } from "blog-kit";
import { createSupabaseAdapter } from "blog-kit/supabase";

const page = paginateItems(posts, { page: 1, pageSize: 6 });
const metadata = toArticleMetadata(post, siteConfig);
const adapter = createSupabaseAdapter({ client });
```

Use the metapackage when you want a more ergonomic default entrypoint.
Use the package-specific modules when you want explicit control over
dependencies and import boundaries.

For install paths and adoption examples, see
[`../../docs/getting-started.md`](../../docs/getting-started.md).
