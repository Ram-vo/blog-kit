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

### `blog-kit-next`

Responsibilities:

- metadata helpers
- sitemap and RSS serialization
- optional App Router integration

### `starter`

Responsibilities:

- runnable example
- neutral visual theme
- site configuration
- onboarding reference

## Initial extraction strategy

1. Copy the stable domain model from `elab-frontend`.
2. Remove e-Lab defaults from the public model.
3. Move Supabase access into a dedicated adapter.
4. Redefine the UI layer around composition and configuration.
5. Only then migrate blog components and the starter app.
