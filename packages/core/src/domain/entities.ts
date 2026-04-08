export type UserRole = "admin" | "editor" | "contributor";

export interface Author {
  id: string;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: Partial<Record<"linkedin" | "x" | "facebook" | "instagram" | "github", string>>;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  categories: Category[];
  tags: string[];
  content?: string;
  coverImageUrl?: string;
  publishedAt?: string;
  isDraft: boolean;
  authorId?: string;
  createdAt: string;
  updatedAt: string;
  author?: Author;
}

export interface PaginatedPosts {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PostFilters {
  categoryId?: string;
  categorySlug?: string;
  tag?: string;
  isDraft?: boolean;
}
