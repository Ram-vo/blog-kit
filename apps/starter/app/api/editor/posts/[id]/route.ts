import type { EditorialPostInput } from "blog-kit-core";
import { NextResponse } from "next/server";
import { createStarterEditorialRepository } from "../../../../../src/editorial/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { editorial } = createStarterEditorialRepository();
  const post = await editorial.getPostById(id);

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const payload = (await request.json()) as Partial<EditorialPostInput>;
  const { editorial } = createStarterEditorialRepository();
  const post = await editorial.updatePost(id, payload);

  return NextResponse.json(post);
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { editorial } = createStarterEditorialRepository();

  await editorial.deletePost(id);

  return NextResponse.json({ success: true });
}
