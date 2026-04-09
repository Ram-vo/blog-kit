# Supabase Operational Notes

This guide closes the gap between the minimum schema and the practical
questions teams usually hit next:

- Do we need RLS?
- Do we need auth right away?
- How do we migrate if our schema already exists?

## Auth and RLS

`blog-kit-supabase` does not require Supabase Auth to work.

The current starter only reads published content through public keys, so
the smallest viable setup is:

- public read access for published posts
- public read access for categories
- public read access for authors

If a team only wants a public blog frontend, they can start without any
editorial auth flow and add it later.

## Minimal RLS Strategy

If you enable Row Level Security, keep the first policy set narrow and
boring:

- allow public `SELECT` on published posts
- allow public `SELECT` on authors
- allow public `SELECT` on categories
- allow public `SELECT` on post-category relations
- keep `INSERT`, `UPDATE`, and `DELETE` restricted

That gives the starter app enough access to render public content while
keeping write paths closed.

## Example Policy Direction

The exact SQL will differ by project, but the access model should look
like this:

- public users can read `POSTS` where `IS_DRAFT = FALSE`
- public users can read `AUTHORS`
- public users can read `CATEGORIES`
- public users can read `POST_CATEGORIES`
- only trusted roles can write

## Existing Schema Migration

If a team already has blog tables, avoid a destructive migration.
Instead, check these things in order:

1. field names
2. relation names
3. nullability
4. published-vs-draft semantics
5. whether the adapter query shape can resolve the relations

The fastest path is usually one of these:

- rename fields to match the current contract
- add compatibility columns
- add SQL views that match the adapter expectations
- fork the adapter mapping layer for project-specific schemas

## Recommended Migration Order

1. get read-only listing working first
2. get single-post fetching working next
3. verify categories and authors resolve correctly
4. verify RSS and sitemap output
5. only then enable create or update workflows

## When to Fork the Adapter

Fork or extend the adapter if:

- your schema naming is fundamentally different
- your relations cannot be exposed in the expected shape
- you need custom auth rules baked into repository behavior

Do not fork just because:

- you use extra columns
- you have more tables than the starter
- you want stricter internal write rules

## Recommendation

For new projects:

- follow the documented minimum schema first
- keep policies simple
- add editorial auth after public reads are stable

For existing projects:

- prefer compatibility layers over destructive schema rewrites
- use the current adapter contract as the integration target
