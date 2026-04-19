import type { EditorialPostInput } from "blog-kit-core";
import { NextResponse } from "next/server";
import { createStarterEditorialRepository } from "../../../../src/editorial/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = (await request.json()) as EditorialPostInput;
  const { editorial } = createStarterEditorialRepository();
  const post = await editorial.createPost(payload);

  return NextResponse.json(post);
}
