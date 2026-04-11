# blog-kit-supabase

Supabase adapter package for `blog-kit`.

This package contains repository implementations and mapping logic for a
Supabase-backed blog.

## Scope

Use `blog-kit-supabase` when you need:

- a post repository backed by Supabase
- author and category repositories backed by Supabase
- a typed adapter contract around the injected Supabase client
- mapping from Supabase rows into `blog-kit-core` domain types

## Main Exports

- `createSupabaseAdapter`
- `SupabasePostRepository`
- `SupabaseAuthorRepository`
- `SupabaseCategoryRepository`
- `SupabaseAdapterError`
- table row types for the current adapter contract

## Design Notes

- the adapter accepts an injected client rather than constructing one
- repository behavior is covered by fixture-based tests
- errors are classified with `SupabaseAdapterError`

## Related Docs

- `../../docs/supabase-schema.md`
- `../../docs/supabase-ops.md`

## Example

```ts
import { createSupabaseAdapter } from "blog-kit-supabase";

const adapter = createSupabaseAdapter({ client });
const posts = await adapter.posts.listAllPublishedPosts();
const post = await adapter.posts.getPostBySlug("modular-publishing");
```

Use this adapter when your content model already lives in Supabase and
you want repository behavior that maps cleanly into `blog-kit-core`
types.
