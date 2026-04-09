# Releases and Versioning

This repository uses Release Please to manage package versioning and
release pull requests for the publishable packages in the monorepo.

## Current Scope

Release Please currently tracks these packages:

- `blog-kit-core`
- `blog-kit-next`
- `blog-kit-supabase`

The current configuration lives in:

- `release-please-config.json`
- `.release-please-manifest.json`
- `.github/workflows/release-please.yml`

## Branch Strategy

The repository currently uses a simple two-branch flow:

- `develop` is the active integration branch for ongoing work
- `main` is the release branch observed by Release Please

Recommended flow:

1. open feature branches from `develop`
2. merge completed work into `develop`
3. merge reviewed batches from `develop` into `main`
4. let Release Please open or update the release pull request from
   changes merged into `main`

This keeps `main` focused on releasable history while allowing `develop`
to absorb ongoing changes more freely.

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

Release Please is configured only for versioning and release PR
automation.

It does not yet:

- publish packages to npm
- build release artifacts
- validate package contents before publish

Package publishing should remain a deliberate manual step until the
package surfaces are more stable.

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

## Future Work

Likely next improvements:

- npm publishing automation
- prepublish validation for each package
- clearer package ownership and release criteria
- contributor guidance for multi-package changes
