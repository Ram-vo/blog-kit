import type { Post } from "../domain/entities";

export function listRelatedPosts(posts: Post[], currentPost: Post, limit = 3): Post[] {
  return posts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      let score = 0;

      for (const category of post.categories) {
        if (currentPost.categories.some((current) => current.id === category.id)) {
          score += 3;
        }
      }

      for (const tag of post.tags) {
        if (currentPost.tags.includes(tag)) {
          score += 1;
        }
      }

      return { post, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((entry) => entry.post);
}
