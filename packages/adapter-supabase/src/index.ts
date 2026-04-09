import type {
  Author,
  AuthorRepository,
  Category,
  CategoryRepository,
  PaginatedPosts,
  Post,
  PostFilters,
  PostRepository
} from "blog-kit-core";

type SocialLinksRecord = Partial<Record<"linkedin" | "x" | "facebook" | "instagram" | "github", string>>;

export type AuthorRow = {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  social_links?: SocialLinksRecord | null;
  created_at: string;
  updated_at: string;
};

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
};

export type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  tags: string[] | null;
  mdx_content: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  is_draft: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
  author?: AuthorRow | null;
  authors?: AuthorRow | null;
  categories?: CategoryRow[] | null;
};

export type PostCategoryRow = {
  post_id: string;
  category_id: string;
};

export type SupabaseTableRowMap = {
  posts: PostRow;
  authors: AuthorRow;
  categories: CategoryRow;
  post_categories: PostCategoryRow;
};

type SupabaseError = {
  message: string;
} | null;

type CountOption = {
  count?: "exact" | "planned" | "estimated";
};

type ListResult<T> = Promise<{
  data: T[];
  error: SupabaseError;
  count?: number | null;
}>;

type SingleResult<T> = Promise<{
  data: T | null;
  error: SupabaseError;
}>;

type MutationResult<T> = Promise<{
  data: T | null;
  error: SupabaseError;
}>;

type TableName = keyof SupabaseTableRowMap;

type InsertInput<T extends TableName> =
  T extends "post_categories" ? PostCategoryRow[] | PostCategoryRow : Partial<SupabaseTableRowMap[T]>;

