import type { Category, PaginatedPosts, Post, PostFilters, Author } from "./entities.js";
import type {
  EditorialCategoryInput,
  EditorialCategoryOption,
  EditorialPost,
  EditorialPostInput
} from "./editorial.js";

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

export interface EditorialRepository {
  listPosts(): Promise<EditorialPost[]>;
  getPostById(id: string): Promise<EditorialPost | null>;
  getPostBySlug(slug: string): Promise<EditorialPost | null>;
  createPost(post: EditorialPostInput): Promise<EditorialPost>;
  updatePost(id: string, post: Partial<EditorialPostInput>): Promise<EditorialPost>;
  deletePost(id: string): Promise<void>;
  listCategories(): Promise<EditorialCategoryOption[]>;
  createCategory?(category: EditorialCategoryInput): Promise<EditorialCategoryOption>;
}
