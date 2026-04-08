import type { Author, Category, PaginatedPosts, Post, PostFilters } from "./entities";

export interface PostRepository {
  getPostBySlug(slug: string): Promise<Post | null>;
  getPostById(id: string): Promise<Post | null>;
  getPosts(page: number, pageSize: number, filters?: PostFilters): Promise<PaginatedPosts>;
  listAllPublishedPosts(): Promise<Post[]>;
  createPost(post: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post>;
  updatePost(id: string, post: Partial<Omit<Post, "id" | "createdAt" | "updatedAt">>): Promise<Post>;
  deletePost(id: string): Promise<void>;
}

export interface AuthorRepository {
  getAuthorById(id: string): Promise<Author | null>;
  listAuthors(): Promise<Author[]>;
}

export interface CategoryRepository {
  listCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | null>;
}
