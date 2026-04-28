# blog-kit

[![CI](https://github.com/Ram-vo/blog-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/Ram-vo/blog-kit/actions/workflows/ci.yml)
[![Release Please](https://github.com/Ram-vo/blog-kit/actions/workflows/release-please.yml/badge.svg)](https://github.com/Ram-vo/blog-kit/actions/workflows/release-please.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

`blog-kit` is a modular publishing toolkit for teams that want a
reusable blog layer without coupling content rules, provider adapters,
editor UI, and app-specific presentation into one codebase.

It ships focused npm packages for domain contracts, Next.js publishing
helpers, Supabase persistence, local MDX editing, and a reusable MDX
editor. The repo also includes a neutral starter app that doubles as a
live reference implementation.

## Install

Use the scoped metapackage for the shortest path:

```bash
pnpm add @mrraymondvo/blog-kit
```

Add React when you use the editor surface:

```bash
pnpm add @mrraymondvo/blog-kit react react-dom
```

Add Supabase only when you need the Supabase adapter:

```bash
pnpm add @mrraymondvo/blog-kit @supabase/supabase-js
```

## Quick Example

```ts
import {
  paginateItems,
  toArticleMetadata,
  toBlogPostSummary,
  toRssFeedFromSummaries
} from "@mrraymondvo/blog-kit";

const summaries = posts.map((post) => toBlogPostSummary(post, siteConfig));
const page = paginateItems(summaries, { page: 1, pageSize: 6 });
const metadata = toArticleMetadata(post, siteConfig);
const rss = toRssFeedFromSummaries(summaries, siteConfig);
```

Supabase remains opt-in through a subpath:

```ts
import { createClient } from "@supabase/supabase-js";
import { createSupabaseAdapter } from "@mrraymondvo/blog-kit/supabase";

const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
const adapter = createSupabaseAdapter({ client });
const posts = await adapter.posts.listAllPublishedPosts();
```

## Packages

| Package | Purpose |
| --- | --- |
| `@mrraymondvo/blog-kit` | Scoped convenience entrypoint |
| `blog-kit-core` | Domain types, contracts, and pure helpers |
| `blog-kit-next` | Next.js metadata, RSS, sitemap, and JSON-LD helpers |
| `blog-kit-editor` | Reusable React editor primitives built on MDXEditor |
| `blog-kit-local` | Filesystem-backed local MDX editorial persistence |
| `blog-kit-supabase` | Supabase repositories, mapping, and editor auth helpers |
| `apps/starter` | Runnable Next.js reference app and public demo |

Package documentation:

- [`packages/blog-kit/README.md`](./packages/blog-kit/README.md)
- [`packages/core/README.md`](./packages/core/README.md)
- [`packages/adapter-next/README.md`](./packages/adapter-next/README.md)
- [`packages/editor/README.md`](./packages/editor/README.md)
- [`packages/local/README.md`](./packages/local/README.md)
- [`packages/adapter-supabase/README.md`](./packages/adapter-supabase/README.md)

## Architecture

`blog-kit` is built around one separation:

- core packages own domain contracts and reusable publishing helpers
- adapters own provider-specific persistence and mapping logic
- host apps own routes, auth, layout, theme, and product behavior

This keeps the blog portable. You can replace the shell, data source, or
design system without rewriting the domain model or editor UI.

```text
blog-kit/
├── apps/
│   └── starter/
├── docs/
├── packages/
│   ├── adapter-next/
│   ├── adapter-supabase/
│   ├── blog-kit/
│   ├── core/
│   ├── editor/
│   └── local/
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## Starter App

Run the reference app locally:

```bash
pnpm install
pnpm --dir apps/starter dev
```

The starter supports:

- local sample mode for quick exploration
- local editable MDX mode through `blog-kit-local`
- Supabase-backed mode through `blog-kit-supabase`
- static export mode for GitHub Pages demos

Build the static demo:

```bash
pnpm --dir apps/starter build:static
```

Useful starter routes:

- `/`
- `/editor`
- `/editor/new`
- `/blog/building-a-modular-blog-toolkit`
- `/blog/inside-blog-kit-core`
- `/blog/why-adapters-matter`
- `/blog/nextjs-publishing-helpers`
- `/blog/choosing-between-local-and-supabase`
- `/blog/starter-apps-as-documentation`
- `/blog/exporting-the-starter-as-a-public-demo`
- `/blog/rss.xml`
- `/sitemap.xml`

## Supabase Mode

Create `apps/starter/.env.local` from the example file:

```bash
cp apps/starter/.env.example apps/starter/.env.local
```

Set:

```bash
STARTER_DATA_BACKEND=supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
```

When Supabase mode is active, public routes and editor routes use the
Supabase adapter. When credentials are missing and the backend is left
on `auto`, the starter falls back to local content.

## Documentation

- [Getting started](./docs/getting-started.md)
- [Starter theming](./docs/starter-theming.md)
- [Starter deployment](./docs/starter-deploy.md)
- [Supabase schema](./docs/supabase-schema.md)
- [Publishing and npm releases](./docs/publishing.md)
- [Release workflow](./docs/releases.md)

The starter articles are intentionally written as product documentation.
They explain the same package boundaries that the app demonstrates.

## Repository Commands

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

CI runs typecheck, lint, and tests on pull requests and `main`.
Release Please manages package versions and release PRs.
GitHub releases publish packages to npm automatically.

## License

MIT.
