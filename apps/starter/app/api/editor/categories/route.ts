import {
  createCategoryResponse,
  listCategoriesResponse
} from "../../../../src/editorial/api-handlers";
import { createStarterEditorialRepository } from "../../../../src/editorial/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return listCategoriesResponse(createStarterEditorialRepository());
}

export async function POST(request: Request) {
  return createCategoryResponse(request, createStarterEditorialRepository());
}
