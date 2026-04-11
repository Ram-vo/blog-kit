# Architecture

## Scope

The first open source version is aimed at a concrete use case:

- blog and lightweight CMS
- preferred stack: Next.js + Supabase
- modular design that allows additional adapters later

## Package boundaries

### `blog-kit-core`

Responsibilities:

- domain entities
- repository contracts
- rules and use cases
- pure utilities

It must not depend on:

- `next`
- `react`
- `@supabase/*`
- site branding

### `blog-kit-supabase`

Responsibilities:

- post, author, and category persistence
- mapping between Supabase tables and domain types
- provider-specific access policies
- injected client contract for runtime flexibility

### `blog-kit-next`

Responsibilities:

- metadata helpers
- sitemap and RSS serialization
- optional App Router integration
- publishing-oriented utilities that reduce app-level duplication

### `starter`

Responsibilities:

- runnable example
- neutral visual theme
- site configuration
- onboarding reference
- fallback sample content for zero-config local development
- optional Supabase-backed runtime mode

## Editorial Boundary

The current project stance is:

- generic editorial domain features may live in public packages
- dashboard UI should remain example-only
- auth wiring should remain example-only
- media management UI should remain example-only

For the current detailed decision model, see
[`docs/editorial-scope.md`](./editorial-scope.md).

## Runtime Modes

### Starter Local Mode

The starter can run with no external services. In this mode it reads
sample posts from the repository and still exposes article, RSS, and
sitemap routes.

### Starter Supabase Mode

When the required public environment variables are present, the starter
creates a real Supabase client and uses `blog-kit-supabase` to fetch
published posts.

This mode is intentionally additive. Missing variables or fetch errors
should not break local development.

## Initial extraction strategy

1. Start from a stable domain model and normalize it for public use.
2. Remove deployment-specific defaults from the public model.
3. Move provider access into dedicated adapters.
4. Redefine the UI layer around composition and configuration.
5. Add a starter app that consumes only public package APIs.
