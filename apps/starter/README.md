# Starter App

This app is the integration reference for project users.

Current scope:

- minimal Next.js App Router setup
- sample site configuration
- sample post data
- blog index and article routes
- direct consumption of workspace packages
- optional Supabase-backed data loading
- RSS and sitemap routes powered by package helpers

This is intentionally small. Its job is to prove the package boundaries
and demonstrate the expected integration shape.

## Local Data Mode

By default the starter uses in-repo sample content. This keeps the app
bootable even when no external services are configured.

Start it with:

```bash
pnpm --dir apps/starter dev
```

Routes to verify in this mode:

- `/`
- `/blog/building-a-modular-blog-toolkit`
- `/blog/why-adapters-matter`
- `/blog/starter-apps-as-documentation`
- `/blog/rss.xml`
- `/sitemap.xml`

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
