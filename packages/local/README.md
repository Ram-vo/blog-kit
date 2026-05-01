# blog-kit-local

Filesystem-backed local content adapter for `blog-kit`.

Use this package when you want editable MDX files without running a CMS
or database. It is useful for starter apps, documentation sites, demos,
and local editorial workflows.

It can also store uploaded editor media in a local directory and return
public URLs for the host app to persist in MDX content.

## Install

```bash
pnpm add blog-kit-local blog-kit-core
```

## Content Conventions

- Posts are stored as `slug.mdx` files in a content directory.
- Post metadata is stored in frontmatter.
- Categories are stored in `_categories.json` by default.
- Draft state is represented through the `isDraft` frontmatter field.

Common frontmatter fields:

- `id`
- `title`
- `slug`
- `excerpt`
- `categoryIds`
- `tags`
- `coverImageUrl`
- `isDraft`
- `authorId`
- `publishedAt`
- `createdAt`
- `updatedAt`

## Example

```ts
import { createLocalAdapter } from "blog-kit-local";

const adapter = createLocalAdapter({
  contentDirectory: "/absolute/path/to/content/blog",
  mediaDirectory: "/absolute/path/to/public/blog-media",
  mediaBasePath: "/blog-media"
});

const draft = await adapter.editorial.createPost({
  title: "Local draft",
  slug: "local-draft",
  excerpt: "Editing local MDX content.",
  content: "# Hello world",
  categoryIds: [],
  tags: ["local", "mdx"],
  isDraft: true
});
```

## Media Uploads

```ts
const asset = await adapter.media.uploadMedia({
  fileName: "hero.png",
  contentType: "image/png",
  data: new Uint8Array(await file.arrayBuffer())
});
```

The returned `asset.url` can be inserted into MDX content or stored as a
cover image URL.

## When To Use It

Use `blog-kit-local` when you want the editor to write real files during
local development. Use `blog-kit-supabase` when you need a shared remote
backend, auth integration, and relational content storage.