export interface SupabaseMutationBuilderLike<T> {
  eq(column: string, value: unknown): SupabaseMutationBuilderLike<T>;
  select(query?: string): SupabaseMutationBuilderLike<T>;
  single(): SingleResult<T>;
  then<TResult1 = { data: T | null; error: SupabaseError }, TResult2 = never>(
    onfulfilled?: ((value: { data: T | null; error: SupabaseError }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2>;
}

export interface SupabaseQueryBuilderLike<T> {
  select(query: string, options?: CountOption): SupabaseQueryBuilderLike<T>;
  eq(column: string, value: unknown): SupabaseQueryBuilderLike<T>;
  contains(column: string, value: unknown): SupabaseQueryBuilderLike<T>;
  order(column: string, options?: { ascending?: boolean }): SupabaseQueryBuilderLike<T>;
  range(from: number, to: number): ListResult<T>;
  single(): SingleResult<T>;
  insert(value: InsertInput<TableName>): SupabaseMutationBuilderLike<T>;
  update(value: Partial<T>): SupabaseMutationBuilderLike<T>;
  delete(): SupabaseMutationBuilderLike<T>;
  then<TResult1 = { data: T[]; error: SupabaseError; count?: number | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T[]; error: SupabaseError; count?: number | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2>;
}

export interface SupabaseClientLike {
  from<T extends TableName>(table: T): SupabaseQueryBuilderLike<SupabaseTableRowMap[T]>;
}

export interface SupabaseAdapterOptions {
  client: SupabaseClientLike;
}

export type SupabaseAdapterErrorCode =
  | "NOT_FOUND"
  | "READ_FAILED"
  | "WRITE_FAILED"
  | "RELATION_WRITE_FAILED";

export class SupabaseAdapterError extends Error {
  constructor(
    public readonly code: SupabaseAdapterErrorCode,
    message: string,
    public readonly causeDetail?: string
  ) {
    super(message);
    this.name = "SupabaseAdapterError";
  }
}

function toErrorMessage(error: SupabaseError | undefined, fallback: string): string {
  return error?.message ?? fallback;
}

function createAdapterError(
  code: SupabaseAdapterErrorCode,
  message: string,
  error?: SupabaseError
) {
  return new SupabaseAdapterError(
    code,
    message,
    toErrorMessage(error, message)
  );
}

function mapAuthor(row: AuthorRow): Author {
  return {
    id: row.id,
    fullName: row.full_name ?? "Unknown author",
    bio: row.bio ?? "",
    avatarUrl: row.avatar_url ?? undefined,
    socialLinks: row.social_links ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug
  };
}

function mapPost(row: PostRow): Post {
  const expandedAuthor = row.author ?? row.authors ?? undefined;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? undefined,
    categories: row.categories?.map(mapCategory) ?? [],
    tags: row.tags ?? [],
    content: row.mdx_content ?? undefined,
    coverImageUrl: row.cover_image_url ?? undefined,
    publishedAt: row.published_at ?? undefined,
    isDraft: row.is_draft,
    authorId: row.author_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    author: expandedAuthor ? mapAuthor(expandedAuthor) : undefined
  };
}

function mapPostInput(
  post: Partial<Omit<Post, "id" | "createdAt" | "updatedAt">>
): Partial<PostRow> {
  const payload: Partial<PostRow> = {};

  if (post.slug !== undefined) payload.slug = post.slug;
  if (post.title !== undefined) payload.title = post.title;
  if (post.excerpt !== undefined) payload.excerpt = post.excerpt;
  if (post.tags !== undefined) payload.tags = post.tags;
  if (post.content !== undefined) payload.mdx_content = post.content;
  if (post.coverImageUrl !== undefined) payload.cover_image_url = post.coverImageUrl;
  if (post.publishedAt !== undefined) payload.published_at = post.publishedAt;
  if (post.isDraft !== undefined) payload.is_draft = post.isDraft;
  if (post.authorId !== undefined) payload.author_id = post.authorId;

  return payload;
}

export class SupabasePostRepository implements PostRepository {
  constructor(private readonly client: SupabaseClientLike) {}

  async getPostBySlug(slug: string): Promise<Post | null> {
    const { data, error } = await this.client
      .from("posts")
      .select("*, author:authors(*), categories(*)")
      .eq("slug", slug)
      .single();

    if (error?.message === "Not found" || !data) {
      return null;
    }

    if (error) {
      throw createAdapterError("READ_FAILED", "Failed to fetch post by slug", error);
    }

    return mapPost(data);
  }

  async getPostById(id: string): Promise<Post | null> {
    const { data, error } = await this.client
      .from("posts")
      .select("*, author:authors(*), categories(*)")
      .eq("id", id)
      .single();

    if (error?.message === "Not found" || !data) {
      return null;
    }

    if (error) {
      throw createAdapterError("READ_FAILED", "Failed to fetch post by id", error);
    }

    return mapPost(data);
  }

  async getPosts(page: number, pageSize: number, filters?: PostFilters): Promise<PaginatedPosts> {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = this.client
      .from("posts")
      .select("*, author:authors(*), categories(*)", { count: "exact" });

    if (filters?.categoryId) {
      query = this.client
        .from("posts")
        .select("*, author:authors(*), categories!inner(*)", { count: "exact" })
        .eq("categories.id", filters.categoryId);
    } else if (filters?.categorySlug) {
      query = this.client
        .from("posts")
        .select("*, author:authors(*), categories!inner(*)", { count: "exact" })
        .eq("categories.slug", filters.categorySlug);
    }

    if (filters?.tag) {
      query = query.contains("tags", [filters.tag]);
    }

    if (filters?.isDraft !== undefined) {
      query = query.eq("is_draft", filters.isDraft);
    }

    const { data, error, count } = await query
      .order("published_at", { ascending: false })
      .range(start, end);

    if (error) {
      throw createAdapterError("READ_FAILED", "Failed to fetch posts", error);
    }

    return {
      posts: data.map(mapPost),
      total: count ?? 0,
      page,
      pageSize
    };
  }

  async listAllPublishedPosts(): Promise<Post[]> {
    const { data, error } = await this.client
      .from("posts")
      .select("*, author:authors(*), categories(*)")
      .eq("is_draft", false)
      .order("published_at", { ascending: false });

    if (error) {
      throw createAdapterError("READ_FAILED", "Failed to fetch published posts", error);
    }

    return data.map(mapPost);
  }

  async createPost(post: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post> {
    const timestamp = new Date().toISOString();
    const insertPayload: Partial<PostRow> = {
      ...mapPostInput(post),
      created_at: timestamp,
      updated_at: timestamp
    };

    const { data, error } = await this.client
      .from("posts")
      .insert(insertPayload)
      .select()
      .single();

    if (error || !data) {
      throw createAdapterError("WRITE_FAILED", "Failed to create post", error);
    }

    if (post.categories.length > 0) {
      const links: PostCategoryRow[] = post.categories.map((category) => ({
        post_id: data.id,
        category_id: category.id
      }));

      const { error: linkError } = await this.client
        .from("post_categories")
        .insert(links);

      if (linkError) {
        throw createAdapterError(
          "RELATION_WRITE_FAILED",
          "Failed to link post categories",
          linkError
        );
      }
    }

    return (await this.getPostById(data.id)) as Post;
  }

  async updatePost(
    id: string,
    post: Partial<Omit<Post, "id" | "createdAt" | "updatedAt">>
  ): Promise<Post> {
    const updatePayload: Partial<PostRow> = {
      ...mapPostInput(post),
      updated_at: new Date().toISOString()
    };

    const { error } = await this.client
      .from("posts")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      throw createAdapterError("WRITE_FAILED", "Failed to update post", error);
    }

    if (post.categories !== undefined) {
      const { error: deleteError } = await this.client
        .from("post_categories")
        .delete()
        .eq("post_id", id);

      if (deleteError) {
        throw createAdapterError(
          "RELATION_WRITE_FAILED",
          "Failed to unlink post categories",
          deleteError
        );
      }

      if (post.categories.length > 0) {
        const links: PostCategoryRow[] = post.categories.map((category) => ({
          post_id: id,
          category_id: category.id
        }));

        const { error: linkError } = await this.client
          .from("post_categories")
          .insert(links);

        if (linkError) {
          throw createAdapterError(
            "RELATION_WRITE_FAILED",
            "Failed to relink post categories",
            linkError
          );
        }
      }
    }

    return (await this.getPostById(id)) as Post;
  }

  async deletePost(id: string): Promise<void> {
    const { error } = await this.client
      .from("posts")
      .delete()
      .eq("id", id);

    if (error) {
      throw createAdapterError("WRITE_FAILED", "Failed to delete post", error);
    }
  }
}

export class SupabaseAuthorRepository implements AuthorRepository {
  constructor(private readonly client: SupabaseClientLike) {}

  async getAuthorById(id: string): Promise<Author | null> {
    const { data, error } = await this.client
      .from("authors")
      .select("*")
      .eq("id", id)
      .single();

    if (error?.message === "Not found" || !data) {
      return null;
    }

    if (error) {
      throw createAdapterError("READ_FAILED", "Failed to fetch author by id", error);
    }

    return mapAuthor(data);
  }

  async listAuthors(): Promise<Author[]> {
    const { data, error } = await this.client
      .from("authors")
      .select("*");

    if (error) {
      throw createAdapterError("READ_FAILED", "Failed to list authors", error);
    }

    return data.map(mapAuthor);
  }
}

export class SupabaseCategoryRepository implements CategoryRepository {
  constructor(private readonly client: SupabaseClientLike) {}

  async listCategories(): Promise<Category[]> {
    const { data, error } = await this.client
      .from("categories")
      .select("*");

    if (error) {
      throw createAdapterError("READ_FAILED", "Failed to list categories", error);
    }

    return data.map(mapCategory);
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await this.client
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error?.message === "Not found" || !data) {
      return null;
    }

    if (error) {
      throw createAdapterError("READ_FAILED", "Failed to fetch category by slug", error);
    }

    return mapCategory(data);
  }
}

export function createSupabaseAdapter(options: SupabaseAdapterOptions) {
  return {
    posts: new SupabasePostRepository(options.client),
    authors: new SupabaseAuthorRepository(options.client),
    categories: new SupabaseCategoryRepository(options.client)
  };
}
