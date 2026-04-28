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
