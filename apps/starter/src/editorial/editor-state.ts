import type { EditorialPost, EditorialPostInput } from "blog-kit-core";

export function createEmptyEditorialPost(): EditorialPostInput {
  return {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    categoryIds: [],
    tags: [],
    isDraft: true
  };
}

export function toEditorialPostInput(post: EditorialPost): EditorialPostInput {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    categoryIds: post.categoryIds,
    tags: post.tags,
    coverImageUrl: post.coverImageUrl,
    isDraft: post.isDraft,
    authorId: post.authorId,
    publishedAt: post.publishedAt
  };
}
