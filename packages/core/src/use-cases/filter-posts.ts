import type { Post } from "../domain/entities.js";

export function filterPostsByCategory(posts: Post[], categorySlug: string): Post[] {
  return posts.filter((post) => post.categories.some((category) => category.slug === categorySlug));
}

export function filterPostsByTag(posts: Post[], tag: string): Post[] {
  return posts.filter((post) => post.tags.includes(tag));
}
