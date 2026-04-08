import type { Author, Category, Post } from "../domain/entities";
import type { AuthorProfile, BlogPost, BlogPostSummary, CategoryProfile } from "../domain/public-types";
import type { SiteConfig } from "../domain/site-config";
import { estimateReadingTime } from "./estimate-reading-time";

function toCategoryProfile(category: Category): CategoryProfile {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug
  };
}

function toAuthorProfile(author: Author, fallbackRole: string | null = null): AuthorProfile {
  return {
    id: author.id,
    name: author.fullName,
    headline: null,
    role: fallbackRole,
    bio: author.bio ?? "",
    avatar: author.avatarUrl ?? null,
    linkedin: author.socialLinks?.linkedin ?? null,
    twitter: author.socialLinks?.x ?? null,
    facebook: author.socialLinks?.facebook ?? null,
    instagram: author.socialLinks?.instagram ?? null,
    github: author.socialLinks?.github ?? null
  };
}

export function createDefaultAuthorProfile(site: SiteConfig): AuthorProfile | null {
  if (!site.defaultAuthorId && !site.defaultAuthorName) {
    return null;
  }

  return {
    id: site.defaultAuthorId ?? "site-team",
    name: site.defaultAuthorName ?? site.publisher.name,
    headline: null,
    role: null,
    bio: "",
    avatar: null,
    linkedin: null,
    twitter: null,
    facebook: null,
    instagram: null,
    github: null
  };
}

export function toBlogPostSummary(post: Post, site: SiteConfig): BlogPostSummary {
  const defaultAuthor = createDefaultAuthorProfile(site);
  const authorDetails = post.author ? toAuthorProfile(post.author) : defaultAuthor;

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    coverImage: post.coverImageUrl ?? null,
    categories: post.categories.map(toCategoryProfile),
    tags: post.tags,
    author: post.author?.id ?? post.authorId ?? site.defaultAuthorId ?? "site-team",
    authorDetails,
    publishedAt: post.publishedAt ?? post.createdAt,
    isDraft: post.isDraft,
    readingTime: estimateReadingTime(post.content ?? "")
  };
}

export function toBlogPost(post: Post, site: SiteConfig): BlogPost {
  return {
    ...toBlogPostSummary(post, site),
    content: post.content ?? ""
  };
}
