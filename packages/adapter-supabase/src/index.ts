import type {
  Author,
  AuthorRepository,
  Category,
  CategoryRepository,
  EditorPermission,
  EditorSession,
  EditorialCategoryInput,
  EditorialCategoryOption,
  EditorialMediaRepository,
  EditorialMediaUpload,
  EditorialPost,
  EditorialPostInput,
  EditorialRepository,
  PaginatedPosts,
  Post,
  PostFilters,
  PostRepository,
  UserRole
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
  storage?: SupabaseStorageLike;
}

export interface SupabaseStorageBucketLike {
  upload(
    path: string,
    body: Uint8Array,
    options?: { contentType?: string; upsert?: boolean }
  ): Promise<{
    data: { path: string } | null;
    error: SupabaseError;
  }>;
  getPublicUrl(path: string): {
    data: { publicUrl: string };
  };
}

export interface SupabaseStorageLike {
  from(bucket: string): SupabaseStorageBucketLike;
}

export interface SupabaseAdapterOptions {
  client: SupabaseClientLike;
  mediaBucket?: string;
  mediaPathPrefix?: string;
}

export interface SupabaseAuthUserLike {
  id: string;
  email?: string | null;
  role?: string | null;
  app_metadata?: Record<string, unknown> | null;
  user_metadata?: Record<string, unknown> | null;
}

export interface SupabaseAuthClientLike {
  auth: {
    getUser(): Promise<{
      data: { user: SupabaseAuthUserLike | null };
      error: SupabaseError;
    }>;
  };
}

export interface SupabaseEditorSessionResolverOptions {
  client: SupabaseAuthClientLike;
  mapRoles?: (user: SupabaseAuthUserLike) => readonly UserRole[];
  mapPermissions?: (
    user: SupabaseAuthUserLike,
    roles: readonly UserRole[]
  ) => readonly EditorPermission[];
  getDisplayName?: (user: SupabaseAuthUserLike) => string | undefined;
}

export type SupabaseAdapterErrorCode =
  | "NOT_FOUND"
  | "READ_FAILED"
  | "WRITE_FAILED"
  | "RELATION_WRITE_FAILED"
  | "STORAGE_UNAVAILABLE";

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

function createUploadId() {
  return globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
}

