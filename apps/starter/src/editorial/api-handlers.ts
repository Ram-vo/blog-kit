import type {
  EditorialCategoryInput,
  EditorialMediaRepository,
  EditorialPostInput,
  EditorialRepository
} from "blog-kit-core";
import { NextResponse } from "next/server";

export interface StarterEditorialApiContext {
  editorial: EditorialRepository;
  media: EditorialMediaRepository;
}

function getFormFile(formData: FormData) {
  const file = formData.get("file");
  return file instanceof File ? file : null;
}

export async function createPostResponse(
  request: Request,
  context: StarterEditorialApiContext
) {
  const payload = (await request.json()) as EditorialPostInput;
  const post = await context.editorial.createPost(payload);

  return NextResponse.json(post);
}

export async function getPostResponse(
  id: string,
  context: StarterEditorialApiContext
) {
  const post = await context.editorial.getPostById(id);

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function updatePostResponse(
  id: string,
  request: Request,
  context: StarterEditorialApiContext
) {
  const payload = (await request.json()) as Partial<EditorialPostInput>;
  const post = await context.editorial.updatePost(id, payload);

  return NextResponse.json(post);
}

export async function deletePostResponse(
  id: string,
  context: StarterEditorialApiContext
) {
  await context.editorial.deletePost(id);

  return NextResponse.json({ success: true });
}

export async function listCategoriesResponse(context: StarterEditorialApiContext) {
  const categories = await context.editorial.listCategories();

  return NextResponse.json(categories);
}

export async function createCategoryResponse(
  request: Request,
  context: StarterEditorialApiContext
) {
  const payload = (await request.json()) as EditorialCategoryInput;

  if (!context.editorial.createCategory) {
    return NextResponse.json(
      { message: "Category creation is not available." },
      { status: 400 }
    );
  }

  const category = await context.editorial.createCategory(payload);

  return NextResponse.json(category);
}

export async function uploadMediaResponse(
  request: Request,
  context: StarterEditorialApiContext
) {
  const formData = await request.formData();
  const file = getFormFile(formData);

  if (!file) {
    return NextResponse.json(
      { message: "Upload requires a file field." },
      { status: 400 }
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { message: "Only image uploads are supported." },
      { status: 400 }
    );
  }

  const asset = await context.media.uploadMedia({
    fileName: file.name,
    contentType: file.type,
    data: new Uint8Array(await file.arrayBuffer())
  });

  return NextResponse.json(asset);
}
