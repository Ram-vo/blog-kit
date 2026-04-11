# Roadmap

This roadmap is meant to be operational, not aspirational. Each phase
should end with a usable, reviewable state.

## Guiding Goals

- keep the core package framework-agnostic
- make adapters replaceable
- prove the API through a runnable starter app
- avoid shipping product-specific assumptions in public packages
- reach a publishable state with documentation, tests, and versioning

## Phase 1: Foundation

Status: completed

Goals:

- create the monorepo layout
- define initial package boundaries
- establish the core domain model
- add base documentation for contributors and users

Delivered:

- workspace configuration
- `blog-kit-core`
- `blog-kit-next`
- `blog-kit-supabase`
- `apps/starter`
- initial architecture documentation

Exit criteria:

- the workspace installs successfully
- package boundaries are explicit
- the repo is clean enough for a first public commit

## Phase 2: Data Layer

Status: completed

Goals:

- implement a usable Supabase adapter
- map database rows into public domain types
- support basic read and write workflows for posts
- keep infrastructure logic out of the core package

Delivered:

- `SupabasePostRepository`
- `SupabaseAuthorRepository`
- `SupabaseCategoryRepository`
- client injection instead of hardcoded provider setup
- fixture-based adapter tests
- typed adapter error classification
- starter schema guide
- operational guidance for auth, RLS, and schema migration

Exit criteria:

- adapter behavior is covered by tests
- public methods are stable enough for external integration
- documentation explains required tables and relations

## Phase 3: App Integration

Status: completed

Goals:

- prove the package boundaries in a real app
- keep the starter small enough to understand quickly
- use the starter to validate package ergonomics

Delivered:

- minimal Next.js App Router starter
- sample site config
- sample posts
- index and article routes using package APIs
- optional Supabase-backed data loading
- fallback to local sample content
- RSS route
- sitemap route
- global starter styling system with shared tokens and layout
- richer empty state for installations without published posts

Exit criteria:

- a new user can run the starter locally
- the starter demonstrates the intended integration pattern
- the starter uses public packages rather than internal imports

## Phase 4: Package Maturity

Status: in progress

Goals:

- harden public APIs before publishing
- improve the Next.js adapter beyond metadata
- define the minimum stable feature set for v0.x

Planned work:

- structured metadata helpers
- pagination helpers
- package-level examples
- API usage documentation
- stronger package-level test coverage
- package-level README files

Exit criteria:

- package responsibilities are well documented
- examples cover the primary integration paths
- the adapters expose enough utility to reduce copy-paste in apps

## Phase 5: Editorial Features

Status: completed

Goals:

- decide which editorial features belong in public scope
- avoid turning the project into a product-specific CMS dump

Candidate work:

- author profile utilities
- category and tag management helpers
- media integration patterns
- editorial permissions abstractions

Delivered:

- explicit editorial scope policy
- public versus example-only boundary definition
- package ownership guidance for future editorial features

Exit criteria:

- editorial scope is explicit
- features added here do not pollute the core package

## Phase 6: Release Readiness

Status: in progress

Goals:

- make the repo publishable and maintainable
- reduce friction for first external adopters

Planned work:

- package publishing setup
- versioning strategy
- changelog generation
- release documentation
- package README files
- contribution workflow documentation

Delivered:

- Release Please configuration for package versioning
- CI for dependency install, typecheck, and tests
- publishing and versioning workflow documentation

Exit criteria:

- packages can be published intentionally
- release steps are documented
- contributors can understand how to add or change packages

## Open Questions

- Should there be a top-level `blog-kit` metapackage later?
- Should `blog-kit-next` remain helper-focused or ship components too?
- Should `blog-kit-supabase` depend on `@supabase/supabase-js` directly
  or continue to accept an injected client contract?
- Should the starter remain minimal, or evolve into a stronger template?

## Recommended Next Sequence

This is the current recommended order of work for the next iterations:

1. define package publishing setup beyond versioning
2. add stronger package-level examples and API usage documentation
3. expand package-level test coverage for public APIs
