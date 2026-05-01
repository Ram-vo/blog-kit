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
- a Supabase-backed editorial path powered by `blog-kit-supabase`
- editor image uploads through the active local or Supabase backend
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
- `/blog/inside-blog-kit-core`
- `/blog/why-adapters-matter`
- `/blog/nextjs-publishing-helpers`
- `/blog/choosing-between-local-and-supabase`
- `/blog/starter-apps-as-documentation`
- `/blog/editorial-workflows-with-blog-kit`
- `/blog/exporting-the-starter-as-a-public-demo`
- `/blog/rss.xml`
- `/sitemap.xml`

The editor routes use local filesystem persistence. They are available
in runtime mode and are intentionally excluded from the static export.

Local image uploads are written to `apps/starter/public/blog-media` and
returned as `/blog-media/...` URLs.

By default the editor is open because this app is a reference starter.
To enable the built-in token guard, set:

```bash
STARTER_EDITOR_AUTH_MODE=token
STARTER_EDITOR_ACCESS_TOKEN=replace-with-a-secret-token
```

When token mode is enabled:

- `/editor/*` redirects to `/editor/login` until the token is accepted
- `/api/editor/*` returns `401` without a valid cookie or bearer token
- `POST /api/editor/session` exchanges the token for a HttpOnly cookie

The starter editor validates required draft and publish fields before
writing content. The UI shows the current save state and blocks publish
actions until required issues are resolved.

The sample posts are intentionally written as package documentation.
Each post explains one piece of the system while also exercising the
same rendering and editing path a consumer would integrate.

To force the starter to use local content even when Supabase credentials
exist, set:

```bash
STARTER_DATA_BACKEND=local
```

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

- `STARTER_DATA_BACKEND=supabase`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET`

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

When `STARTER_DATA_BACKEND=supabase` is active:

- `/` reads published posts from Supabase
- `/blog/[slug]` reads article bodies from Supabase
- `/editor` reads and writes editorial content through the Supabase
  adapter
- editor image uploads are written to the configured Supabase Storage
  bucket

If the backend is left on `auto`, the starter prefers Supabase when the
credentials exist and falls back to local content otherwise.

## Editorial Auth

The starter currently leaves auth open on purpose. Its job is to prove
the package boundaries, not to lock down a product workflow.

The intended production model is:

- host app resolves auth
- host app maps auth into `EditorSession`
- `blog-kit-editor` stays provider-agnostic

If you use Supabase Auth, `blog-kit-supabase` includes a
`resolveSupabaseEditorSession` helper that maps Supabase users and
metadata roles into the generic editor session model.

The built-in token guard is intentionally minimal. Treat it as a starter
default for demos or private previews, not as a complete role-based
authorization model.

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
