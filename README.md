# blog-kit

`blog-kit` is an open source toolkit for building modular blogs and
lightweight publishing systems with clear package boundaries and a
reference starter app.

## Name

The public project name is `blog-kit`. It is short, generic, and fits better as a reusable toolkit than as code tied to a single deployment.

Other reasonable alternatives if we ever want a different brand:

- `northstar-blog`
- `open-article-kit`
- `modular-publishing-kit`

## Goal

Split the current blog into three layers:

- `blog-kit`: convenience metapackage for the default public surface.
- `blog-kit-core`: domain, contracts, and pure utilities.
- `blog-kit-editor`: reusable editor UI and post editing flows.
- `blog-kit-supabase`: persistence and editorial/auth integration for Supabase.
- `blog-kit-next`: integration helpers and components for Next.js.
- `starter`: a neutral runnable example for fast adoption.

## Packages

- `blog-kit`: convenience entrypoint for core helpers, publishing helpers, and the `blog-kit/supabase` subpath
- `blog-kit-core`: domain types, repository contracts, and pure helpers
- `blog-kit-editor`: provider-agnostic editor UI built on `mdxeditor`
- `blog-kit-supabase`: repositories and mapping logic for Supabase
- `blog-kit-next`: metadata, RSS, sitemap, and publishing helpers
- `apps/starter`: runnable reference app for local and data-backed modes

Package-level documentation:

- [`packages/blog-kit/README.md`](./packages/blog-kit/README.md)
- [`packages/core/README.md`](./packages/core/README.md)
- [`packages/editor/README.md`](./packages/editor/README.md)
- [`packages/adapter-next/README.md`](./packages/adapter-next/README.md)
- [`packages/adapter-supabase/README.md`](./packages/adapter-supabase/README.md)

## Principles

- The core must not know about branding, business routes, or app-
  specific copy.
- Adapters contain provider-specific integrations.
- The starter app demonstrates the recommended implementation, but does not define the core.
- Site configuration should live in explicit objects, not hardcoded constants.

## Initial Structure

```text
blog-kit/
├── apps/
│   └── starter/
├── docs/
├── packages/
│   ├── adapter-next/
│   ├── adapter-supabase/
│   └── core/
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## Current Status

This scaffold currently includes:

- base monorepo structure
- initial blog domain model
- repository contracts
- reusable pure utilities
- architecture and roadmap documentation
- a tested Supabase adapter layer
- a minimal Next.js starter app
- a Tailwind CSS v4 styling baseline in the starter app
- a static export path for a public starter demo
- a publishable `blog-kit` metapackage
- a publishable `blog-kit-editor` package
- RSS and sitemap helpers in the Next.js adapter
- RSS and sitemap routes in the starter app
- structured metadata helpers in the Next.js adapter
- CI for typecheck, lint, and tests
- Release Please versioning for publishable packages

It does not include yet:

- a dashboard shell
- local filesystem persistence for post editing
- automated npm publishing

## Installation

```bash
pnpm install
```

## Workspace Commands

```bash
pnpm typecheck
pnpm test
pnpm build
```

## CI

GitHub Actions runs a minimal validation workflow for:

- `push` to `main`
- pull requests

Current CI scope:

- install dependencies
- run `pnpm typecheck`
- run `pnpm lint`
- run `pnpm test`

## Versioning

The repository uses Release Please for versioning and release PR
automation.

Current scope:

- `blog-kit`
- `blog-kit-core`
- `blog-kit-editor`
- `blog-kit-next`
- `blog-kit-supabase`

Configuration files:

- `release-please-config.json`
- `.release-please-manifest.json`
- `.github/workflows/release-please.yml`

For the current branching model, commit expectations, and release flow,
see [docs/releases.md](./docs/releases.md).

For the current publishing strategy and maintainer checklist, see
[docs/publishing.md](./docs/publishing.md).

## Adoption Paths

Choose the package surface based on how much control you want.

### Use `blog-kit`

Use the metapackage when you want a simple default install surface:

- core blog types and pure helpers
- publishing helpers for metadata, RSS, sitemap, and structured data
- optional Supabase access from `blog-kit/supabase`

### Use `blog-kit-core`

Use `blog-kit-core` when you want only:

- framework-agnostic domain types
- repository contracts
- pure filtering, pagination, and transformation helpers

### Use `blog-kit-next`

Use `blog-kit-next` when you already have your own domain layer and want:

- article metadata helpers
- RSS output
- sitemap entries
- structured data generation

### Use `blog-kit-supabase`

Use `blog-kit-supabase` when your content already lives in Supabase and
you want:

- repository implementations
- row-to-domain mapping
- typed adapter error handling

### Use `apps/starter`

Use the starter when you want:

- a runnable reference app
- a public static demo for GitHub Pages
- a starting point for integrating your own design system

## Running the Starter

```bash
pnpm --dir apps/starter dev
```

The starter app supports two modes:

- local sample content mode
- Supabase-backed mode

The starter uses Tailwind CSS v4 as its styling baseline so it can be
adapted more easily to an existing design system.

For the recommended theming and design system integration model, see
[docs/starter-theming.md](./docs/starter-theming.md).

For static demo deployment and GitHub Pages guidance, see
[docs/starter-deploy.md](./docs/starter-deploy.md).

### Local Sample Mode

No environment variables are required. The starter will use the sample
content defined in `apps/starter/src/sample-posts.ts`.

### Static Demo Mode

The starter can also be exported as a static site for GitHub Pages.

```bash
pnpm --dir apps/starter build:static
```

The GitHub Pages workflow builds the starter with sample content and a
repository-scoped base path so the public demo can act as both project
website and runnable reference.

### Supabase Mode

Create `apps/starter/.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
```

When these variables are present, the starter app will create a real
Supabase client and load published posts through `blog-kit-supabase`.

If the variables are missing or data loading fails, the starter falls
back to local sample content.

## Starter Routes

These routes should work in local mode and in Supabase mode:

- `/`
- `/blog/building-a-modular-blog-toolkit`
- `/blog/why-adapters-matter`
- `/blog/starter-apps-as-documentation`
- `/blog/rss.xml`
- `/sitemap.xml`

You should also verify that an unknown slug returns a `404`.

## Supabase Requirements

The current adapter expects these tables:

- `posts`
- `authors`
- `categories`
- `post_categories`

The current adapter expects these relationships:

- `posts.author_id -> authors.id`
- many-to-many between `posts` and `categories` through
  `post_categories`

The starter currently reads published content, so real records should
have `is_draft = false` to appear in the public routes.

For the current minimum schema and starter SQL, see
[docs/supabase-schema.md](./docs/supabase-schema.md).

For auth, RLS, and migration guidance, see
[docs/supabase-ops.md](./docs/supabase-ops.md).

## Editorial Scope

For the current decision on what belongs in public editorial scope,
what should remain example-only, and what is explicitly out of scope,
see [docs/editorial-scope.md](./docs/editorial-scope.md).

## Recommended Next Step

Validate the first metapackage release flow and decide what the initial
npm publish set should be.
