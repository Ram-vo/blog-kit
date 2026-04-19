import type {
  BlogPostSummary,
  EditorialCategoryOption,
  EditorialPost,
  Post
} from "blog-kit-core";
import { toBlogPost, toBlogPostSummary } from "blog-kit-core";
import { unstable_noStore as noStore } from "next/cache";
import {
  createStarterEditorialRepository,
  getStarterEditorialSource
} from "./editorial/provider";
import { samplePosts } from "./sample-posts";
import { isStaticExportMode, shouldUseSampleContent } from "./runtime-config";
import { siteConfig } from "./site-config";
import { createStarterAdapter, hasSupabaseConfig } from "./supabase";

function sampleSummaries(): BlogPostSummary[] {
  return samplePosts.map((post) => toBlogPostSummary(post, siteConfig));
}

function disableCacheForRuntimeReads() {
  if (!isStaticExportMode()) {
    noStore();
  }
}

function mapEditorialPostToPost(
  post: EditorialPost,
  categories: readonly EditorialCategoryOption[]
): Post {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    tags: post.tags,
    coverImageUrl: post.coverImageUrl,
    publishedAt: post.publishedAt,
    isDraft: post.isDraft,
    authorId: post.authorId,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    categories: post.categoryIds
      .map((categoryId) => categories.find((category) => category.id === categoryId))
      .filter((category): category is EditorialCategoryOption => Boolean(category))
  };
}

async function getLocalPublishedPosts(): Promise<Post[]> {
  const { editorial } = createStarterEditorialRepository();
  const [posts, categories] = await Promise.all([
    editorial.listPosts(),
    editorial.listCategories()
  ]);

  return posts
    .filter((post) => !post.isDraft)
    .map((post) => mapEditorialPostToPost(post, categories));
}

async function getLocalPostBySlug(slug: string): Promise<Post | null> {
  const { editorial } = createStarterEditorialRepository();
  const [post, categories] = await Promise.all([
    editorial.getPostBySlug(slug),
    editorial.listCategories()
  ]);

  return post ? mapEditorialPostToPost(post, categories) : null;
}

export async function getBlogPostSummaries(): Promise<BlogPostSummary[]> {
  disableCacheForRuntimeReads();

  if (shouldUseSampleContent()) {
    return sampleSummaries();
  }

  if (getStarterEditorialSource() === "supabase" && hasSupabaseConfig()) {
    const adapter = createStarterAdapter();

    if (!adapter) {
      return sampleSummaries();
    }

    try {
      const posts = await adapter.posts.listAllPublishedPosts();
      return posts.map((post) => toBlogPostSummary(post, siteConfig));
    } catch {
      return sampleSummaries();
    }
  }

  try {
    const posts = await getLocalPublishedPosts();
    return posts.map((post) => toBlogPostSummary(post, siteConfig));
  } catch {
    return sampleSummaries();
  }
}

export async function getBlogPostBySlug(slug: string): Promise<Post | null> {
  disableCacheForRuntimeReads();

  if (shouldUseSampleContent()) {
    return samplePosts.find((post) => post.slug === slug) ?? null;
  }

  if (getStarterEditorialSource() === "supabase" && hasSupabaseConfig()) {
    const adapter = createStarterAdapter();

    if (!adapter) {
      return samplePosts.find((post) => post.slug === slug) ?? null;
    }

    try {
      return await adapter.posts.getPostBySlug(slug);
    } catch {
      return samplePosts.find((post) => post.slug === slug) ?? null;
    }
  }

  try {
    return await getLocalPostBySlug(slug);
  } catch {
    return samplePosts.find((post) => post.slug === slug) ?? null;
  }
}

export async function getRenderableBlogPost(slug: string) {
  const post = await getBlogPostBySlug(slug);
  return post ? toBlogPost(post, siteConfig) : null;
}

export async function getPublishedPosts(): Promise<Post[]> {
  disableCacheForRuntimeReads();

  if (shouldUseSampleContent()) {
    return samplePosts;
  }

  if (getStarterEditorialSource() === "supabase" && hasSupabaseConfig()) {
    const adapter = createStarterAdapter();

    if (!adapter) {
      return samplePosts;
    }

    try {
      return await adapter.posts.listAllPublishedPosts();
    } catch {
      return samplePosts;
    }
  }

  try {
    return await getLocalPublishedPosts();
  } catch {
    return samplePosts;
  }
}
