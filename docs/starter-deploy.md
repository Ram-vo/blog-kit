# Starter Deployment

The starter supports two deployment targets:

- runtime mode for local development or app hosting with a real server
- static demo mode for GitHub Pages

## Runtime Mode

Use runtime mode when you want:

- optional Supabase-backed content
- the same behavior as local development
- a deploy target such as Vercel, Netlify, or Cloudflare Pages

Run it locally with:

```bash
pnpm --dir apps/starter dev
```

Build it normally with:

```bash
pnpm --dir apps/starter build
```

In this mode the app can use:

- sample content
- Supabase-backed content when the required environment variables exist
- local editor routes backed by filesystem persistence

## Static Demo Mode

Use static demo mode when you want:

- a public package website on GitHub Pages
- a no-backend demo anyone can open in the browser
- a deterministic build based on in-repo sample content

Run the static build with:

```bash
pnpm --dir apps/starter build:static
```

The static build forces:

- `STARTER_OUTPUT_MODE=export`
- `STARTER_DATA_MODE=sample`

That means the exported site never depends on Supabase.

The static build also hides:

- `/editor`
- `/editor/new`
- `/editor/[id]`
- `/api/editor/*`

Those routes require a server runtime and are intentionally omitted from
the exported demo.

## GitHub Pages

The repository includes a GitHub Pages workflow that builds the starter
in static mode and deploys the generated `out` directory.

The workflow sets:

- `STARTER_OUTPUT_MODE=export`
- `STARTER_DATA_MODE=sample`
- `STARTER_BASE_PATH=/<repo-name>`
- `STARTER_SITE_URL=https://<owner>.github.io/<repo-name>`

This keeps internal links, RSS output, and sitemap URLs aligned with the
final Pages URL.

## Tradeoffs

GitHub Pages is a good fit for:

- docs-like starter demos
- sample content
- package marketing pages

GitHub Pages is not the right deployment target for:

- runtime data fetching that depends on private credentials
- editorial dashboards
- auth-protected workflows

If you need a live Supabase-backed demo, deploy the starter to a runtime
host instead.
