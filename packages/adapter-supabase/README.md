# blog-kit-supabase

Supabase adapter package for `blog-kit`.

This package contains repository implementations and mapping logic for a
Supabase-backed blog.

## Scope

Use `blog-kit-supabase` when you need:

- a post repository backed by Supabase
- an editorial repository backed by Supabase
- author and category repositories backed by Supabase
- a typed adapter contract around the injected Supabase client
- mapping from Supabase rows into `blog-kit-core` domain types
- media uploads through Supabase Storage

## Main Exports

- `createSupabaseAdapter`
- `SupabasePostRepository`
- `SupabaseEditorialRepository`
- `SupabaseAuthorRepository`
- `SupabaseCategoryRepository`
- `SupabaseMediaRepository`
- `SupabaseAdapterError`
- `resolveSupabaseEditorSession`
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
const drafts = await adapter.editorial.listPosts();
```

Use this adapter when your content model already lives in Supabase and
you want repository behavior that maps cleanly into `blog-kit-core`
types.

## Auth Helper Example

```ts
import { resolveSupabaseEditorSession } from "blog-kit-supabase";

const session = await resolveSupabaseEditorSession({ client });
```

This helper is optional. Teams with custom auth stacks can ignore it and
map their own auth model into `EditorSession`.

## Media Upload Example

```ts
const adapter = createSupabaseAdapter({
  client,
  mediaBucket: "blog-media"
});

const asset = await adapter.media.uploadMedia({
  fileName: "hero.png",
  contentType: "image/png",
  data: new Uint8Array(await file.arrayBuffer())
});
```

The adapter uploads to Supabase Storage and returns the public URL from
the configured bucket. If you use private buckets, proxy assets or
return signed URLs from your host app instead.
