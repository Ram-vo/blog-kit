import { describe, expect, it } from "vitest";
import type { EditorPermission, Post } from "blog-kit-core";
import {
  type AuthorRow,
  type CategoryRow,
  type PostCategoryRow,
  type PostRow,
  resolveSupabaseEditorSession,
  SupabaseAdapterError,
  SupabaseAuthorRepository,
  SupabaseCategoryRepository,
  SupabaseEditorialRepository,
  SupabaseMediaRepository,
  SupabasePostRepository,
  type SupabaseAuthClientLike,
  type SupabaseClientLike,
  type SupabaseStorageLike,
  type SupabaseTableRowMap
} from "./index";

type TableRecord = Record<string, unknown>;
type TableName = keyof SupabaseTableRowMap;
type Store = {
  posts: PostRow[];
  authors: AuthorRow[];
  categories: CategoryRow[];
  post_categories: PostCategoryRow[];
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function createPostStore(): Store {
  return {
    posts: [
      {
        id: "post-1",
        slug: "hello-world",
        title: "Hello world",
        excerpt: "A first post",
        tags: ["intro", "welcome"],
        mdx_content: "Hello from the adapter",
        cover_image_url: null,
        published_at: "2026-04-10T08:00:00.000Z",
        is_draft: false,
        author_id: "author-1",
        created_at: "2026-04-10T08:00:00.000Z",
        updated_at: "2026-04-10T08:00:00.000Z",
        author: {
          id: "author-1",
          full_name: "Ada Lovelace",
          bio: "Writer",
          avatar_url: null,
          social_links: { github: "https://github.com/ada" },
          created_at: "2026-04-10T08:00:00.000Z",
          updated_at: "2026-04-10T08:00:00.000Z"
        },
        categories: [
          {
            id: "category-1",
            name: "Guides",
            slug: "guides"
          }
        ]
      },
      {
        id: "post-2",
        slug: "draft-post",
        title: "Draft post",
        excerpt: "Still in progress",
        tags: ["draft"],
        mdx_content: "Draft body",
        cover_image_url: null,
        published_at: null,
        is_draft: true,
        author_id: "author-1",
        created_at: "2026-04-11T08:00:00.000Z",
        updated_at: "2026-04-11T08:00:00.000Z",
        author: {
          id: "author-1",
          full_name: "Ada Lovelace",
          bio: "Writer",
          avatar_url: null,
          social_links: { github: "https://github.com/ada" },
          created_at: "2026-04-10T08:00:00.000Z",
          updated_at: "2026-04-10T08:00:00.000Z"
        },
        categories: [
          {
            id: "category-2",
            name: "Drafts",
            slug: "drafts"
          }
        ]
      }
    ],
    authors: [
      {
        id: "author-1",
        full_name: "Ada Lovelace",
        bio: "Writer",
        avatar_url: null,
        social_links: { github: "https://github.com/ada" },
        created_at: "2026-04-10T08:00:00.000Z",
        updated_at: "2026-04-10T08:00:00.000Z"
      }
    ],
    categories: [
      {
        id: "category-1",
        name: "Guides",
        slug: "guides"
      },
      {
        id: "category-2",
        name: "Drafts",
        slug: "drafts"
      }
    ],
    post_categories: []
  };
}

class FakeMutationBuilder<T extends TableName> {
  constructor(
    private readonly store: Store,
    private readonly table: T,
    private readonly action: "insert" | "update" | "delete",
    private readonly payload?: unknown,
    private readonly filters: Array<{ column: string; value: unknown }> = [],
    private readonly shouldSelect = false
  ) {}

  eq(column: string, value: unknown) {
    return new FakeMutationBuilder<T>(
      this.store,
      this.table,
      this.action,
      this.payload,
      [...this.filters, { column, value }],
      this.shouldSelect
    );
  }

  select() {
    return new FakeMutationBuilder<T>(
      this.store,
      this.table,
      this.action,
      this.payload,
      this.filters,
      true
    );
  }

  async single() {
    const result = await this.run();
    return {
      data: Array.isArray(result.data) ? result.data[0] : result.data,
      error: result.error
    };
  }

  then<TResult1 = unknown, TResult2 = never>(
    onfulfilled?: ((value: { data: unknown; error: { message: string } | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    return this.run().then(onfulfilled, onrejected);
  }

  private async run() {
    const table = this.store[this.table] as SupabaseTableRowMap[T][];

    if (this.action === "insert") {
      const inserted = Array.isArray(this.payload)
        ? (this.payload as SupabaseTableRowMap[T][])
        : [this.payload as SupabaseTableRowMap[T]];

      table.push(...clone(inserted));

      return {
        data: this.shouldSelect ? clone(inserted[0]) : null,
        error: null
      };
    }

    if (this.action === "update") {
      const target = this.filterRows(table);
      for (const row of target) {
        Object.assign(row, clone(this.payload as Partial<SupabaseTableRowMap[T]>));
      }

      return {
        data: this.shouldSelect ? clone(target[0] ?? null) : null,
        error: null
      };
    }

    const remaining = table.filter((row) => !this.matches(row));
    this.store[this.table] = remaining as Store[T];

    return {
      data: null,
      error: null
    };
  }

  private filterRows(rows: SupabaseTableRowMap[T][]) {
    return rows.filter((row) => this.matches(row));
  }

  private matches(row: SupabaseTableRowMap[T]) {
    const record = row as unknown as TableRecord;
    return this.filters.every((filter) => record[filter.column] === filter.value);
  }
}

class FakeQueryBuilder<T extends TableName> {
  constructor(
    private readonly store: Store,
    private readonly table: T,
    private readonly filters: Array<{ kind: "eq" | "contains"; column: string; value: unknown }> = [],
    private readonly orderBy?: { column: string; ascending?: boolean }
  ) {}

  select() {
    return this;
  }

  eq(column: string, value: unknown) {
    return new FakeQueryBuilder<T>(this.store, this.table, [
      ...this.filters,
      { kind: "eq", column, value }
    ], this.orderBy);
  }

  contains(column: string, value: unknown) {
    return new FakeQueryBuilder<T>(this.store, this.table, [
      ...this.filters,
      { kind: "contains", column, value }
    ], this.orderBy);
  }

  order(column: string, options?: { ascending?: boolean }) {
    return new FakeQueryBuilder<T>(this.store, this.table, this.filters, {
      column,
      ascending: options?.ascending
    });
  }

  async range(from: number, to: number) {
    const rows = this.apply();
    return {
      data: clone(rows.slice(from, to + 1)),
      error: null,
      count: rows.length
    };
  }

  async single() {
    const rows = this.apply();
    return {
      data: clone(rows[0] ?? null),
      error: rows[0] ? null : { message: "Not found" }
    };
  }

  insert(value: unknown) {
    return new FakeMutationBuilder<T>(this.store, this.table, "insert", value);
  }

  update(value: unknown) {
    return new FakeMutationBuilder<T>(this.store, this.table, "update", value);
  }

  delete() {
    return new FakeMutationBuilder<T>(this.store, this.table, "delete");
  }

  then<TResult1 = unknown, TResult2 = never>(
    onfulfilled?: ((value: { data: unknown[]; error: { message: string } | null; count?: number | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    const rows = this.apply();
    return Promise.resolve({
      data: clone(rows),
      error: null,
      count: rows.length
    }).then(onfulfilled, onrejected);
  }

  private apply() {
    let rows = clone(this.store[this.table] as SupabaseTableRowMap[T][]);

    rows = rows.filter((row) =>
      this.filters.every((filter) => {
        if (filter.kind === "eq") {
          const value = resolveColumn(row, filter.column);
          return value === filter.value;
        }

        const value = resolveColumn(row, filter.column);
        const expected = Array.isArray(filter.value) ? filter.value : [filter.value];
        return Array.isArray(value) && expected.every((entry) => value.includes(entry));
      })
    );

    if (this.orderBy) {
      rows.sort((left, right) => {
        const leftValue = resolveColumn(left, this.orderBy!.column);
        const rightValue = resolveColumn(right, this.orderBy!.column);

        if (leftValue === rightValue) {
          return 0;
        }

        if (leftValue == null) {
          return 1;
        }

        if (rightValue == null) {
          return -1;
        }

        const result = leftValue > rightValue ? 1 : -1;
        return this.orderBy?.ascending === false ? -result : result;
      });
    }

    return rows;
  }
}

function resolveColumn(row: TableRecord, column: string) {
  if (column === "categories.id") {
    return (row.categories as Array<{ id: string }> | undefined)?.[0]?.id;
  }

  if (column === "categories.slug") {
    return (row.categories as Array<{ slug: string }> | undefined)?.[0]?.slug;
  }

  return row[column];
}

function createFakeClient(initialStore?: Store): SupabaseClientLike {
  const store = initialStore ?? createPostStore();

  return {
    from<T extends TableName>(table: T) {
      return new FakeQueryBuilder<T>(store, table) as never;
    }
  };
}

function createFakeStorage() {
  const uploads: Array<{
    bucket: string;
    path: string;
    body: Uint8Array;
    contentType?: string;
  }> = [];
  const storage: SupabaseStorageLike = {
    from(bucket: string) {
      return {
        async upload(path, body, options) {
          uploads.push({
            bucket,
            path,
            body,
            contentType: options?.contentType
          });

          return {
            data: { path },
            error: null
          };
        },
        getPublicUrl(path) {
          return {
            data: {
              publicUrl: `https://cdn.example.com/${bucket}/${path}`
            }
          };
        }
      };
    }
  };

  return { storage, uploads };
}

function createErrorClient(message: string): SupabaseClientLike {
  return {
    from<T extends TableName>(_table: T) {
      return {
        select() {
          return this;
        },
        eq() {
          return this;
        },
        contains() {
          return this;
        },
        order() {
          return this;
        },
        async range() {
          return {
            data: [],
            error: { message },
            count: 0
          };
        },
        async single() {
          return {
            data: null,
            error: { message }
          };
        },
        insert() {
          return this;
        },
        update() {
          return this;
        },
        delete() {
          return this;
        },
        then(onfulfilled?: ((value: { data: never[]; error: { message: string }; count?: number | null }) => unknown) | null) {
          return Promise.resolve({
            data: [],
            error: { message },
            count: 0
          }).then(onfulfilled ?? undefined);
        }
      } as never;
    }
  };
}

describe("SupabasePostRepository", () => {
  it("maps a published post into the public domain model", async () => {
    const repository = new SupabasePostRepository(createFakeClient());
    const post = await repository.getPostBySlug("hello-world");

    expect(post?.title).toBe("Hello world");
    expect(post?.content).toBe("Hello from the adapter");
    expect(post?.author?.fullName).toBe("Ada Lovelace");
    expect(post?.categories[0]?.slug).toBe("guides");
  });

  it("filters posts by tag and draft flag", async () => {
    const repository = new SupabasePostRepository(createFakeClient());
    const result = await repository.getPosts(1, 10, {
      tag: "intro",
      isDraft: false
    });

    expect(result.total).toBe(1);
    expect(result.posts[0]?.slug).toBe("hello-world");
  });

  it("creates a post and links categories", async () => {
    const client = createFakeClient();
    const repository = new SupabasePostRepository(client);
    const newPost: Omit<Post, "id" | "createdAt" | "updatedAt"> = {
      slug: "new-post",
      title: "New post",
      excerpt: "Created through the adapter",
      categories: [{ id: "category-1", name: "Guides", slug: "guides" }],
      tags: ["new"],
      content: "Body",
      isDraft: false
    };

    const created = await repository.createPost(newPost);

    expect(created.slug).toBe("new-post");
    expect(created.tags).toEqual(["new"]);
  });

  it("classifies read failures with a typed adapter error", async () => {
    const repository = new SupabasePostRepository(
      createErrorClient("permission denied")
    );

    await expect(repository.getPosts(1, 10)).rejects.toMatchObject({
      name: "SupabaseAdapterError",
      code: "READ_FAILED"
    } satisfies Partial<SupabaseAdapterError>);
  });
});

describe("SupabaseAuthorRepository", () => {
  it("lists authors", async () => {
    const repository = new SupabaseAuthorRepository(createFakeClient());
    const authors = await repository.listAuthors();

    expect(authors).toHaveLength(1);
    expect(authors[0]?.socialLinks?.github).toBe("https://github.com/ada");
  });
});

describe("SupabaseCategoryRepository", () => {
  it("gets a category by slug", async () => {
    const repository = new SupabaseCategoryRepository(createFakeClient());
    const category = await repository.getCategoryBySlug("guides");

    expect(category?.name).toBe("Guides");
  });
});

describe("SupabaseEditorialRepository", () => {
  it("lists editorial posts with category ids", async () => {
    const repository = new SupabaseEditorialRepository(createFakeClient());
    const posts = await repository.listPosts();
    const draft = posts.find((post) => post.slug === "draft-post");

    expect(draft?.categoryIds).toContain("category-2");
    expect(draft?.content).toBe("Draft body");
  });

  it("creates editorial posts through the post repository mapping", async () => {
    const store = createPostStore();
    const repository = new SupabaseEditorialRepository(createFakeClient(store));
    const created = await repository.createPost({
      title: "Editorial draft",
      slug: "editorial-draft",
      excerpt: "Created from the editorial surface.",
      content: "Draft body",
      categoryIds: ["category-1"],
      tags: ["editorial"],
      isDraft: true
    });

    expect(created.slug).toBe("editorial-draft");
    expect(created.isDraft).toBe(true);
    expect(store.post_categories).toContainEqual({
      post_id: created.id,
      category_id: "category-1"
    });
  });

  it("updates editorial posts and category relations", async () => {
    const store = createPostStore();
    const repository = new SupabaseEditorialRepository(createFakeClient(store));
    const updated = await repository.updatePost("post-1", {
      title: "Updated editorial post",
      categoryIds: ["category-2"],
      isDraft: true
    });

    expect(updated.title).toBe("Updated editorial post");
    expect(updated.isDraft).toBe(true);
    expect(store.post_categories).toContainEqual({
      post_id: "post-1",
      category_id: "category-2"
    });
  });

  it("deletes editorial posts", async () => {
    const repository = new SupabaseEditorialRepository(createFakeClient());

    await repository.deletePost("post-1");

    await expect(repository.getPostById("post-1")).resolves.toBeNull();
  });

  it("creates an editorial category through the categories table", async () => {
    const repository = new SupabaseEditorialRepository(createFakeClient());
    const category = await repository.createCategory({
      name: "Architecture",
      slug: "architecture"
    });

    expect(category.slug).toBe("architecture");
  });
});

describe("SupabaseMediaRepository", () => {
  it("uploads media to Supabase Storage and returns a public URL", async () => {
    const { storage, uploads } = createFakeStorage();
    const client: SupabaseClientLike = {
      ...createFakeClient(),
      storage
    };
    const repository = new SupabaseMediaRepository(
      client,
      "blog-media",
      "editor"
    );

    const asset = await repository.uploadMedia({
      fileName: "Hero Image.png",
      contentType: "image/png",
      data: new Uint8Array([1, 2, 3])
    });

    expect(uploads[0]).toMatchObject({
      bucket: "blog-media",
      contentType: "image/png"
    });
    expect(uploads[0]?.path).toMatch(/^editor\/hero-image-/);
    expect(asset.url).toMatch(/^https:\/\/cdn\.example\.com\/blog-media\/editor\/hero-image-/);
    expect(asset.size).toBe(3);
  });

  it("classifies missing storage clients with a typed adapter error", async () => {
    const repository = new SupabaseMediaRepository(createFakeClient());

    await expect(
      repository.uploadMedia({
        fileName: "image.png",
        contentType: "image/png",
        data: new Uint8Array([1])
      })
    ).rejects.toMatchObject({
      code: "STORAGE_UNAVAILABLE"
    } satisfies Partial<SupabaseAdapterError>);
  });
});

describe("resolveSupabaseEditorSession", () => {
  it("maps Supabase metadata roles into editor permissions", async () => {
    const client: SupabaseAuthClientLike = {
      auth: {
        async getUser() {
          return {
            data: {
              user: {
                id: "user-1",
                email: "editor@example.com",
                app_metadata: {
                  roles: ["editor"]
                }
              }
            },
            error: null
          };
        }
      }
    };

    const session = await resolveSupabaseEditorSession({ client });

    expect(session.isAuthenticated).toBe(true);
    expect(session.roles).toEqual(["editor"]);
    expect(session.permissions).toEqual(
      expect.arrayContaining<EditorPermission>([
        "posts:create",
        "posts:edit:any",
        "posts:publish",
        "categories:manage"
      ])
    );
  });
});
