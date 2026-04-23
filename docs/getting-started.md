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

const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
const adapter = createSupabaseAdapter({ client });
const posts = await adapter.posts.listAllPublishedPosts();
```

## Option 3: Use Package-Specific Modules

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

## Option 4: Start From The Reference App

Use the starter when you want:

- a runnable reference implementation
- a GitHub Pages demo
- a base to integrate with an existing design system

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

## Choosing Between The Metapackage And Explicit Packages

Use `@mrraymondvo/blog-kit` when:

- you want the fastest onboarding path
- you are fine with the default convenience surface
- your app uses Next.js publishing helpers and may later add Supabase

Use explicit packages when:

- you want strict dependency boundaries
- you do not want Next.js helpers in the default import surface
- you want to make adapter usage opt-in at install time
