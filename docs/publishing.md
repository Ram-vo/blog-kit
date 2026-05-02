# Publishing Setup

This document defines how `blog-kit` should be published, which
packages are intended for npm, and what maintainers should verify before
shipping a release.

The goal is to move from version tracking to an intentional publishing
workflow.

## Publishable Packages

The repository currently treats these packages as publishable targets:

- `@mrraymondvo/blog-kit`
- `blog-kit-core`
- `blog-kit-editor`
- `blog-kit-local`
- `blog-kit-next`
- `blog-kit-supabase`

These packages contain reusable domain logic, framework helpers, editor
primitives, local persistence, or provider adapters that other projects
can consume directly.

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

The workflow is intentionally idempotent. If a package version already
exists on npm, `scripts/publish-npm.mjs` skips that package and
continues with the remaining publishable packages.

The repository secret must be named:

- `NPM_TOKEN`

Use an npm automation-capable token that can publish every package listed
above.

## Package Metadata Expectations

Each publishable package should have:

- correct `name`
- stable `exports`
- stable `main`
- stable `types`
- a package README
- a changelog file
- an explicit publish access setting
- license metadata
- repository metadata
- homepage and bugs URLs

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

Before relying on automated publishing:

- create the repository secret `NPM_TOKEN`
- confirm the token can publish all intended `blog-kit*` packages and
  `@mrraymondvo/blog-kit`
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

## Clean Consumer Verification

After a release publishes, verify the packages from outside the
monorepo. This catches dependency, export, and runtime issues that
workspace builds can hide.

Create a temporary project and install the published packages:

```bash
mkdir /tmp/blog-kit-consumer-check
cd /tmp/blog-kit-consumer-check
pnpm init
pnpm add @mrraymondvo/blog-kit blog-kit-core blog-kit-next
pnpm add blog-kit-editor blog-kit-local blog-kit-supabase
pnpm add react react-dom @supabase/supabase-js
pnpm add -D typescript @types/node @types/react @types/react-dom
```

At minimum, verify:

- `@mrraymondvo/blog-kit`
- `@mrraymondvo/blog-kit/editor`
- `@mrraymondvo/blog-kit/local`
- `@mrraymondvo/blog-kit/supabase`
- `blog-kit-core`
- `blog-kit-next`
- `blog-kit-editor`
- `blog-kit-local`
- `blog-kit-supabase`

Use `moduleResolution: "Bundler"` when checking browser or Next.js
consumer behavior. If direct Node ESM execution is supported, verify
that package barrels resolve at runtime with Node as well.

## Troubleshooting

### `EOTP`

`EOTP` means npm required a one-time password. For unattended GitHub
Actions publishing, use an npm token that bypasses interactive 2FA for
publish operations, or migrate the package to npm Trusted Publishing.

### Provenance Repository Mismatch

If npm rejects provenance with a repository mismatch, check every
publishable `package.json`.

The package `repository.url` must match the GitHub repository from the
provenance statement:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/Ram-vo/blog-kit.git"
  }
}
```

### Package Name Too Similar

npm can reject unscoped package names that are too similar to existing
packages. The unscoped `blog-kit` package should remain out of scope
unless npm policy changes or the name becomes available.

Use `@mrraymondvo/blog-kit` as the public metapackage and keep the
package-specific modules available for explicit installs.

### Frozen Lockfile Failure

If CI fails with `ERR_PNPM_OUTDATED_LOCKFILE`, run `pnpm install` after
changing workspace package dependencies and commit the updated
`pnpm-lock.yaml`.

### Partial Publish Failure

The publish script skips versions that already exist on npm. If a run
publishes some packages and fails later, fix the failure, create a new
release if versions changed, and rerun the workflow. Already published
versions will be skipped.

## Future Automation

Likely next steps:

- add a repeatable consumer install check for published packages
- migrate to npm Trusted Publishing when package setup is ready
- document rollback and deprecation handling
