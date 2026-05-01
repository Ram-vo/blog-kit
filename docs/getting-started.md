# Getting Started

This guide shows the shortest path to adopt `blog-kit` depending on how
much control you need.

## Option 1: Use The Metapackage

Use the metapackage when you want the simplest install surface.

Install:

```bash
pnpm add @mrraymondvo/blog-kit
```

Use it for:

- blog-facing domain helpers
- pagination and transformations
- metadata and publishing helpers for Next.js apps
- optional editor, local, and Supabase subpaths

Example:

```ts
import {
  paginateItems,
  toBlogPostSummary,
  toArticleMetadata,
  toRssFeedFromSummaries
} from "@mrraymondvo/blog-kit";

const summaries = posts.map((post) => toBlogPostSummary(post, siteConfig));
const page = paginateItems(summaries, { page: 1, pageSize: 6 });
const metadata = toArticleMetadata(post, siteConfig);
const rss = toRssFeedFromSummaries(summaries, siteConfig);
```

## Option 2: Add The Supabase Adapter

Use the Supabase subpath only when your content model already lives in
Supabase.

Install:

```bash
pnpm add @mrraymondvo/blog-kit @supabase/supabase-js
```

Example:

```ts
import { createClient } from "@supabase/supabase-js";
import { createSupabaseAdapter } from "@mrraymondvo/blog-kit/supabase";

const client = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const adapter = createSupabaseAdapter({ client });
const posts = await adapter.posts.listAllPublishedPosts();
```

The Supabase adapter also exposes `adapter.media.uploadMedia(...)` when
the injected client includes Supabase Storage. Configure a Storage
bucket, then pass `mediaBucket` if you do not use the default
`blog-media` bucket:

```ts
const adapter = createSupabaseAdapter({
  client,
  mediaBucket: "blog-media"
});
```

## Option 3: Add The Editor

Use the editor package when you want a reusable MDX editing surface but
you want your app to own auth, routing, and persistence.

Install:

```bash
pnpm add @mrraymondvo/blog-kit react react-dom
```

Example:

```tsx
"use client";

import "@mdxeditor/editor/style.css";
import { BlogPostEditor } from "@mrraymondvo/blog-kit/editor";

export function PostEditor({ post, categories, onChange, onSaveDraft }) {
  return (
    <BlogPostEditor
      value={post}
      categories={categories}
      onChange={onChange}
      onSaveDraft={onSaveDraft}
    />
  );
}
```

Persistence remains a host-app concern. Use
`@mrraymondvo/blog-kit/local` for local MDX files or
`@mrraymondvo/blog-kit/supabase` for Supabase-backed writes.

Pass validation issues and save state from the host app so the same
editor can work with local files, Supabase, or another backend:

```tsx
<BlogPostEditor
  value={post}
  categories={categories}
  saveStatus={saveStatus}
  validationIssues={validationIssues}
  onChange={setPost}
  onSaveDraft={saveDraft}
  onPublish={publishPost}
  onUploadImage={uploadImage}
/>
```

## Option 4: Use Package-Specific Modules

Use the package-specific modules when you want more explicit dependency
control.

Install:

```bash
pnpm add blog-kit-core blog-kit-next
```

Or:

```bash
pnpm add blog-kit-core blog-kit-next blog-kit-supabase @supabase/supabase-js
```

Use the package-specific modules when:

- you want to keep adapter dependencies out of the default app install
- you want explicit imports in a larger monorepo
- you want tighter control over the package boundary in your app layer

## Option 5: Start From The Reference App

Use the starter when you want:

- a runnable reference implementation
- a GitHub Pages demo
- a base to integrate with an existing design system
- local and Supabase-backed editor image uploads
- working examples of local and Supabase-backed editing

Local runtime:

```bash
pnpm install
pnpm --dir apps/starter dev
```

Static demo export:

```bash
pnpm --dir apps/starter build:static
```

For starter deployment details, see
[`docs/starter-deploy.md`](./starter-deploy.md).

### Protecting The Starter Editor

The starter editor is open by default so local demos are easy to run.
Enable the built-in token guard when you want a private preview:

```bash
STARTER_EDITOR_AUTH_MODE=token
STARTER_EDITOR_ACCESS_TOKEN=replace-with-a-secret-token
```

Token mode protects `/editor/*` and `/api/editor/*`. Browser users log
in at `/editor/login`; API clients can send:

```bash
Authorization: Bearer replace-with-a-secret-token
```

For production apps, replace the starter guard with your own auth or map
Supabase Auth into the `EditorSession` contract exposed by
`blog-kit-core`.

### Editorial Media

The editor accepts an `onUploadImage` handler. The starter wires that
handler to:

- `blog-kit-local` for filesystem-backed media in local mode
- `blog-kit-supabase` for Supabase Storage uploads in Supabase mode

Public URLs are stored in post content or metadata. Private asset
workflows should proxy media or return signed URLs from the host app.

## Choosing Between The Metapackage And Explicit Packages

Use `@mrraymondvo/blog-kit` when:

- you want the fastest onboarding path
- you are fine with the default convenience surface
- your app uses Next.js publishing helpers and may later add Supabase

Use explicit packages when:

- you want strict dependency boundaries
- you do not want Next.js helpers in the default import surface
- you want to make adapter usage opt-in at install time

## Published Package Notes

The scoped package is the public metapackage:

```bash
pnpm add @mrraymondvo/blog-kit
```

The unscoped `blog-kit` package is not part of the supported public
install path. npm rejected that name as too similar to an existing
package, so consumers should use the scoped metapackage or the explicit
package-specific modules.

For maintainers, publish troubleshooting lives in
[`docs/publishing.md`](./publishing.md).
