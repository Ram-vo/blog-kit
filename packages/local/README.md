# blog-kit-local

Filesystem-backed local content adapter for `blog-kit`.

This package stores posts as `.mdx` files with frontmatter and stores
categories in a companion JSON file.

It can also store uploaded editor media in a local directory and return
public URLs for the host app to persist in MDX content.

## Conventions

- posts are stored in a content directory as `slug.mdx`
- frontmatter includes editorial metadata such as `id`, `title`, `slug`,
  `excerpt`, `categoryIds`, `tags`, `coverImageUrl`, `isDraft`,
  `authorId`, `publishedAt`, `createdAt`, and `updatedAt`
- categories are stored in `_categories.json` by default

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
