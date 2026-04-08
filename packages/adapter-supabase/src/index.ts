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

export interface SupabaseQueryBuilderLike {
  select(query: string, options?: { count?: "exact" | "planned" | "estimated" }): SupabaseQueryBuilderLike;
  eq(column: string, value: unknown): SupabaseQueryBuilderLike;
  contains(column: string, value: unknown): SupabaseQueryBuilderLike;
  order(column: string, options?: { ascending?: boolean }): SupabaseQueryBuilderLike;
  range(from: number, to: number): Promise<{ data: unknown[]; error: { message: string } | null; count: number | null }>;
  single(): Promise<{ data: unknown; error: { message: string } | null }>;
  insert(value: unknown): SupabaseMutationBuilderLike;
  update(value: unknown): SupabaseMutationBuilderLike;
  delete(): SupabaseMutationBuilderLike;
}

export interface SupabaseMutationBuilderLike {
  eq(column: string, value: unknown): SupabaseMutationBuilderLike;
  select(query?: string): SupabaseMutationBuilderLike;
  single(): Promise<{ data: unknown; error: { message: string } | null }>;
}

export interface SupabaseClientLike {
  from(table: string): SupabaseQueryBuilderLike;
}

type SocialLinksRecord = Partial<Record<"linkedin" | "x" | "facebook" | "instagram" | "github", string>>;

type AuthorRow = {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  social_links?: SocialLinksRecord | null;
  created_at: string;
  updated_at: string;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
};

type PostRow = {
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

export interface SupabaseAdapterOptions {
  client: SupabaseClientLike;
}

type ListResult = {
  data: unknown[];
  error: { message: string } | null;
  count?: number | null;
};

type MutationResult = {
  data: unknown;
  error: { message: string } | null;
};

function toErrorMessage(error: { message: string } | null | undefined, fallback: string): string {
  return error?.message ?? fallback;
}

async function runListQuery(builder: unknown): Promise<ListResult> {
  return builder as Promise<ListResult>;
}

async function runMutation(builder: unknown): Promise<MutationResult> {
  return builder as Promise<MutationResult>;
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

function mapPostInput(post: Partial<Omit<Post, "id" | "createdAt" | "updatedAt">>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

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

    if (error || !data) {
      return null;
    }

    return mapPost(data as PostRow);
  }

  async getPostById(id: string): Promise<Post | null> {
    const { data, error } = await this.client
      .from("posts")
      .select("*, author:authors(*), categories(*)")
      .eq("id", id)
      .single();

    if (error || !data) {
      return null;
    }

    return mapPost(data as PostRow);
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
      throw new Error(`Supabase fetch failed: ${toErrorMessage(error, "Unknown error")}`);
    }

    return {
      posts: (data as PostRow[]).map(mapPost),
      total: count ?? 0,
      page,
      pageSize
    };
  }

  async listAllPublishedPosts(): Promise<Post[]> {
    const { data, error } = await runListQuery(
      this.client
        .from("posts")
        .select("*, author:authors(*), categories(*)")
        .eq("is_draft", false)
        .order("published_at", { ascending: false })
    );

    if (error) {
      throw new Error(`Supabase fetch failed: ${toErrorMessage(error, "Unknown error")}`);
    }

    return (data as PostRow[]).map(mapPost);
  }

  async createPost(post: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post> {
    const timestamp = new Date().toISOString();
    const insertPayload = {
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
      throw new Error(`Post creation failed: ${toErrorMessage(error, "Unknown error")}`);
    }

    if (post.categories.length > 0) {
      const links = post.categories.map((category) => ({
        post_id: (data as PostRow).id,
        category_id: category.id
      }));

      const { error: linkError } = await runMutation(
        this.client.from("post_categories").insert(links)
      );

      if (linkError) {
        throw new Error(`Post category linking failed: ${toErrorMessage(linkError, "Unknown error")}`);
      }
    }

    return (await this.getPostById((data as PostRow).id)) as Post;
  }

  async updatePost(
    id: string,
    post: Partial<Omit<Post, "id" | "createdAt" | "updatedAt">>
  ): Promise<Post> {
    const updatePayload = {
      ...mapPostInput(post),
      updated_at: new Date().toISOString()
    };

    const { error } = await runMutation(
      this.client
        .from("posts")
        .update(updatePayload)
        .eq("id", id)
    );

    if (error) {
      throw new Error(`Post update failed: ${toErrorMessage(error, "Unknown error")}`);
    }

    if (post.categories !== undefined) {
      const { error: deleteError } = await runMutation(
        this.client
          .from("post_categories")
          .delete()
          .eq("post_id", id)
      );

      if (deleteError) {
        throw new Error(`Category unlink failed: ${toErrorMessage(deleteError, "Unknown error")}`);
      }

      if (post.categories.length > 0) {
        const links = post.categories.map((category) => ({
          post_id: id,
          category_id: category.id
        }));

        const { error: linkError } = await runMutation(
          this.client.from("post_categories").insert(links)
        );

        if (linkError) {
          throw new Error(`Category linking failed: ${toErrorMessage(linkError, "Unknown error")}`);
        }
      }
    }

    return (await this.getPostById(id)) as Post;
  }

  async deletePost(id: string): Promise<void> {
    const { error } = await runMutation(
      this.client
        .from("posts")
        .delete()
        .eq("id", id)
    );

    if (error) {
      throw new Error(`Post deletion failed: ${toErrorMessage(error, "Unknown error")}`);
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

    if (error || !data) {
      return null;
    }

    return mapAuthor(data as AuthorRow);
  }

  async listAuthors(): Promise<Author[]> {
    const { data, error } = await runListQuery(
      this.client
        .from("authors")
        .select("*")
    );

    if (error) {
      throw new Error(`Supabase fetch failed: ${toErrorMessage(error, "Unknown error")}`);
    }

    return (data as AuthorRow[]).map(mapAuthor);
  }
}

export class SupabaseCategoryRepository implements CategoryRepository {
  constructor(private readonly client: SupabaseClientLike) {}

  async listCategories(): Promise<Category[]> {
    const { data, error } = await runListQuery(
      this.client
        .from("categories")
        .select("*")
    );

    if (error) {
      throw new Error(`Supabase fetch failed: ${toErrorMessage(error, "Unknown error")}`);
    }

    return (data as CategoryRow[]).map(mapCategory);
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await this.client
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return null;
    }

    return mapCategory(data as CategoryRow);
  }
}

export function createSupabaseAdapter(options: SupabaseAdapterOptions) {
  return {
    posts: new SupabasePostRepository(options.client),
    authors: new SupabaseAuthorRepository(options.client),
    categories: new SupabaseCategoryRepository(options.client)
  };
}
