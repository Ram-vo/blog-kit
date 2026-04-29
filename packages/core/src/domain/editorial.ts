import type { Category, UserRole } from "./entities.js";

export type EditorPermission =
  | "posts:create"
  | "posts:edit:any"
  | "posts:edit:own"
  | "posts:publish"
  | "posts:delete:any"
  | "posts:delete:own"
  | "categories:manage"
  | "media:upload";

export interface EditorSession {
  userId?: string;
  displayName?: string;
  isAuthenticated: boolean;
  roles: readonly UserRole[];
  permissions: readonly EditorPermission[];
}

export interface EditorialPostInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  categoryIds: string[];
  tags: string[];
  coverImageUrl?: string;
  isDraft: boolean;
  authorId?: string;
  publishedAt?: string;
}

export interface EditorialPost extends EditorialPostInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditorialCategoryInput {
  name: string;
  slug: string;
}

export interface EditorialCategoryOption extends Pick<Category, "id" | "name" | "slug"> {}

export interface EditorialMediaUpload {
  fileName: string;
  contentType: string;
  data: Uint8Array;
}

export interface EditorialMediaAsset {
  url: string;
  path?: string;
  contentType?: string;
  size?: number;
}

export type EditorialValidationMode = "draft" | "publish";

export type EditorialValidationField =
  | "title"
  | "slug"
  | "excerpt"
  | "content"
  | "categoryIds"
  | "coverImageUrl";

export interface EditorialValidationIssue {
  field: EditorialValidationField;
  message: string;
  severity: "error" | "warning";
}

function isValidSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function isValidUrlLike(value: string) {
  return (
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  );
}

export function validateEditorialPostInput(
  post: EditorialPostInput,
  mode: EditorialValidationMode = "draft"
): EditorialValidationIssue[] {
  const issues: EditorialValidationIssue[] = [];

  if (!post.title.trim()) {
    issues.push({
      field: "title",
      message: "Add a title before saving.",
      severity: "error"
    });
  }

  if (!post.slug.trim()) {
    issues.push({
      field: "slug",
      message: "Add a slug before saving.",
      severity: "error"
    });
  } else if (!isValidSlug(post.slug)) {
    issues.push({
      field: "slug",
      message: "Use a lowercase slug with words separated by hyphens.",
      severity: "error"
    });
  }

  if (post.coverImageUrl && !isValidUrlLike(post.coverImageUrl)) {
    issues.push({
      field: "coverImageUrl",
      message: "Use an absolute URL or a root-relative image path.",
      severity: "error"
    });
  }

  if (mode === "publish") {
    if (!post.excerpt?.trim()) {
      issues.push({
        field: "excerpt",
        message: "Add an excerpt before publishing.",
        severity: "error"
      });
    }

    if (!post.content.trim()) {
      issues.push({
        field: "content",
        message: "Add post content before publishing.",
        severity: "error"
      });
    }

    if (post.categoryIds.length === 0) {
      issues.push({
        field: "categoryIds",
        message: "Select at least one category before publishing.",
        severity: "warning"
      });
    }
  }

  return issues;
}

export function hasEditorPermission(
  session: EditorSession | null | undefined,
  permission: EditorPermission
): boolean {
  return session?.permissions.includes(permission) ?? false;
}

export function canEditPost(
  session: EditorSession | null | undefined,
  post: Pick<EditorialPost, "authorId">
): boolean {
  if (!session?.isAuthenticated) {
    return false;
  }

  if (hasEditorPermission(session, "posts:edit:any")) {
    return true;
  }

  return (
    hasEditorPermission(session, "posts:edit:own") &&
    Boolean(session.userId) &&
    session.userId === post.authorId
  );
}

export function canDeletePost(
  session: EditorSession | null | undefined,
  post: Pick<EditorialPost, "authorId">
): boolean {
  if (!session?.isAuthenticated) {
    return false;
  }

  if (hasEditorPermission(session, "posts:delete:any")) {
    return true;
  }

  return (
    hasEditorPermission(session, "posts:delete:own") &&
    Boolean(session.userId) &&
    session.userId === post.authorId
  );
}

export function canPublishPost(session: EditorSession | null | undefined): boolean {
  return hasEditorPermission(session, "posts:publish");
}
