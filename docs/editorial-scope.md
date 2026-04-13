# Editorial Scope

This document defines which editorial features belong in public
`blog-kit` packages, which features belong only in example apps, and
which features are explicitly out of scope.

The goal is to keep `blog-kit` useful for real publishing workflows
without turning it into a product-specific CMS dump.

## Scope Principles

A feature belongs in public scope only if it is:

- reusable across multiple publishing products
- independent from one brand or editorial workflow
- compatible with clear package boundaries
- maintainable without introducing product-specific assumptions

A feature should stay out of shared packages if it is:

- tightly coupled to one dashboard implementation
- strongly dependent on a specific auth product setup
- mainly about internal team workflow
- mostly visual product logic rather than publishing infrastructure

## In Scope

These editorial capabilities are appropriate for public packages.

### Author Metadata

Allowed examples:

- public author profiles
- author bios and social links
- default author fallback logic
- author lookups in adapters

Why this is in scope:

- most blogs and editorial sites need public author metadata
- it fits naturally in domain and adapter layers

### Category and Tag Modeling

Allowed examples:

- category and tag types
- list and lookup helpers
- category and tag relations in adapters
- filtering helpers built on public metadata

Why this is in scope:

- taxonomy is a core part of publishing systems
- it stays generic and framework-agnostic

### Media Integration Patterns

Allowed examples:

- content fields for image URLs
- metadata helpers for cover images
- documented adapter patterns for external media storage

Why this is in scope:

- media references are essential for publishing
- storage strategy can remain adapter-specific

### Editorial Permission Abstractions

Allowed examples:

- high-level role concepts such as `author`, `editor`, and `admin`
- adapter-facing permission contracts
- documented policy patterns

Why this is in scope:

- many teams need a shared vocabulary for editorial access
- abstractions can stay generic if they do not encode one auth vendor

### Reusable Editor UI

Allowed examples:

- an MDX editor package built around generic save and publish handlers
- editor state models for post metadata and content
- pluggable image upload hooks
- editor components that accept host-provided auth and repository wiring

Why this is in scope:

- teams often need a reusable writing surface more than a full dashboard
- the editor can stay generic if it does not fetch auth or data directly

## Example-Only Scope

These features may appear in the starter or future example apps, but
should not define the public package surface.

### Dashboard UI

Allowed as examples:

- internal article list pages
- editor navigation patterns
- draft management interfaces

Why this is example-only:

- dashboard UX is highly product-specific
- design systems and workflows vary too much across teams

### Auth Wiring

Allowed as examples:

- a sample Supabase auth integration
- route protection examples
- policy wiring guidance for a starter app

Why this is example-only:

- auth setup is deployment-specific
- public packages should not hardcode provider assumptions

### Media Manager UX

Allowed as examples:

- upload form examples
- asset picker patterns
- editorial image field wiring

Why this is example-only:

- media tooling differs widely between teams
- public packages should avoid shipping one team's UI assumptions

## Out of Scope

These features should not be part of the shared package roadmap unless
the project scope changes explicitly.

- newsletter tooling
- campaign or CRM integrations
- analytics dashboards
- lead capture or CTA systems
- product-specific SEO copy generation
- role systems tied directly to one vendor's auth schema
- business workflow automation unrelated to content modeling

## Package Ownership Guidance

Use this ownership model when adding editorial features.

### `blog-kit-core`

Good fit:

- editorial domain concepts
- public types
- pure rules
- permission abstractions

Bad fit:

- framework UI
- vendor SDK calls
- product-specific workflow logic

### `blog-kit-supabase`

Good fit:

- editorial persistence
- role and policy mapping
- provider-specific relationship handling

Bad fit:

- dashboard screens
- business copy
- hardcoded auth UX

### `blog-kit-next`

Good fit:

- route helpers
- metadata helpers
- publishing-oriented rendering helpers

Bad fit:

- editorial dashboard policy logic
- product-specific admin components

### `blog-kit-editor`

Good fit:

- reusable editor components
- provider-agnostic MDX editing UI
- host-driven save and publish flows
- pluggable upload hooks

Bad fit:

- auth provider wiring
- storage SDK calls
- dashboard navigation and layout
- product-specific editorial workflow rules

### `apps/starter`

Good fit:

- concrete examples of editorial integration
- optional sample admin patterns later
- UI demonstrations of how to consume the packages

## Decision Rule For New Editorial Features

Before adding a new editorial feature, ask:

1. does this solve a general publishing problem?
2. can it live in a package without product-specific copy or UX?
3. is it better expressed as a contract than as a concrete dashboard?
4. would another team plausibly adopt it without sharing our workflow?

If the answer to most of these is no, the feature should stay example-
only or out of scope.

## Current Decision

For the current roadmap, the project stance is:

- public packages may include generic editorial domain concepts
- public packages may include generic permission abstractions
- public packages may include a generic editor UI package
- dashboard UI stays out of package scope
- auth wiring stays example-only
- media management UI stays example-only

This keeps the project useful for real blog systems while protecting the
package boundaries that make it reusable.
