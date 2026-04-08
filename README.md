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

- `blog-kit-core`: domain, contracts, and pure utilities.
- `blog-kit-supabase`: persistence and editorial/auth integration for Supabase.
- `blog-kit-next`: integration helpers and components for Next.js.
- `starter`: a neutral runnable example for fast adoption.

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
- a working Supabase adapter layer
- a minimal Next.js starter app

It does not include yet:

- adapter tests
- a real Supabase client wired into the starter app
- richer Next.js adapter helpers
- an editor/dashboard
- release and publishing automation

## Recommended Next Step

Stabilize the public package APIs, add adapter tests, and expand the
starter app from sample content to a real data-backed integration.
