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

## Project Areas

- `packages/core`: contracts, domain, and pure utilities
- `packages/adapter-supabase`: Supabase integration
- `packages/adapter-next`: Next.js integration
- `apps/starter`: adoption reference app
