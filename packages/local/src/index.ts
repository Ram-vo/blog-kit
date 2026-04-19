import { mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import matter from "gray-matter";
import type {
  EditorialCategoryInput,
  EditorialCategoryOption,
  EditorialPost,
  EditorialPostInput,
  EditorialRepository
} from "blog-kit-core";

export interface LocalAdapterOptions {
  contentDirectory: string;
  categoriesFilePath?: string;
}

type EditorialFrontmatter = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  categoryIds?: string[];
  tags?: string[];
  coverImageUrl?: string;
  isDraft?: boolean;
  authorId?: string;
  publishedAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

function toIsoDateString(value: string | Date | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  return value instanceof Date ? value.toISOString() : value;
}

function toPostFilePath(contentDirectory: string, slug: string) {
  return join(contentDirectory, `${slug}.mdx`);
}

function toCategoriesFilePath(options: LocalAdapterOptions) {
  return options.categoriesFilePath ?? join(options.contentDirectory, "_categories.json");
}

function mapFrontmatterToPost(
  frontmatter: EditorialFrontmatter,
  content: string
): EditorialPost | null {
  if (!frontmatter.id || !frontmatter.title || !frontmatter.slug) {
    return null;
  }

  return {
    id: frontmatter.id,
    title: frontmatter.title,
    slug: frontmatter.slug,
    excerpt: frontmatter.excerpt,
    content,
    categoryIds: frontmatter.categoryIds ?? [],
    tags: frontmatter.tags ?? [],
    coverImageUrl: frontmatter.coverImageUrl,
    isDraft: frontmatter.isDraft ?? true,
    authorId: frontmatter.authorId,
    publishedAt: toIsoDateString(frontmatter.publishedAt),
    createdAt: toIsoDateString(frontmatter.createdAt) ?? new Date(0).toISOString(),
    updatedAt: toIsoDateString(frontmatter.updatedAt) ?? new Date(0).toISOString()
  };
}

function toFrontmatter(post: EditorialPost): EditorialFrontmatter {
  return Object.fromEntries(
    Object.entries({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      categoryIds: post.categoryIds,
      tags: post.tags,
      coverImageUrl: post.coverImageUrl,
      isDraft: post.isDraft,
      authorId: post.authorId,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    }).filter(([, value]) => value !== undefined)
  ) as EditorialFrontmatter;
}

async function ensureDirectory(directory: string) {
  await mkdir(directory, { recursive: true });
}

export class LocalEditorialRepository implements EditorialRepository {
  constructor(private readonly options: LocalAdapterOptions) {}

  async listPosts(): Promise<EditorialPost[]> {
    const posts = await this.readPosts();
    return posts.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }

  async getPostById(id: string): Promise<EditorialPost | null> {
    const posts = await this.readPosts();
    return posts.find((post) => post.id === id) ?? null;
  }

  async getPostBySlug(slug: string): Promise<EditorialPost | null> {
    const filePath = toPostFilePath(this.options.contentDirectory, slug);

    try {
      return await this.readPost(filePath);
    } catch {
      return null;
    }
  }

  async createPost(post: EditorialPostInput): Promise<EditorialPost> {
    await ensureDirectory(this.options.contentDirectory);

    const now = new Date().toISOString();
    const nextPost: EditorialPost = {
      ...post,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now
    };

    const filePath = toPostFilePath(this.options.contentDirectory, nextPost.slug);
    const fileContents = matter.stringify(nextPost.content, toFrontmatter(nextPost));

    await writeFile(filePath, fileContents, "utf8");

    return nextPost;
  }

  async updatePost(id: string, post: Partial<EditorialPostInput>): Promise<EditorialPost> {
    const existing = await this.getPostById(id);

    if (!existing) {
      throw new Error(`Local post ${id} was not found.`);
    }

    const nextPost: EditorialPost = {
      ...existing,
      ...post,
      updatedAt: new Date().toISOString()
    };

    const previousFilePath = toPostFilePath(this.options.contentDirectory, existing.slug);
    const nextFilePath = toPostFilePath(this.options.contentDirectory, nextPost.slug);
    const fileContents = matter.stringify(nextPost.content, toFrontmatter(nextPost));

    await writeFile(nextFilePath, fileContents, "utf8");

    if (previousFilePath !== nextFilePath) {
      await rm(previousFilePath, { force: true });
    }

    return nextPost;
  }

  async deletePost(id: string): Promise<void> {
    const existing = await this.getPostById(id);

    if (!existing) {
      return;
    }

    await rm(toPostFilePath(this.options.contentDirectory, existing.slug), {
      force: true
    });
  }

  async listCategories(): Promise<EditorialCategoryOption[]> {
    const categoriesFilePath = toCategoriesFilePath(this.options);

    try {
      const contents = await readFile(categoriesFilePath, "utf8");
      return JSON.parse(contents) as EditorialCategoryOption[];
    } catch {
      return [];
    }
  }

  async createCategory(category: EditorialCategoryInput): Promise<EditorialCategoryOption> {
    const categoriesFilePath = toCategoriesFilePath(this.options);
    const categories = await this.listCategories();
    const nextCategory: EditorialCategoryOption = {
      id: category.slug,
      name: category.name,
      slug: category.slug
    };

    if (categories.some((item) => item.slug === category.slug)) {
      return nextCategory;
    }

    await ensureDirectory(dirname(categoriesFilePath));
    await writeFile(
      categoriesFilePath,
      JSON.stringify([...categories, nextCategory], null, 2),
      "utf8"
    );

    return nextCategory;
  }

  private async readPosts(): Promise<EditorialPost[]> {
    await ensureDirectory(this.options.contentDirectory);

    const files = await readdir(this.options.contentDirectory);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));
    const posts = await Promise.all(
      mdxFiles.map((fileName) =>
        this.readPost(join(this.options.contentDirectory, fileName))
      )
    );

    return posts.filter((post): post is EditorialPost => Boolean(post));
  }

  private async readPost(filePath: string): Promise<EditorialPost | null> {
    const source = await readFile(filePath, "utf8");
    const parsed = matter(source);
    return mapFrontmatterToPost(parsed.data as EditorialFrontmatter, parsed.content);
  }
}

export function createLocalAdapter(options: LocalAdapterOptions) {
  return {
    editorial: new LocalEditorialRepository(options)
  };
}
