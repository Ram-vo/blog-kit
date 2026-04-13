import type { EditorialPostInput } from "blog-kit-core";
import { NextResponse } from "next/server";
import { createStarterLocalAdapter } from "../../../../src/editorial/local-editorial";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = (await request.json()) as EditorialPostInput;
  const adapter = createStarterLocalAdapter();
  const post = await adapter.editorial.createPost(payload);

  return NextResponse.json(post);
}
