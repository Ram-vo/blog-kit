# blog-kit-supabase

Supabase adapter package for `blog-kit`.

Use this package when your posts, authors, categories, and editorial
state live in Supabase but you still want to keep the rest of the app
working against `blog-kit-core` contracts.

## Install

```bash
pnpm add blog-kit-supabase blog-kit-core @supabase/supabase-js
```

## Use It For

- a post repository backed by Supabase
- an editorial repository backed by Supabase
- author and category repositories backed by Supabase
- a typed adapter contract around the injected Supabase client
- mapping from Supabase rows into `blog-kit-core` domain types
- media uploads through Supabase Storage
- Public post reads backed by Supabase
- Editorial create, update, publish, and delete operations
- Author and category repositories
- Mapping Supabase rows into `blog-kit-core` domain types
- Optional Supabase Auth to `EditorSession` resolution

## Main Exports

- `createSupabaseAdapter`
- `SupabasePostRepository`
- `SupabaseEditorialRepository`
- `SupabaseAuthorRepository`
- `SupabaseCategoryRepository`
- `SupabaseMediaRepository`
- `SupabaseAdapterError`
- `resolveSupabaseEditorSession`
- Table row types for the current adapter contract

## Example

```ts
import { createClient } from "@supabase/supabase-js";
import { createSupabaseAdapter } from "blog-kit-supabase";

const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
const adapter = createSupabaseAdapter({ client });

const posts = await adapter.posts.listAllPublishedPosts();
const post = await adapter.posts.getPostBySlug("modular-publishing");
const drafts = await adapter.editorial.listPosts();
```

## Auth Helper

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

This helper is optional. Apps with custom auth can ignore it and map
their own user model into the generic `EditorSession` contract.

## Schema

The adapter expects these tables:

- `posts`
- `authors`
- `categories`
- `post_categories`

Required relationship shape:

- `posts.author_id -> authors.id`
- many-to-many between `posts` and `categories`

Public routes should only expose posts where `is_draft = false`.

For SQL and operational notes, see:

- [`../../docs/supabase-schema.md`](../../docs/supabase-schema.md)
- [`../../docs/supabase-ops.md`](../../docs/supabase-ops.md)
