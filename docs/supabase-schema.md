# Supabase Schema Guide

This guide describes the minimum schema expected by
`blog-kit-supabase` and the starter app.

It is intentionally small. The goal is to help a new user get to a
working blog quickly, not to define a complete CMS upfront.

## Required Tables

- `authors`
- `posts`
- `categories`
- `post_categories`

## Required Relationships

- `posts.author_id -> authors.id`
- many-to-many between `posts` and `categories` through
  `post_categories`

## Required Post Fields

- `id`
- `slug`
- `title`
- `excerpt`
- `tags`
- `mdx_content`
- `cover_image_url`
- `published_at`
- `is_draft`
- `author_id`
- `created_at`
- `updated_at`

## Required Author Fields

- `id`
- `full_name`
- `bio`
- `avatar_url`
- `social_links`
- `created_at`
- `updated_at`

## Required Category Fields

- `id`
- `name`
- `slug`

## Starter SQL

Use this SQL as a minimum starting point in a Supabase project:

```sql
CREATE EXTENSION IF NOT EXISTS PGCRYPTO;

CREATE TABLE IF NOT EXISTS PUBLIC.AUTHORS (
  ID UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  FULL_NAME TEXT NOT NULL,
  BIO TEXT,
  AVATAR_URL TEXT,
  SOCIAL_LINKS JSONB NOT NULL DEFAULT '{}'::JSONB,
  CREATED_AT TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UPDATED_AT TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS PUBLIC.POSTS (
  ID UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  SLUG TEXT NOT NULL UNIQUE,
  TITLE TEXT NOT NULL,
  EXCERPT TEXT,
  TAGS TEXT[] NOT NULL DEFAULT '{}',
  MDX_CONTENT TEXT,
  COVER_IMAGE_URL TEXT,
  PUBLISHED_AT TIMESTAMPTZ,
  IS_DRAFT BOOLEAN NOT NULL DEFAULT TRUE,
  AUTHOR_ID UUID REFERENCES PUBLIC.AUTHORS(ID) ON DELETE SET NULL,
  CREATED_AT TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UPDATED_AT TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS PUBLIC.CATEGORIES (
  ID UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  NAME TEXT NOT NULL UNIQUE,
  SLUG TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS PUBLIC.POST_CATEGORIES (
  POST_ID UUID NOT NULL REFERENCES PUBLIC.POSTS(ID) ON DELETE CASCADE,
  CATEGORY_ID UUID NOT NULL REFERENCES PUBLIC.CATEGORIES(ID) ON DELETE CASCADE,
  PRIMARY KEY (POST_ID, CATEGORY_ID)
);
```

## Seed Example

This seed is enough to make the starter app render real content:

```sql
INSERT INTO PUBLIC.AUTHORS (
  ID,
  FULL_NAME,
  BIO,
  SOCIAL_LINKS
)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Starter Team',
  'Sample author for blog-kit starter mode.',
  '{"github":"https://github.com/example"}'::JSONB
)
ON CONFLICT (ID) DO NOTHING;

INSERT INTO PUBLIC.CATEGORIES (
  ID,
  NAME,
  SLUG
)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Architecture',
  'architecture'
)
ON CONFLICT (ID) DO NOTHING;

INSERT INTO PUBLIC.POSTS (
  ID,
  SLUG,
  TITLE,
  EXCERPT,
  TAGS,
  MDX_CONTENT,
  PUBLISHED_AT,
  IS_DRAFT,
  AUTHOR_ID
)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'hello-from-supabase',
  'Hello from Supabase',
  'A seeded post for validating the starter app.',
  ARRAY['starter', 'supabase'],
  'This post was loaded from a real Supabase project.',
  NOW(),
  FALSE,
  '11111111-1111-1111-1111-111111111111'
)
ON CONFLICT (ID) DO NOTHING;

INSERT INTO PUBLIC.POST_CATEGORIES (
  POST_ID,
  CATEGORY_ID
)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222'
)
ON CONFLICT DO NOTHING;
```

## Validation Checklist

After configuring the starter with:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

verify these routes:

- `/`
- `/blog/hello-from-supabase`
- `/blog/rss.xml`
- `/sitemap.xml`

Also confirm:

- the post has `is_draft = false`
- the slug is unique
- the author relation resolves
- the category relation resolves

## Notes

- The current starter reads published posts only.
- Missing environment variables or fetch failures will fall back to
  local sample content.
- This guide documents the current minimum contract, not the final
  public schema of the project.

For RLS, auth, and migration guidance, see
[supabase-ops.md](./supabase-ops.md).
