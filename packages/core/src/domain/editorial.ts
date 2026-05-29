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

export type EditorialValidationMode = "draft" | "publish" | "schedule";

export type EditorialValidationField =
  | "title"
  | "slug"
  | "excerpt"
  | "content"
  | "categoryIds"
  | "coverImageUrl"
  | "publishedAt";

export interface EditorialValidationIssue {
  field: EditorialValidationField;
  message: string;
  severity: "error" | "warning";
}

export interface EditorialValidationOptions {
  now?: Date | (() => Date);
}

type ValidationIssueInput = {
  field: EditorialValidationField;
  message: string;
  severity?: EditorialValidationIssue["severity"];
};

const REQUIRED_DRAFT_FIELDS = ["title", "slug"] as const;

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

function toNow(options: EditorialValidationOptions): Date {
  if (!options.now) {
    return new Date();
  }

  return options.now instanceof Date ? options.now : options.now();
}

function toIssue({
  field,
  message,
  severity = "error"
}: ValidationIssueInput): EditorialValidationIssue {
  return {
    field,
    message,
    severity
  };
}

function isRequiredDraftField(field: EditorialValidationField): boolean {
  return REQUIRED_DRAFT_FIELDS.some((requiredField) => requiredField === field);
}

function shouldValidatePublishFields(mode: EditorialValidationMode): boolean {
  return mode === "publish" || mode === "schedule";
}

function isValidFutureDate(value: string, now: Date): boolean {
  const timestamp = Date.parse(value);

  return Number.isFinite(timestamp) && timestamp > now.getTime();
}

export function validateEditorialPostInput(
  post: EditorialPostInput,
  mode: EditorialValidationMode = "draft",
  options: EditorialValidationOptions = {}
): EditorialValidationIssue[] {
  const issues: EditorialValidationIssue[] = [];

  if (!post.title.trim()) {
    issues.push(toIssue({
      field: "title",
      message: "Add a title before saving."
    }));
  }

  if (!post.slug.trim()) {
    issues.push(toIssue({
      field: "slug",
      message: "Add a slug before saving."
    }));
  } else if (!isValidSlug(post.slug)) {
    issues.push(toIssue({
      field: "slug",
      message: "Use a lowercase slug with words separated by hyphens."
    }));
  }

  if (post.coverImageUrl && !isValidUrlLike(post.coverImageUrl)) {
    issues.push(toIssue({
      field: "coverImageUrl",
      message: "Use an absolute URL or a root-relative image path."
    }));
  }

  if (shouldValidatePublishFields(mode)) {
    if (!post.excerpt?.trim()) {
      issues.push(toIssue({
        field: "excerpt",
        message: "Add an excerpt before publishing."
      }));
    }

    if (!post.content.trim()) {
      issues.push(toIssue({
        field: "content",
        message: "Add post content before publishing."
      }));
    }

    if (post.categoryIds.length === 0) {
      issues.push(toIssue({
        field: "categoryIds",
        message: "Select at least one category before publishing."
      }));
    }
  }

  if (mode === "schedule") {
    if (!post.publishedAt) {
      issues.push(toIssue({
        field: "publishedAt",
        message: "Choose a future publish date before scheduling."
      }));
    } else if (!isValidFutureDate(post.publishedAt, toNow(options))) {
      issues.push(toIssue({
        field: "publishedAt",
        message: "Choose a valid future publish date before scheduling."
      }));
    }
  }

  return mode === "draft"
    ? issues.filter((issue) => isRequiredDraftField(issue.field))
    : issues;
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
