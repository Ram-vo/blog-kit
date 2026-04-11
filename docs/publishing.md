# Publishing Setup

This document defines how `blog-kit` should be published, which
packages are intended for npm, and what maintainers should verify before
shipping a release.

The goal is to move from version tracking to an intentional publishing
workflow.

## Publishable Packages

The repository currently treats these packages as publishable targets:

- `blog-kit-core`
- `blog-kit-next`
- `blog-kit-supabase`

These packages contain reusable domain logic, framework helpers, or
provider adapters that other projects can consume directly.

## Non-Publishable Packages

The following workspace entry should remain non-publishable:

- `apps/starter`

Why:

- it is a reference app, not a reusable library package
- it exists to demonstrate adoption, not to be installed from npm

## Current Publishing Status

Release Please already handles:

- package version bumps
- changelog generation
- release pull requests
- release tags

The repository does not yet automate:

- npm publish
- registry provenance settings
- publish-time validation
- release artifact checks

That means package publishing is still a deliberate maintainer action.

## Package Metadata Expectations

Before the first public npm release, each publishable package should
have:

- correct `name`
- stable `exports`
- stable `main`
- stable `types`
- a package README
- a changelog file
- an explicit publish access setting

Before the first real publish, maintainers should also decide:

- package license expression
- repository metadata
- homepage and bugs URLs
- whether additional package exports are required

## Manual Release Checklist

Before merging releasable work into `main`:

- confirm CI is green
- confirm package tests pass locally
- confirm docs reflect the current public API
- confirm the PR title or squash title is a valid Conventional Commit
- confirm only intended packages are affected

Before merging a Release Please PR:

- review the package versions that will change
- review the generated changelog entries
- confirm the release PR does not include unrelated documentation noise
- confirm package READMEs match the surfaced APIs

Before publishing to npm manually:

- run `pnpm install`
- run `pnpm typecheck`
- run `pnpm test`
- run `pnpm build`
- inspect the package contents that will be published

## Contributor Guidance For Multi-Package Changes

When a change affects multiple packages:

- keep the package boundaries explicit in the PR description
- update each affected package README if the public API changes
- add or update tests in each affected public package
- avoid hiding package API changes inside starter-only work

When a change affects only docs or workflow:

- do not force a release-worthy commit type
- prefer `docs`, `ci`, or `chore`

When a change affects one publishable package materially:

- use a package-scoped Conventional Commit such as
  `feat(core): ...` or `fix(next): ...`

## Recommended First Publish Strategy

For the first intentional npm release, keep the process conservative:

1. publish only the three reusable packages
2. do not publish a top-level `blog-kit` metapackage yet
3. treat the starter app as documentation and a migration target
4. prefer a manual publish after validating package contents

This keeps the first release reversible and easy to reason about.

## Future Automation

Likely next steps after the first manual publish:

- add registry-focused package metadata
- automate npm publishing from release tags
- add publish-time validation in CI
- document rollback and deprecation handling
