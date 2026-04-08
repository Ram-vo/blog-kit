import type { BlogPostSummary, Post } from "blog-kit-core";
import { toBlogPost, toBlogPostSummary } from "blog-kit-core";
import { samplePosts } from "./sample-posts";
import { siteConfig } from "./site-config";
import { createStarterAdapter, hasSupabaseConfig } from "./supabase";

function sampleSummaries(): BlogPostSummary[] {
  return samplePosts.map((post) => toBlogPostSummary(post, siteConfig));
}

export async function getBlogPostSummaries(): Promise<BlogPostSummary[]> {
  const adapter = createStarterAdapter();

  if (!adapter || !hasSupabaseConfig()) {
    return sampleSummaries();
  }

  try {
    const posts = await adapter.posts.listAllPublishedPosts();
    return posts.map((post) => toBlogPostSummary(post, siteConfig));
  } catch {
    return sampleSummaries();
  }
}

export async function getBlogPostBySlug(slug: string): Promise<Post | null> {
  const adapter = createStarterAdapter();

  if (!adapter || !hasSupabaseConfig()) {
    return samplePosts.find((post) => post.slug === slug) ?? null;
  }

  try {
    return await adapter.posts.getPostBySlug(slug);
  } catch {
    return samplePosts.find((post) => post.slug === slug) ?? null;
  }
}

export async function getRenderableBlogPost(slug: string) {
  const post = await getBlogPostBySlug(slug);
  return post ? toBlogPost(post, siteConfig) : null;
}

export async function getPublishedPosts(): Promise<Post[]> {
  const adapter = createStarterAdapter();

  if (!adapter || !hasSupabaseConfig()) {
    return samplePosts;
  }

  try {
    return await adapter.posts.listAllPublishedPosts();
  } catch {
    return samplePosts;
  }
}
