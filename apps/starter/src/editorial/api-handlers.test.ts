import { describe, expect, it, vi } from "vitest";
import type {
  EditorialCategoryOption,
  EditorialMediaAsset,
  EditorialPost
} from "blog-kit-core";
import {
  createCategoryResponse,
  createPostResponse,
  deletePostResponse,
  getPostResponse,
  listCategoriesResponse,
  type StarterEditorialApiContext,
  updatePostResponse,
  uploadMediaResponse
} from "./api-handlers";

const post: EditorialPost = {
  id: "post-1",
  title: "Starter post",
  slug: "starter-post",
  excerpt: "A starter post.",
  content: "Body",
  categoryIds: ["architecture"],
  tags: ["starter"],
  isDraft: true,
  createdAt: "2026-04-01T10:00:00.000Z",
  updatedAt: "2026-04-01T10:00:00.000Z"
};

const category: EditorialCategoryOption = {
  id: "architecture",
  name: "Architecture",
  slug: "architecture"
};

const mediaAsset: EditorialMediaAsset = {
  url: "/blog-media/hero.png",
  path: "/tmp/hero.png",
  contentType: "image/png",
  size: 3
};

function createContext(): StarterEditorialApiContext {
  return {
    editorial: {
      createPost: vi.fn(async () => post),
      getPostById: vi.fn(async () => post),
      getPostBySlug: vi.fn(async () => post),
      updatePost: vi.fn(async () => ({ ...post, title: "Updated post" })),
      deletePost: vi.fn(async () => undefined),
      listPosts: vi.fn(async () => [post]),
      listCategories: vi.fn(async () => [category]),
      createCategory: vi.fn(async () => category)
    },
    media: {
      uploadMedia: vi.fn(async () => mediaAsset)
    }
  };
}

function jsonRequest(payload: unknown) {
  return new Request("http://localhost/api/editor/posts", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

describe("starter editor API handlers", () => {
  it("creates, reads, updates, and deletes posts through the provider", async () => {
    const context = createContext();
    const created = await createPostResponse(jsonRequest(post), context);
    const fetched = await getPostResponse("post-1", context);
    const updated = await updatePostResponse(
      "post-1",
      jsonRequest({ title: "Updated post" }),
      context
    );
    const deleted = await deletePostResponse("post-1", context);

    await expect(created.json()).resolves.toMatchObject({ id: "post-1" });
    await expect(fetched.json()).resolves.toMatchObject({ id: "post-1" });
    await expect(updated.json()).resolves.toMatchObject({ title: "Updated post" });
    await expect(deleted.json()).resolves.toEqual({ success: true });
    expect(context.editorial.updatePost).toHaveBeenCalledWith("post-1", {
      title: "Updated post"
    });
    expect(context.editorial.deletePost).toHaveBeenCalledWith("post-1");
  });

  it("returns a 404 when an editor post does not exist", async () => {
    const context = createContext();
    vi.mocked(context.editorial.getPostById).mockResolvedValueOnce(null);

    const response = await getPostResponse("missing", context);

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ message: "Post not found" });
  });

  it("lists and creates editorial categories", async () => {
    const context = createContext();
    const listed = await listCategoriesResponse(context);
    const created = await createCategoryResponse(
      jsonRequest({ name: "Architecture", slug: "architecture" }),
      context
    );

    await expect(listed.json()).resolves.toEqual([category]);
    await expect(created.json()).resolves.toEqual(category);
  });

  it("returns 400 when category creation is not available", async () => {
    const context = createContext();
    context.editorial.createCategory = undefined;

    const response = await createCategoryResponse(
      jsonRequest({ name: "Architecture", slug: "architecture" }),
      context
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: "Category creation is not available."
    });
  });

  it("uploads image media through the active media repository", async () => {
    const context = createContext();
    const formData = new FormData();
    formData.set("file", new File([new Uint8Array([1, 2, 3])], "hero.png", {
      type: "image/png"
    }));

    const response = await uploadMediaResponse(
      new Request("http://localhost/api/editor/media", {
        method: "POST",
        body: formData
      }),
      context
    );

    expect(context.media.uploadMedia).toHaveBeenCalledWith(
      expect.objectContaining({
        fileName: "hero.png",
        contentType: "image/png"
      })
    );
    await expect(response.json()).resolves.toEqual(mediaAsset);
  });

  it("rejects media uploads without an image file", async () => {
    const context = createContext();
    const formData = new FormData();
    formData.set("file", new File(["text"], "notes.txt", { type: "text/plain" }));

    const response = await uploadMediaResponse(
      new Request("http://localhost/api/editor/media", {
        method: "POST",
        body: formData
      }),
      context
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: "Only image uploads are supported."
    });
  });
});
