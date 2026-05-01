# Supabase Production Guidance

This guide expands the minimum Supabase setup into a safer production
model for public reads, editorial writes, auth, and media.

Use it after the starter works with the schema in
[`supabase-schema.md`](./supabase-schema.md).

## Recommended Access Model

Public visitors should be able to:

- read published posts
- read authors
- read categories
- read post-category relations for published posts
- read public media assets

Editors should be able to:

- create drafts
- update posts they are allowed to edit
- publish when their role allows it
- delete only when their role allows it
- upload media through a protected route

## Keep Auth In The Host App

`blog-kit-editor` does not resolve auth. The host app should:

- protect editor routes
- resolve the current user
- map the user into `EditorSession`
- pass save, publish, delete, and upload handlers to the editor

`blog-kit-supabase` includes `resolveSupabaseEditorSession` for apps
that already use Supabase Auth. Apps with custom auth can ignore it and
create their own `EditorSession`.

## RLS Direction

Enable Row Level Security before exposing write paths.

The public read policy should be narrow:

```sql
CREATE POLICY "PUBLIC CAN READ PUBLISHED POSTS"
ON PUBLIC.POSTS
FOR SELECT
USING (IS_DRAFT = FALSE);
```

Authors, categories, and post-category relations can usually have public
read policies if they contain only public metadata:

```sql
CREATE POLICY "PUBLIC CAN READ AUTHORS"
ON PUBLIC.AUTHORS
FOR SELECT
USING (TRUE);

CREATE POLICY "PUBLIC CAN READ CATEGORIES"
ON PUBLIC.CATEGORIES
FOR SELECT
USING (TRUE);

CREATE POLICY "PUBLIC CAN READ POST CATEGORIES"
ON PUBLIC.POST_CATEGORIES
FOR SELECT
USING (TRUE);
```

Write policies should depend on your auth model. Do not copy a broad
`USING (TRUE)` write policy into production.

## Editorial Roles

A simple production role model can start with:

- `author`: can create and edit own drafts
- `editor`: can edit and publish posts
- `admin`: can publish, delete, and manage taxonomy

Map those roles into `EditorSession.permissions` before invoking
editorial actions.

Recommended permission names:

- `posts:create`
- `posts:update`
- `posts:publish`
- `posts:delete`
- `media:upload`

## Storage

For public blogs, the simplest media setup is:

- a public `blog-media` bucket
- protected uploads through `/api/editor/media`
- public URLs stored in post content or `coverImageUrl`

For private media, return signed URLs or proxy files through the host
app. The adapter returns a public URL, so private bucket behavior must be
owned by the application.

## Environment Variables

For the starter Supabase mode:

```bash
STARTER_DATA_BACKEND=supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET=blog-media
```

Do not expose service-role keys to the browser.

If the app needs privileged server-side writes, keep those keys in
server-only environment variables and call them only from protected
server routes.

## Production Checklist

Before using the starter pattern in production:

- public reads only return `IS_DRAFT = FALSE`
- editor routes are protected
- editor API routes are protected
- write policies are role-based
- media uploads require an authenticated editor
- service-role keys never reach client components
- storage bucket visibility matches the URL strategy
- logs do not include tokens or post drafts

## E-Lab Migration Note

For the future e-lab migration, integrate in this order:

1. public list and detail reads
2. RSS and sitemap
3. categories and authors
4. editor reads
5. draft saves
6. publish and delete actions
7. media uploads

Do not migrate the editorial workflow until public reads are stable.
