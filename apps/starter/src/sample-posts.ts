import type { Post } from "blog-kit-core";

export const samplePosts: Post[] = [
  {
    id: "building-a-modular-blog-toolkit",
    slug: "building-a-modular-blog-toolkit",
    title: "Building a modular blog toolkit",
    excerpt:
      "Separate domain rules, provider adapters, and app composition so the blog can survive product changes.",
    categories: [{ id: "architecture", name: "Architecture", slug: "architecture" }],
    tags: ["architecture", "modularity", "product-design"],
    content: `Most internal blog systems start as one app-specific implementation.

That usually feels efficient at the beginning, but it creates three problems later:

- domain rules get buried inside route files and UI components
- provider logic leaks into the rest of the app
- replacing the shell or data source becomes a rewrite instead of an integration task

\`blog-kit\` exists to avoid that trap.

## The boundary that matters

The project is built around one simple split:

- \`blog-kit-core\` owns shared types, contracts, and pure helpers
- provider packages own persistence and external integration details
- app code owns composition, branding, and runtime decisions

That means the blog can change shape without collapsing into one big framework-specific module.

## Why the core cannot know about the app

The core package should only answer questions like:

- what is a post
- what is a category
- what are the repository contracts
- how do we derive summaries, metadata inputs, or pagination state

## The practical takeaway

If you can swap the shell, theme, or provider without touching the core contracts, the package boundaries are doing their job.`,
    isDraft: false,
    authorId: "starter-team",
    createdAt: "2026-04-01T10:00:00.000Z",
    updatedAt: "2026-04-19T21:40:00.000Z",
    publishedAt: "2026-04-01T10:00:00.000Z"
  },
  {
    id: "why-adapters-matter",
    slug: "why-adapters-matter",
    title: "Why adapters matter",
    excerpt:
      "Adapters keep provider logic isolated so storage and auth choices do not leak into the rest of the system.",
    categories: [
      { id: "architecture", name: "Architecture", slug: "architecture" },
      { id: "implementation", name: "Implementation", slug: "implementation" }
    ],
    tags: ["adapters", "supabase", "persistence"],
    content: `Adapters are where infrastructure becomes explicit.

They translate between public domain contracts and the behavior of a specific backend.

## What an adapter should own

In \`blog-kit-supabase\`, the adapter is responsible for:

- mapping Supabase rows into \`blog-kit-core\` types
- reading and writing related categories
- translating editor writes into provider-specific payloads
- turning provider failures into adapter-level errors
- resolving a generic editor session from Supabase Auth when needed

## What this protects you from

Without adapters, provider decisions spread everywhere:

- page components know table shapes
- editor flows know database field names
- auth wiring leaks into view code
- changing storage means rewriting multiple layers`,
    isDraft: false,
    authorId: "starter-team",
    createdAt: "2026-04-03T10:00:00.000Z",
    updatedAt: "2026-04-19T21:40:00.000Z",
    publishedAt: "2026-04-03T10:00:00.000Z"
  },
  {
    id: "starter-apps-as-documentation",
    slug: "starter-apps-as-documentation",
    title: "Starter apps as documentation",
    excerpt:
      "A runnable app often explains a package better than a long README because users can inspect real flows instead of imagined ones.",
    categories: [
      { id: "implementation", name: "Implementation", slug: "implementation" },
      { id: "publishing", name: "Publishing", slug: "publishing" }
    ],
    tags: ["starter", "docs", "editor"],
    content: `A reference app is the fastest way to prove that a package is actually usable.

It turns architecture into something you can click, edit, save, and inspect instead of a diagram that only exists in the README.

## What the starter is proving

The starter already proves several important boundaries:

- the public blog can read from either local content or Supabase
- the editor UI stays provider-agnostic
- runtime wiring chooses the backend without rewriting the editor
- the same content can serve as both demo material and product docs

## Why the posts should become documentation

Turning starter posts into living docs gives the project one content surface instead of splitting knowledge across multiple places.`,
    isDraft: false,
    authorId: "starter-team",
    createdAt: "2026-04-05T10:00:00.000Z",
    updatedAt: "2026-04-19T21:40:00.000Z",
    publishedAt: "2026-04-05T10:00:00.000Z"
  },
  {
    id: "inside-blog-kit-core",
    slug: "inside-blog-kit-core",
    title: "Inside blog-kit-core",
    excerpt:
      "The core package defines the vocabulary of the system so apps and adapters can evolve without breaking the domain.",
    categories: [{ id: "architecture", name: "Architecture", slug: "architecture" }],
    tags: ["core", "domain", "contracts"],
    content: `\`blog-kit-core\` is the package that gives the rest of the system a shared language.

It defines posts, categories, authors, repository contracts, editorial permissions, and public-facing transformation helpers.

## What belongs in the core

The core package is where you want logic that should survive product and provider changes.

Examples:

- \`Post\` and \`Category\` types
- pagination helpers
- public summary helpers
- editorial repository contracts
- permission abstractions like \`posts:publish\``,
    isDraft: false,
    authorId: "starter-team",
    createdAt: "2026-04-07T10:00:00.000Z",
    updatedAt: "2026-04-19T21:40:00.000Z",
    publishedAt: "2026-04-07T10:00:00.000Z"
  },
  {
    id: "nextjs-publishing-helpers",
    slug: "nextjs-publishing-helpers",
    title: "Next.js publishing helpers",
    excerpt:
      "The Next.js package keeps metadata, RSS, sitemap, and structured data out of route files so host apps stay smaller.",
    categories: [
      { id: "implementation", name: "Implementation", slug: "implementation" },
      { id: "publishing", name: "Publishing", slug: "publishing" }
    ],
    tags: ["nextjs", "seo", "metadata"],
    content: `\`blog-kit-next\` exists because publishing apps repeat the same route logic over and over:

- article metadata
- canonical URLs
- RSS feed generation
- sitemap entries
- structured data for blog pages

## Why this is separate from the core

The core package should not know about canonical URL shapes, RSS XML, or Next.js metadata objects.

Those are framework and publishing concerns, not domain concepts.`,
    isDraft: false,
    authorId: "starter-team",
    createdAt: "2026-04-09T10:00:00.000Z",
    updatedAt: "2026-04-19T21:40:00.000Z",
    publishedAt: "2026-04-09T10:00:00.000Z"
  },
  {
    id: "choosing-between-local-and-supabase",
    slug: "choosing-between-local-and-supabase",
    title: "Choosing between local and Supabase",
    excerpt:
      "The starter can run against local MDX files or Supabase, and the right choice depends on what you are validating.",
    categories: [{ id: "implementation", name: "Implementation", slug: "implementation" }],
    tags: ["local", "supabase", "runtime"],
    content: `The starter supports two runtime editorial backends:

- local filesystem content
- Supabase-backed content

## When local mode is the right tool

Use local mode when you want to validate content structure, editor ergonomics, package boundaries, and filesystem-backed workflows.

## When Supabase mode is the right tool

Use Supabase mode when you want to validate provider-backed reads and writes, real relational data, and a future production integration path.`,
    isDraft: false,
    authorId: "starter-team",
    createdAt: "2026-04-11T10:00:00.000Z",
    updatedAt: "2026-04-19T21:40:00.000Z",
    publishedAt: "2026-04-11T10:00:00.000Z"
  },
  {
    id: "editorial-workflows-with-blog-kit",
    slug: "editorial-workflows-with-blog-kit",
    title: "Editorial workflows with blog-kit",
    excerpt:
      "The editor is reusable because the app owns auth, persistence, validation, and media uploads.",
    categories: [{ id: "implementation", name: "Implementation", slug: "implementation" }],
    tags: ["editor", "auth", "media"],
    content: `\`blog-kit-editor\` is intentionally not a CMS.

It is a reusable editing surface that the host app wires into its own runtime decisions.

## What the editor owns

The editor package owns broadly reusable pieces:

- MDX content editing
- post metadata fields
- category selection
- draft, publish, and delete actions
- validation display
- save-state feedback
- image upload entry points

## What the host app owns

The host app owns product-specific decisions:

- who can open the editor
- which backend persists content
- how auth sessions map to editorial permissions
- where uploaded media is stored
- what dashboard shell wraps the editor

## Why this matters

If you can change persistence, auth, and layout without rewriting the editing component, the package boundary is strong enough for real adoption.`,
    isDraft: false,
    authorId: "starter-team",
    createdAt: "2026-04-15T10:00:00.000Z",
    updatedAt: "2026-05-01T10:00:00.000Z",
    publishedAt: "2026-04-15T10:00:00.000Z"
  },
  {
    id: "exporting-the-starter-as-a-public-demo",
    slug: "exporting-the-starter-as-a-public-demo",
    title: "Exporting the starter as a public demo",
    excerpt:
      "The starter can double as a package website and a live product demo by exporting a static version for GitHub Pages.",
    categories: [{ id: "publishing", name: "Publishing", slug: "publishing" }],
    tags: ["static", "github-pages", "deployment"],
    content: `One of the most useful things the starter can do is act as the public website for the package.

That is why the project supports a static export path for GitHub Pages.

## What is excluded on purpose

Static hosting is a poor fit for runtime editorial features.

So the export path excludes:

- editor routes
- editor API routes

That keeps the public demo compatible with GitHub Pages while the normal runtime app keeps the editable workflow.`,
    isDraft: false,
    authorId: "starter-team",
    createdAt: "2026-04-13T10:00:00.000Z",
    updatedAt: "2026-04-19T21:40:00.000Z",
    publishedAt: "2026-04-13T10:00:00.000Z"
  }
];
