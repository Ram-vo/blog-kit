# blog-kit-local

Filesystem-backed local content adapter for `blog-kit`.

This package stores posts as `.mdx` files with frontmatter and stores
categories in a companion JSON file.

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
  contentDirectory: "/absolute/path/to/content/blog"
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
