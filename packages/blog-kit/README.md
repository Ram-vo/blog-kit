# @mrraymondvo/blog-kit

Scoped convenience entrypoint for `blog-kit`.

Use this package when you want the default public surface without
installing each package one by one.

## Install

```bash
pnpm add @mrraymondvo/blog-kit
```

Add optional peer/provider dependencies based on the surfaces you use:

```bash
pnpm add react react-dom
pnpm add @supabase/supabase-js
```

## Entry Points

| Entry point | Re-exports |
| --- | --- |
| `@mrraymondvo/blog-kit` | `blog-kit-core`, `blog-kit-next` |
| `@mrraymondvo/blog-kit/editor` | `blog-kit-editor` |
| `@mrraymondvo/blog-kit/local` | `blog-kit-local` |
| `@mrraymondvo/blog-kit/supabase` | `blog-kit-supabase` |

## Example

```ts
import {
  paginateItems,
  toArticleMetadata,
  toBlogPostSummary
} from "@mrraymondvo/blog-kit";

const summaries = posts.map((post) => toBlogPostSummary(post, siteConfig));
const page = paginateItems(summaries, { page: 1, pageSize: 6 });
const metadata = toArticleMetadata(post, siteConfig);
```

Supabase adapter access stays opt-in:

```ts
import { createSupabaseAdapter } from "@mrraymondvo/blog-kit/supabase";

const adapter = createSupabaseAdapter({ client });
const posts = await adapter.posts.listAllPublishedPosts();
```

## When To Use Explicit Packages

Use package-specific modules instead when you want stricter dependency
control:

- `blog-kit-core`
- `blog-kit-next`
- `blog-kit-editor`
- `blog-kit-local`
- `blog-kit-supabase`

See the full adoption guide in
[`../../docs/getting-started.md`](../../docs/getting-started.md).
