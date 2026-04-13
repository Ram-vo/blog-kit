# Starter App

This app is the integration reference for project users.

Current scope:

- minimal Next.js App Router setup
- Tailwind CSS v4 styling baseline
- sample site configuration
- sample post data
- blog index and article routes
- direct consumption of workspace packages
- optional Supabase-backed data loading
- a local editorial demo powered by `blog-kit-editor` and `blog-kit-local`
- RSS and sitemap routes powered by package helpers
- static export support for a public demo deployment

This is intentionally small. Its job is to prove the package boundaries
and demonstrate the expected integration shape.

## Styling Baseline

The starter uses Tailwind CSS v4 as its styling layer.

This is intentional:

- most Next.js users already expect Tailwind in starter projects
- the starter is easier to adapt to an existing design system
- design tokens can be replaced in `app/globals.css` without rewriting
  the page structure

The current global file contains only:

- Tailwind import and theme tokens
- a small set of base styles
- a few semantic utility helpers for panels, cards, and shimmer states

The recommended extension points are:

- `src/starter-theme.ts` for theme tokens and CSS variable values
- `app/components/starter-ui.tsx` for reusable presentational primitives
- route files for app-specific composition and copy

This keeps the starter visually opinionated without coupling it to any
single downstream design system.

For a full guide to retheming the starter or wiring it into an existing
design system, see
[`docs/starter-theming.md`](../../docs/starter-theming.md).

## Local Data Mode

By default the starter uses in-repo sample content. This keeps the app
bootable even when no external services are configured.

Start it with:

```bash
pnpm --dir apps/starter dev
```

Routes to verify in this mode:

- `/`
- `/editor`
- `/editor/new`
- `/blog/building-a-modular-blog-toolkit`
- `/blog/why-adapters-matter`
- `/blog/starter-apps-as-documentation`
- `/blog/rss.xml`
- `/sitemap.xml`

The editor routes use local filesystem persistence. They are available
in runtime mode and are intentionally excluded from the static export.

## Static Demo Mode

The starter also supports a static export path for GitHub Pages and
other static hosts.

Run the export build with:

```bash
pnpm --dir apps/starter build:static
```

This mode always uses in-repo sample content. It is intended for a
public demo, package website, or design reference that does not depend
on runtime credentials.

The static export intentionally excludes:

- editor routes
- editor API routes

This keeps the GitHub Pages demo compatible with static hosting while
the runtime starter still exposes the editable local blog flow.

Optional arguments:

```bash
pnpm --dir apps/starter build:static --base-path=/blog-kit --site-url=https://ram-vo.github.io/blog-kit
```

For deployment details and tradeoffs, see
[`docs/starter-deploy.md`](../../docs/starter-deploy.md).

## Supabase Mode

If these environment variables are set, the starter will use a real
Supabase client through `blog-kit-supabase`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

Create `apps/starter/.env.local` from `.env.example` and restart the
dev server after editing it.

Minimal setup:

```bash
cp apps/starter/.env.example apps/starter/.env.local
```

Then fill in the values and restart:

```bash
pnpm --dir apps/starter dev
```

## Supabase Schema Expectations

The current starter and adapter expect:

- `posts`
- `authors`
- `categories`
- `post_categories`

Required relationship shape:

- `posts.author_id -> authors.id`
- many-to-many between `posts` and `categories`

Posts must have `is_draft = false` to appear in public routes.

For starter SQL and the current minimum schema, see
[`docs/supabase-schema.md`](../../docs/supabase-schema.md).

## Fallback Behavior

If the required environment variables are missing, or if the Supabase
request fails, the starter falls back to in-repo sample content. This
keeps the app useful for local exploration even without a live backend.
