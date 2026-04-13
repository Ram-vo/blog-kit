import type { EditorialCategoryInput } from "blog-kit-core";
import { NextResponse } from "next/server";
import { createStarterLocalAdapter } from "../../../../src/editorial/local-editorial";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const adapter = createStarterLocalAdapter();
  const categories = await adapter.editorial.listCategories();

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as EditorialCategoryInput;
  const adapter = createStarterLocalAdapter();

  if (!adapter.editorial.createCategory) {
    return NextResponse.json(
      { message: "Category creation is not available." },
      { status: 400 }
    );
  }

  const category = await adapter.editorial.createCategory(payload);

  return NextResponse.json(category);
}
