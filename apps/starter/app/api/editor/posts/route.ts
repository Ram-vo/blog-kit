import { createPostResponse } from "../../../../src/editorial/api-handlers";
import { createStarterEditorialRepository } from "../../../../src/editorial/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return createPostResponse(request, createStarterEditorialRepository());
}
