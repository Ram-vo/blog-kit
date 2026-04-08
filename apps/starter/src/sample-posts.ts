import type { Post } from "blog-kit-core";

export const samplePosts: Post[] = [
  {
    id: "post-1",
    slug: "building-a-modular-blog-toolkit",
    title: "Building a modular blog toolkit",
    excerpt:
      "Separate your domain, adapters, and app shell so the blog can survive product changes.",
    categories: [
      {
        id: "cat-architecture",
        name: "Architecture",
        slug: "architecture"
      }
    ],
    tags: ["architecture", "tooling", "publishing"],
    content:
      "This starter uses sample content so teams can validate the package boundaries before wiring a CMS.\n\nThe important part is that the app consumes public package APIs rather than copying business logic into the UI layer.",
    isDraft: false,
    authorId: "starter-team",
    createdAt: "2026-04-09T10:00:00.000Z",
    updatedAt: "2026-04-09T10:00:00.000Z",
    publishedAt: "2026-04-09T10:00:00.000Z"
  },
  {
    id: "post-2",
    slug: "why-adapters-matter",
    title: "Why adapters matter",
    excerpt:
      "Provider integrations should be replaceable so the project stays useful outside one stack.",
    categories: [
      {
        id: "cat-platform",
        name: "Platform",
        slug: "platform"
      }
    ],
    tags: ["supabase", "nextjs", "integration"],
    content:
      "Adapters isolate infrastructure decisions. That keeps the core package small, testable, and easier to adopt.",
    isDraft: false,
    authorId: "starter-team",
    createdAt: "2026-04-08T10:00:00.000Z",
    updatedAt: "2026-04-08T10:00:00.000Z",
    publishedAt: "2026-04-08T10:00:00.000Z"
  },
  {
    id: "post-3",
    slug: "starter-apps-as-documentation",
    title: "Starter apps as documentation",
    excerpt:
      "A runnable example often teaches integration faster than a long README ever will.",
    categories: [
      {
        id: "cat-docs",
        name: "Docs",
        slug: "docs"
      }
    ],
    tags: ["docs", "examples"],
    content:
      "A starter app should be small enough to understand in one sitting, but complete enough to prove the architecture works.",
    isDraft: false,
    authorId: "starter-team",
    createdAt: "2026-04-07T10:00:00.000Z",
    updatedAt: "2026-04-07T10:00:00.000Z",
    publishedAt: "2026-04-07T10:00:00.000Z"
  }
];
