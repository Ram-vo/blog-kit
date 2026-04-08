import { describe, expect, it } from "vitest";
import type { Post } from "blog-kit-core";
import {
  SupabaseAuthorRepository,
  SupabaseCategoryRepository,
  SupabasePostRepository,
  type SupabaseClientLike
} from "./index";

type TableRecord = Record<string, unknown>;
type Store = Record<string, TableRecord[]>;

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

class FakeMutationBuilder {
  constructor(
    private readonly store: Store,
    private readonly table: string,
    private readonly action: "insert" | "update" | "delete",
    private readonly payload?: unknown,
    private readonly filters: Array<{ column: string; value: unknown }> = [],
    private readonly shouldSelect = false
  ) {}

  eq(column: string, value: unknown) {
    return new FakeMutationBuilder(
      this.store,
      this.table,
      this.action,
      this.payload,
      [...this.filters, { column, value }],
      this.shouldSelect
    );
  }

  select() {
    return new FakeMutationBuilder(
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
    const table = this.store[this.table] ?? [];

    if (this.action === "insert") {
      const inserted = Array.isArray(this.payload)
        ? (this.payload as TableRecord[])
        : [this.payload as TableRecord];

      table.push(...clone(inserted));

      return {
        data: this.shouldSelect ? clone(inserted[0]) : null,
        error: null
      };
    }

    if (this.action === "update") {
      const target = this.filterRows(table);
      for (const row of target) {
        Object.assign(row, clone(this.payload as TableRecord));
      }

      return {
        data: this.shouldSelect ? clone(target[0] ?? null) : null,
        error: null
      };
    }

    const remaining = table.filter((row) => !this.matches(row));
    this.store[this.table] = remaining;

    return {
      data: null,
      error: null
    };
  }

  private filterRows(rows: TableRecord[]) {
    return rows.filter((row) => this.matches(row));
  }

  private matches(row: TableRecord) {
    return this.filters.every((filter) => row[filter.column] === filter.value);
  }
}

class FakeQueryBuilder {
  constructor(
    private readonly store: Store,
    private readonly table: string,
    private readonly filters: Array<{ kind: "eq" | "contains"; column: string; value: unknown }> = [],
    private readonly orderBy?: { column: string; ascending?: boolean }
  ) {}

  select() {
    return this;
  }

  eq(column: string, value: unknown) {
    return new FakeQueryBuilder(this.store, this.table, [
      ...this.filters,
      { kind: "eq", column, value }
    ], this.orderBy);
  }

  contains(column: string, value: unknown) {
    return new FakeQueryBuilder(this.store, this.table, [
      ...this.filters,
      { kind: "contains", column, value }
    ], this.orderBy);
  }

  order(column: string, options?: { ascending?: boolean }) {
    return new FakeQueryBuilder(this.store, this.table, this.filters, {
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
    return new FakeMutationBuilder(this.store, this.table, "insert", value);
  }

  update(value: unknown) {
    return new FakeMutationBuilder(this.store, this.table, "update", value);
  }

  delete() {
    return new FakeMutationBuilder(this.store, this.table, "delete");
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
    let rows = clone(this.store[this.table] ?? []);

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
    from(table: string) {
      return new FakeQueryBuilder(store, table) as never;
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
