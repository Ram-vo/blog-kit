import type { EditorialCategoryInput } from "blog-kit-core";
import { NextResponse } from "next/server";
import { createStarterEditorialRepository } from "../../../../src/editorial/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { editorial } = createStarterEditorialRepository();
  const categories = await editorial.listCategories();

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as EditorialCategoryInput;
  const { editorial } = createStarterEditorialRepository();

  if (!editorial.createCategory) {
    return NextResponse.json(
      { message: "Category creation is not available." },
      { status: 400 }
    );
  }

  const category = await editorial.createCategory(payload);

  return NextResponse.json(category);
}
