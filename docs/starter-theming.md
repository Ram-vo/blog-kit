# Starter Theming and Design System Integration

The starter app is intentionally opinionated, but it is not meant to be
the final visual system for every adopter.

Its job is to:

- prove the integration shape
- provide a usable default interface
- stay easy to retheme or replace

This document explains the intended extension points.

## Design Goals

The starter should be:

- visually complete enough to demonstrate the product
- independent from any downstream brand
- easy to align with an existing design system

The goal is not to ship a universal theme. The goal is to ship a clear
theme contract.

## Integration Layers

The starter separates visual concerns into three layers:

1. theme tokens
2. presentational primitives
3. route-level composition

These layers are represented by:

- `apps/starter/src/starter-theme.ts`
- `apps/starter/app/components/starter-ui.tsx`
- `apps/starter/app/**/*.tsx`

## Layer 1: Theme Tokens

File:

- `apps/starter/src/starter-theme.ts`

This file defines the `StarterTheme` object and maps it into CSS
variables through `getStarterThemeStyle`.

Use this layer when you want to change:

- colors
- font stacks
- shadows
- panel radius
- card radius
- page background treatment

This is the lowest-friction way to align the starter with an existing
brand.

Typical changes:

- replace the serif and sans stacks with your system fonts
- swap accent and surface colors
- reduce or remove decorative gradients
- align radius and shadow values with your component system

## Layer 2: Presentational Primitives

File:

- `apps/starter/app/components/starter-ui.tsx`

This file contains small reusable UI building blocks such as:

- `StarterContainer`
- `SurfacePanel`
- `SurfaceCard`
- `SectionHeading`
- `PrimaryLink`
- `EmptyState`

Use this layer when you want to change:

- panel composition
- card composition
- shared spacing behavior
- link treatment
- section header patterns
- reusable empty-state patterns

This is the right place to connect your own design system primitives.

For example, you can replace:

- `SurfacePanel` with your own `Card` or `Panel`
- `PrimaryLink` with your own button or link component
- `SectionHeading` with your own typographic heading block

If your team already has a design system, this is usually the first file
to adapt.

## Layer 3: Route-Level Composition

Files:

- `apps/starter/app/layout.tsx`
- `apps/starter/app/page.tsx`
- `apps/starter/app/blog/[slug]/page.tsx`
- loading and `not-found` route files

Use this layer when you want to change:

- page hierarchy
- copy
- information density
- content order
- which UI primitives appear on each page

This layer should not own design tokens. It should compose primitives
and package APIs.

## Recommended Integration Path

If you want to adopt the starter in an existing product, use this order:

1. keep the route logic and data flow intact
2. replace tokens in `starter-theme.ts`
3. swap primitives in `starter-ui.tsx`
4. adjust page composition only after the previous two layers are in
   place

This reduces the risk of mixing visual changes with application logic.

## Minimal Retheme

Use a minimal retheme if you only need visual alignment.

Change:

- `starterTheme.colors`
- `starterTheme.fonts`
- `starterTheme.effects`
- `starterTheme.radii`

Keep:

- route structure
- data loading
- metadata and publishing helpers
- starter primitives

This is the recommended approach for quick adoption.

## Design System Integration

Use a deeper integration if your product already has shared components.

Recommended approach:

1. keep `starter-theme.ts` only for fallback token defaults
2. replace the primitives in `starter-ui.tsx` with wrappers around your
   own components
3. keep route files focused on composition and content

Examples:

- map `SurfacePanel` to an internal `Card`
- map `PrimaryLink` to an internal `ButtonLink`
- map `EmptyState` to a product-level empty-state component

This keeps the starter app aligned with the rest of your product while
preserving the package integration pattern.

## What Should Stay Stable

When retheming the starter, try to keep these areas stable:

- package imports from `blog-kit-core`, `blog-kit-next`, and
  `blog-kit-supabase`
- route structure for the starter example
- metadata, RSS, sitemap, and structured data usage
- data fallback behavior between local data and Supabase

These are part of the starter's reference value.

## What Should Not Live in Public Packages

Do not move product-specific UI decisions into:

- `packages/core`
- `packages/adapter-next`
- `packages/adapter-supabase`

Branding, layout, and visual identity belong in the consuming app.

The publishable packages should stay focused on domain, adapters, and
framework helpers.

## A Good Adoption Outcome

A successful adoption usually looks like this:

- the product keeps the `blog-kit` data and routing patterns
- the starter theme is replaced or heavily modified
- the app uses the team's existing design system components
- no product branding leaks into the shared packages

That is the intended model for this repository.
