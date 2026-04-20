# Publishing Setup

This document defines how `blog-kit` should be published, which
packages are intended for npm, and what maintainers should verify before
shipping a release.

The goal is to move from version tracking to an intentional publishing
workflow.

## Publishable Packages

The repository currently treats these packages as publishable targets:

- `blog-kit`
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

The repository now also automates npm publishing through:

- `.github/workflows/publish-npm.yml`

That workflow:

- runs on `release.published`
- installs the workspace with `pnpm`
- runs `typecheck`, `test`, and `build`
- publishes only package versions that are not already on npm
- uses npm provenance during publish

The remaining maintainer action is repository setup:

- add the `NPM_TOKEN` repository secret

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

## Release Checklist

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

Before enabling automated publishing:

- create the repository secret `NPM_TOKEN`
- confirm the token can publish all `blog-kit*` packages
- confirm GitHub Actions has permission to read contents and request
  `id-token`
- confirm the npm package names are owned by the publishing account

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

1. publish `blog-kit` alongside the three package-specific modules
2. keep `blog-kit/supabase` as the explicit adapter entrypoint
3. treat the starter app as documentation and a migration target
4. publish from the release workflow after validating package contents

This keeps the first release ergonomic without hiding the package
boundaries from advanced adopters.

## Future Automation

Likely next steps after the first manual publish:

- add registry-focused package metadata
- add publish-time validation in CI
- document rollback and deprecation handling
