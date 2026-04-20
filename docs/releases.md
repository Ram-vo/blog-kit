# Releases and Versioning

This repository uses Release Please to manage package versioning and
release pull requests for the publishable packages in the monorepo.

## Current Scope

Release Please currently tracks these packages:

- `blog-kit`
- `blog-kit-core`
- `blog-kit-editor`
- `blog-kit-local`
- `blog-kit-next`
- `blog-kit-supabase`

The current configuration lives in:

- `release-please-config.json`
- `.release-please-manifest.json`
- `.github/workflows/release-please.yml`

## Branch Strategy

The repository uses `main` as the only permanent branch.

Recommended flow:

1. create a short-lived branch from `main`
2. use `feature/*`, `fix/*`, or `chore/*` based on the change type
3. open a pull request back into `main`
4. prefer `squash and merge` for the final integration commit
5. let Release Please open or update the release pull request from
   changes merged into `main`

This keeps `main` stable, releasable, and easy to roll back with
`git revert`.

## Commit Expectations

Release Please reads Conventional Commit messages to decide release
types and changelog entries.

Use these commit types intentionally:

- `feat`: triggers a minor version bump
- `fix`: triggers a patch version bump
- `feat!` or `fix!`: triggers a major version bump
- `docs`, `chore`, `ci`, and `test`: usually do not trigger a release

If a change affects only internal workflow or documentation, keep the
commit type accurate instead of forcing a package release.

## How Release Please Works

When changes land on `main`, the workflow runs and compares commit
history against the manifest.

If releasable changes are detected, Release Please:

1. updates the relevant package versions
2. updates changelog entries for the affected packages
3. opens or updates a release pull request

When that release pull request is merged, the workflow tags the release
and updates the manifest for the next cycle.

## Current Limitations

Release Please is configured for versioning and release PR automation.

Package publication is handled by a separate workflow:

- `.github/workflows/publish-npm.yml`

When a GitHub release is published from the Release Please flow, that
workflow installs the workspace, validates it, and publishes only the
package versions that do not already exist on npm.

## Maintainer Checklist

Before merging releaseable changes into `main`:

- confirm CI is green
- confirm package docs match the shipped API
- confirm release-worthy commits use correct Conventional Commit types
- confirm no accidental breaking change lacks a `!` marker

Before merging a Release Please PR:

- review the proposed version bumps
- review generated changelog entries
- confirm only intended packages are included in the release
- confirm the repository secret `NPM_TOKEN` is configured

Before enabling automated npm publishing:

- create a repository secret named `NPM_TOKEN`
- ensure the token can publish the `blog-kit*` packages
- keep GitHub release creation enabled in the Release Please flow

## Future Work

Likely next improvements:

- prepublish validation for each package
- clearer package ownership and release criteria
- contributor guidance for multi-package changes