function sanitizeStorageFileName(fileName: string) {
  const extension = fileName.includes(".")
    ? `.${fileName.split(".").pop()?.toLowerCase() ?? "bin"}`
    : "";
  const baseName = fileName
    .slice(0, fileName.length - extension.length)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${baseName || "upload"}-${createUploadId()}${extension}`;
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

function mapCategoryToEditorialOption(
  category: Category
): EditorialCategoryOption {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug
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

function mapPostToEditorial(post: Post): EditorialPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content ?? "",
    categoryIds: post.categories.map((category) => category.id),
    tags: post.tags,
    coverImageUrl: post.coverImageUrl,
    isDraft: post.isDraft,
    authorId: post.authorId,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
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

async function listAllCategories(
  client: SupabaseClientLike
): Promise<Category[]> {
  const repository = new SupabaseCategoryRepository(client);
  return repository.listCategories();
}

async function resolveCategoriesByIds(
  client: SupabaseClientLike,
  categoryIds: readonly string[]
): Promise<Category[]> {
  if (categoryIds.length === 0) {
    return [];
  }

  const categories = await listAllCategories(client);
  return categories.filter((category) => categoryIds.includes(category.id));
}

function readMetadataArray(
  metadata: Record<string, unknown> | null | undefined,
  key: string
): string[] {
  const value = metadata?.[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function normalizeUserRole(value: string): UserRole | null {
  switch (value) {
    case "admin":
    case "editor":
    case "contributor":
      return value;
    default:
      return null;
  }
}

function defaultRolesFromUser(
  user: SupabaseAuthUserLike
): readonly UserRole[] {
  const roles = [
    ...readMetadataArray(user.app_metadata, "roles"),
    ...readMetadataArray(user.user_metadata, "roles"),
    ...(user.role ? [user.role] : [])
  ]
    .map(normalizeUserRole)
    .filter((role): role is UserRole => Boolean(role));

  return roles.length > 0 ? Array.from(new Set(roles)) : ["contributor"];
}

function defaultPermissionsFromRoles(
  roles: readonly UserRole[]
): readonly EditorPermission[] {
  const permissions = new Set<EditorPermission>();

  if (roles.includes("admin")) {
    permissions.add("posts:create");
    permissions.add("posts:edit:any");
    permissions.add("posts:publish");
    permissions.add("posts:delete:any");
    permissions.add("categories:manage");
    permissions.add("media:upload");
  }

  if (roles.includes("editor")) {
    permissions.add("posts:create");
    permissions.add("posts:edit:any");
    permissions.add("posts:publish");
    permissions.add("categories:manage");
    permissions.add("media:upload");
  }

  if (roles.includes("contributor")) {
    permissions.add("posts:create");
    permissions.add("posts:edit:own");
  }

  return Array.from(permissions);
}

function defaultDisplayName(user: SupabaseAuthUserLike) {
  const userMetadata = user.user_metadata ?? {};
  const candidates = [
    userMetadata["display_name"],
    userMetadata["full_name"],
    user.email
  ];

  return candidates.find(
    (value): value is string => typeof value === "string" && value.length > 0
  );
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

export class SupabaseEditorialRepository implements EditorialRepository {
  constructor(private readonly client: SupabaseClientLike) {}

  async listPosts(): Promise<EditorialPost[]> {
    const { posts } = await new SupabasePostRepository(this.client).getPosts(
      1,
      100
    );

    return posts.map(mapPostToEditorial);
  }

  async getPostById(id: string): Promise<EditorialPost | null> {
    const post = await new SupabasePostRepository(this.client).getPostById(id);
    return post ? mapPostToEditorial(post) : null;
  }

  async getPostBySlug(slug: string): Promise<EditorialPost | null> {
    const post = await new SupabasePostRepository(this.client).getPostBySlug(
      slug
    );
    return post ? mapPostToEditorial(post) : null;
  }

  async createPost(post: EditorialPostInput): Promise<EditorialPost> {
    const categories = await resolveCategoriesByIds(
      this.client,
      post.categoryIds
    );

    const created = await new SupabasePostRepository(this.client).createPost({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      categories,
      tags: post.tags,
      content: post.content,
      coverImageUrl: post.coverImageUrl,
      publishedAt: post.publishedAt,
      isDraft: post.isDraft,
      authorId: post.authorId
    });

    return mapPostToEditorial(created);
  }

  async updatePost(
    id: string,
    post: Partial<EditorialPostInput>
  ): Promise<EditorialPost> {
    const categories = post.categoryIds
      ? await resolveCategoriesByIds(this.client, post.categoryIds)
      : undefined;

    const updated = await new SupabasePostRepository(this.client).updatePost(
      id,
      {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        categories,
        tags: post.tags,
        content: post.content,
        coverImageUrl: post.coverImageUrl,
        publishedAt: post.publishedAt,
        isDraft: post.isDraft,
        authorId: post.authorId
      }
    );

    return mapPostToEditorial(updated);
  }

  async deletePost(id: string): Promise<void> {
    await new SupabasePostRepository(this.client).deletePost(id);
  }

  async listCategories(): Promise<EditorialCategoryOption[]> {
    const categories = await listAllCategories(this.client);
    return categories.map(mapCategoryToEditorialOption);
  }

  async createCategory(
    category: EditorialCategoryInput
  ): Promise<EditorialCategoryOption> {
    const { data, error } = await this.client
      .from("categories")
      .insert({
        name: category.name,
        slug: category.slug
      })
      .select()
      .single();

    if (error || !data) {
      throw createAdapterError(
        "WRITE_FAILED",
        "Failed to create category",
        error
      );
    }

    return mapCategoryToEditorialOption(mapCategory(data));
  }
}

export class SupabaseMediaRepository implements EditorialMediaRepository {
  constructor(
    private readonly client: SupabaseClientLike,
    private readonly bucket = "blog-media",
    private readonly pathPrefix = "uploads"
  ) {}

  async uploadMedia(upload: EditorialMediaUpload) {
    if (!this.client.storage) {
      throw createAdapterError(
        "STORAGE_UNAVAILABLE",
        "Supabase storage is not available on the injected client"
      );
    }

    const fileName = sanitizeStorageFileName(upload.fileName);
    const pathPrefix = this.pathPrefix.replace(/^\/+|\/+$/g, "");
    const storagePath = pathPrefix ? `${pathPrefix}/${fileName}` : fileName;
    const bucket = this.client.storage.from(this.bucket);
    const { data, error } = await bucket.upload(storagePath, upload.data, {
      contentType: upload.contentType,
      upsert: false
    });

    if (error || !data) {
      throw createAdapterError("WRITE_FAILED", "Failed to upload media", error);
    }

    const publicUrl = bucket.getPublicUrl(data.path).data.publicUrl;

    return {
      url: publicUrl,
      path: data.path,
      contentType: upload.contentType,
      size: upload.data.byteLength
    };
  }
}

export async function resolveSupabaseEditorSession(
  options: SupabaseEditorSessionResolverOptions
): Promise<EditorSession> {
  const { data, error } = await options.client.auth.getUser();

  if (error || !data.user) {
    return {
      isAuthenticated: false,
      roles: [],
      permissions: []
    };
  }

  const roles = options.mapRoles
    ? options.mapRoles(data.user)
    : defaultRolesFromUser(data.user);
  const permissions = options.mapPermissions
    ? options.mapPermissions(data.user, roles)
    : defaultPermissionsFromRoles(roles);

  return {
    userId: data.user.id,
    displayName: options.getDisplayName
      ? options.getDisplayName(data.user)
      : defaultDisplayName(data.user),
    isAuthenticated: true,
    roles,
    permissions
  };
}

export function createSupabaseAdapter(options: SupabaseAdapterOptions) {
  return {
    posts: new SupabasePostRepository(options.client),
    authors: new SupabaseAuthorRepository(options.client),
    categories: new SupabaseCategoryRepository(options.client),
    editorial: new SupabaseEditorialRepository(options.client),
    media: new SupabaseMediaRepository(
      options.client,
      options.mediaBucket,
      options.mediaPathPrefix
    )
  };
}
