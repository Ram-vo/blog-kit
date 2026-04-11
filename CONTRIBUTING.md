# Contributing

Thanks for contributing to `blog-kit`.

## Principles

- Keep `core` free of framework and provider dependencies.
- Add tests when changing contracts or business rules.
- Document any breaking change before proposing it for merge.
- Avoid mixing branding or one-off deployment needs into reusable packages.

## Initial Workflow

1. Open an issue or discussion for architecture changes.
2. Keep PRs small and focused.
3. Include migration notes when changing public contracts.
4. Use package-scoped Conventional Commits for release-worthy changes.
5. Update package READMEs and tests when changing public APIs.

## Project Areas

- `packages/core`: contracts, domain, and pure utilities
- `packages/adapter-supabase`: Supabase integration
- `packages/adapter-next`: Next.js integration
- `apps/starter`: adoption reference app

## Multi-Package Changes

If a change touches more than one publishable package:

- explain the package boundary in the PR description
- update the affected package READMEs
- add or update tests in the affected packages
- avoid mixing package API changes with unrelated starter-only work

For publishing and maintainer release expectations, see
[`docs/publishing.md`](./docs/publishing.md).
