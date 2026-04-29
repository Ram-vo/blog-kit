import { describe, expect, it } from "vitest";
import {
  canDeletePost,
  canEditPost,
  canPublishPost,
  createPaginationMeta,
  estimateReadingTime,
  filterPostsByCategory,
  filterPostsByTag,
  hasEditorPermission,
  listRelatedPosts,
  paginateItems,
  toBlogPostSummary,
  validateEditorialPostInput
} from "./index";

const site = {
  name: "Blog Kit",
  description: "A modular blog toolkit.",
  siteUrl: "https://example.com",
  locale: "en-US",
  publisher: {
    name: "Blog Kit",
    url: "https://example.com"
  },
  defaultAuthorName: "Starter Team"
} as const;

const posts = [
  {
    id: "post-1",
    slug: "modular-publishing",
    title: "Modular publishing",
    excerpt: "A post about package boundaries.",
    categories: [{ id: "cat-1", name: "Architecture", slug: "architecture" }],
    tags: ["nextjs", "architecture"],
    content: "A modular system keeps product logic out of shared packages.",
    coverImageUrl: undefined,
    publishedAt: "2026-04-01T10:00:00.000Z",
    isDraft: false,
    authorId: "author-1",
    author: {
      id: "author-1",
      fullName: "Ramon Valdes",
      bio: "Writes about product architecture.",
      avatarUrl: undefined,
      socialLinks: undefined,
      createdAt: "2026-04-01T10:00:00.000Z",
      updatedAt: "2026-04-01T10:00:00.000Z"
    },
    createdAt: "2026-04-01T10:00:00.000Z",
    updatedAt: "2026-04-01T10:00:00.000Z"
  },
  {
    id: "post-2",
    slug: "adapter-boundaries",
    title: "Adapter boundaries",
    excerpt: "A post about isolating providers.",
    categories: [{ id: "cat-1", name: "Architecture", slug: "architecture" }],
    tags: ["architecture", "supabase"],
    content: "Adapters should isolate external dependencies and mapping rules.",
    coverImageUrl: undefined,
    publishedAt: "2026-04-02T10:00:00.000Z",
    isDraft: false,
    authorId: "author-1",
    author: {
      id: "author-1",
      fullName: "Ramon Valdes",
      bio: "Writes about product architecture.",
      avatarUrl: undefined,
      socialLinks: undefined,
      createdAt: "2026-04-01T10:00:00.000Z",
      updatedAt: "2026-04-01T10:00:00.000Z"
    },
    createdAt: "2026-04-02T10:00:00.000Z",
    updatedAt: "2026-04-02T10:00:00.000Z"
  },
  {
    id: "post-3",
    slug: "starter-integration",
    title: "Starter integration",
    excerpt: "A post about starter apps.",
    categories: [{ id: "cat-2", name: "Implementation", slug: "implementation" }],
    tags: ["starter", "nextjs"],
    content: "Starter apps help prove package ergonomics early.",
    coverImageUrl: undefined,
    publishedAt: "2026-04-03T10:00:00.000Z",
    isDraft: false,
    authorId: "author-2",
    author: {
      id: "author-2",
      fullName: "Starter Team",
      bio: "Builds reference apps.",
      avatarUrl: undefined,
      socialLinks: undefined,
      createdAt: "2026-04-03T10:00:00.000Z",
      updatedAt: "2026-04-03T10:00:00.000Z"
    },
    createdAt: "2026-04-03T10:00:00.000Z",
    updatedAt: "2026-04-03T10:00:00.000Z"
  }
];

describe("blog-kit-core public helpers", () => {
  it("builds pagination metadata and slices items consistently", () => {
    const result = paginateItems(posts, { page: 2, pageSize: 2 });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.slug).toBe("starter-integration");
    expect(result.meta).toEqual(
      createPaginationMeta(posts.length, { page: 2, pageSize: 2 })
    );
  });

  it("filters by tag and category slug", () => {
    expect(filterPostsByTag(posts, "nextjs")).toHaveLength(2);
    expect(filterPostsByCategory(posts, "architecture")).toHaveLength(2);
  });

  it("lists related posts from shared taxonomy", () => {
    const related = listRelatedPosts(posts, posts[0], 2);

    expect(related.map((post) => post.slug)).toContain("adapter-boundaries");
    expect(related.map((post) => post.slug)).not.toContain("modular-publishing");
  });

  it("creates a public summary with reading time details", () => {
    const summary = toBlogPostSummary(posts[0], site);

    expect(summary.slug).toBe("modular-publishing");
    expect(summary.authorDetails?.name).toBe("Ramon Valdes");
    expect(summary.readingTime).toBeGreaterThan(0);
    expect(estimateReadingTime(posts[0].content ?? "")).toBe(summary.readingTime);
  });

  it("evaluates editorial permissions independently from auth vendors", () => {
    const editorSession = {
      userId: "author-1",
      isAuthenticated: true,
      roles: ["editor"] as const,
      permissions: ["posts:edit:own", "posts:publish"] as const
    };

    expect(hasEditorPermission(editorSession, "posts:publish")).toBe(true);
    expect(canEditPost(editorSession, { authorId: "author-1" })).toBe(true);
    expect(canEditPost(editorSession, { authorId: "author-2" })).toBe(false);
    expect(canPublishPost(editorSession)).toBe(true);
    expect(canDeletePost(editorSession, { authorId: "author-1" })).toBe(false);
  });

  it("validates draft and publish editorial input consistently", () => {
    expect(
      validateEditorialPostInput(
        {
          title: "",
          slug: "Invalid Slug",
          excerpt: "",
          content: "",
          categoryIds: [],
          tags: [],
          coverImageUrl: "not-a-url",
          isDraft: true
        },
        "publish"
      )
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "title", severity: "error" }),
        expect.objectContaining({ field: "slug", severity: "error" }),
        expect.objectContaining({ field: "coverImageUrl", severity: "error" }),
        expect.objectContaining({ field: "excerpt", severity: "error" }),
        expect.objectContaining({ field: "content", severity: "error" }),
        expect.objectContaining({ field: "categoryIds", severity: "warning" })
      ])
    );
  });
});
